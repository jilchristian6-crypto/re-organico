const ORIGENES_PERMITIDOS = new Set([
  "https://reorganico.cl",
  "https://www.reorganico.cl",
  "https://re-organico.vercel.app",
]);

const HOSTS_TURNSTILE_PERMITIDOS = new Set([
  "reorganico.cl",
  "www.reorganico.cl",
  "re-organico.vercel.app",
]);

const MAX_CUERPO_BYTES = 64 * 1024;
const MAX_TOKEN_TURNSTILE = 2048;
const TIMEOUT_TURNSTILE_MS = 8000;

type Json = Record<string, unknown>;

type PedidoValidado = {
  nombre: string;
  telefono: string;
  tipoEntrega: "ruta" | "despacho";
  region: string | null;
  comuna: string | null;
  direccion: string;
  empresaEnvio: string | null;
  formaPago: "efectivo" | "transferencia";
  observaciones: string | null;
  items: Array<{
    producto_id: string;
    presentacion_id: string;
    cantidad: number;
  }>;
};

function origenPermitido(origen: string | null) {
  return Boolean(origen && ORIGENES_PERMITIDOS.has(origen));
}

function encabezadosCors(req: Request) {
  const origen = req.headers.get("origin");
  const permitido = origen && ORIGENES_PERMITIDOS.has(origen)
    ? origen
    : "https://reorganico.cl";

  return {
    "Access-Control-Allow-Origin": permitido,
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin",
  };
}

function responder(
  req: Request,
  body: Json,
  status = 200,
  headersExtra: Record<string, string> = {},
) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...encabezadosCors(req),
      ...headersExtra,
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "Content-Security-Policy": "default-src 'none'; frame-ancestors 'none'",
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "DENY",
      "Referrer-Policy": "no-referrer",
    },
  });
}

function obtenerIp(req: Request) {
  const candidatos = [
    req.headers.get("cf-connecting-ip"),
    req.headers.get("x-real-ip"),
    req.headers.get("x-forwarded-for")?.split(",")[0],
  ];

  const ip = candidatos.find((valor) => typeof valor === "string" && valor.trim());
  return ip && ip.trim().length <= 64 ? ip.trim() : "desconocida";
}

async function crearClaveHmac(secreto: string) {
  return await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secreto),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
}

async function hashPrivado(clave: CryptoKey, valor: string) {
  const firma = await crypto.subtle.sign(
    "HMAC",
    clave,
    new TextEncoder().encode(valor),
  );

  return Array.from(new Uint8Array(firma))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

async function leerJsonLimitado(req: Request) {
  const largoDeclarado = Number(req.headers.get("content-length") || 0);

  if (Number.isFinite(largoDeclarado) && largoDeclarado > MAX_CUERPO_BYTES) {
    throw new Error("CUERPO_DEMASIADO_GRANDE");
  }

  const texto = await req.text();

  if (new TextEncoder().encode(texto).byteLength > MAX_CUERPO_BYTES) {
    throw new Error("CUERPO_DEMASIADO_GRANDE");
  }

  try {
    return JSON.parse(texto);
  } catch {
    throw new Error("JSON_INVALIDO");
  }
}

function texto(valor: unknown, maximo: number) {
  if (typeof valor !== "string") return "";
  const limpio = valor.trim();
  return limpio.length <= maximo ? limpio : "";
}

function contieneControles(valor: string) {
  return /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/.test(valor);
}

function validarPedido(valor: unknown):
  | { ok: true; pedido: PedidoValidado }
  | { ok: false; error: string } {
  if (!valor || typeof valor !== "object" || Array.isArray(valor)) {
    return { ok: false, error: "Los datos de la cotización no son válidos." };
  }

  const pedido = valor as Record<string, unknown>;
  const nombre = texto(pedido.nombre, 100);
  const telefono = texto(pedido.telefono, 25).replace(/\D/g, "");
  const tipoEntrega = texto(pedido.tipo_entrega, 20).toLowerCase();
  const region = texto(pedido.region, 100);
  const comuna = texto(pedido.comuna, 100);
  const direccion = texto(pedido.direccion, 200);
  const empresaEnvio = texto(pedido.empresa_envio, 50);
  const formaPago = texto(pedido.forma_pago, 30).toLowerCase();
  const observaciones = texto(pedido.observaciones, 500);
  const itemsEntrada = Array.isArray(pedido.items) ? pedido.items : [];

  if (nombre.length < 2 || contieneControles(nombre)) {
    return { ok: false, error: "El nombre no es válido." };
  }

  if (telefono.length < 8 || telefono.length > 15) {
    return { ok: false, error: "El teléfono no es válido." };
  }

  if (tipoEntrega !== "ruta" && tipoEntrega !== "despacho") {
    return { ok: false, error: "La forma de entrega no es válida." };
  }

  if (formaPago !== "efectivo" && formaPago !== "transferencia") {
    return { ok: false, error: "La forma de pago no es válida." };
  }

  if (tipoEntrega === "despacho" && formaPago !== "transferencia") {
    return { ok: false, error: "Los despachos se pagan solo por transferencia." };
  }

  if (!direccion || contieneControles(direccion)) {
    return { ok: false, error: "La dirección o sucursal es obligatoria." };
  }

  if (tipoEntrega === "ruta" && !comuna) {
    return { ok: false, error: "Selecciona una localidad de las rutas Re Orgánico." };
  }

  if (tipoEntrega === "despacho" && (!region || !comuna)) {
    return { ok: false, error: "Región y comuna son obligatorias para despacho." };
  }

  const empresasValidas = new Set([
    "Por coordinar",
    "Starken",
    "Blue Express",
    "CorreosChile",
  ]);

  if (
    tipoEntrega === "despacho" &&
    empresaEnvio &&
    !empresasValidas.has(empresaEnvio)
  ) {
    return { ok: false, error: "La empresa de envío no es válida." };
  }

  if (itemsEntrada.length < 1 || itemsEntrada.length > 40) {
    return { ok: false, error: "La cotización debe contener entre 1 y 40 productos." };
  }

  const items: PedidoValidado["items"] = [];

  for (const itemValor of itemsEntrada) {
    if (!itemValor || typeof itemValor !== "object" || Array.isArray(itemValor)) {
      return { ok: false, error: "Uno de los productos no es válido." };
    }

    const item = itemValor as Record<string, unknown>;
    const productoId = texto(item.producto_id, 120);
    const presentacionId = texto(item.presentacion_id, 120);
    const cantidad = Number(item.cantidad);

    if (
      !/^[a-zA-Z0-9_-]+$/.test(productoId) ||
      !/^[a-zA-Z0-9_-]+$/.test(presentacionId) ||
      !Number.isInteger(cantidad) ||
      cantidad < 1 ||
      cantidad > 99
    ) {
      return { ok: false, error: "Uno de los productos no es válido." };
    }

    items.push({
      producto_id: productoId,
      presentacion_id: presentacionId,
      cantidad,
    });
  }

  if (observaciones && contieneControles(observaciones)) {
    return { ok: false, error: "Las observaciones contienen caracteres no válidos." };
  }

  return {
    ok: true,
    pedido: {
      nombre,
      telefono,
      tipoEntrega,
      region: tipoEntrega === "ruta" ? "Valparaíso" : region,
      comuna,
      direccion,
      empresaEnvio: tipoEntrega === "ruta"
        ? "Ruta Re Orgánico"
        : (empresaEnvio || "Por coordinar"),
      formaPago,
      observaciones: observaciones || null,
      items,
    },
  };
}

async function comprobarLimite(
  supabaseUrl: string,
  serviceRoleKey: string,
  tipo: "ip" | "telefono",
  hash: string,
) {
  const respuesta = await fetch(
    `${supabaseUrl}/rest/v1/rpc/verificar_limite_pedido`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
      },
      body: JSON.stringify({ p_tipo: tipo, p_hash: hash }),
    },
  );

  if (!respuesta.ok) throw new Error("LIMITE_NO_DISPONIBLE");

  const datos = await respuesta.json();
  const resultado = Array.isArray(datos) ? datos[0] : datos;

  if (typeof resultado?.permitido !== "boolean") {
    throw new Error("LIMITE_RESPUESTA_INVALIDA");
  }

  return resultado as {
    permitido: boolean;
    reintentar_en: number;
    motivo: string;
  };
}

Deno.serve(async (req: Request) => {
  const solicitudId = crypto.randomUUID();

  if (!origenPermitido(req.headers.get("origin"))) {
    return responder(req, { success: false, error: "Origen no permitido." }, 403);
  }

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: encabezadosCors(req) });
  }

  if (req.method !== "POST") {
    return responder(req, { success: false, error: "Método no permitido." }, 405, {
      Allow: "POST, OPTIONS",
    });
  }

  const tipoContenido = req.headers.get("content-type")?.toLowerCase() || "";
  if (!tipoContenido.startsWith("application/json")) {
    return responder(req, {
      success: false,
      error: "El tipo de contenido no es válido.",
    }, 415);
  }

  try {
    const turnstileSecret = Deno.env.get("TURNSTILE_SECRET_KEY");
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!turnstileSecret || !supabaseUrl || !serviceRoleKey) {
      console.error("Configuración incompleta", { solicitudId });
      return responder(req, {
        success: false,
        error: "Configuración de seguridad incompleta.",
      }, 500);
    }

    const body = await leerJsonLimitado(req);
    const token = texto(body?.token, MAX_TOKEN_TURNSTILE);
    const validacionPedido = validarPedido(body?.pedido);

    if (!token || token.length > MAX_TOKEN_TURNSTILE) {
      return responder(req, {
        success: false,
        error: "Debes completar la verificación de seguridad.",
      }, 400);
    }

    if (!validacionPedido.ok) {
      return responder(req, { success: false, error: validacionPedido.error }, 400);
    }

    const pedido = validacionPedido.pedido;
    const ip = obtenerIp(req);
    const claveHmac = await crearClaveHmac(turnstileSecret);
    const ipHash = await hashPrivado(claveHmac, `ip:${ip}`);
    const telefonoHash = await hashPrivado(claveHmac, `telefono:${pedido.telefono}`);

    const limiteIp = await comprobarLimite(
      supabaseUrl,
      serviceRoleKey,
      "ip",
      ipHash,
    );

    if (!limiteIp.permitido) {
      const espera = Math.max(1, Number(limiteIp.reintentar_en) || 60);
      console.warn("Límite por IP alcanzado", { solicitudId });
      return responder(req, {
        success: false,
        error: "Se realizaron demasiados intentos. Espera unos minutos.",
      }, 429, { "Retry-After": String(espera) });
    }

    const formulario = new FormData();
    formulario.append("secret", turnstileSecret);
    formulario.append("response", token);
    if (ip !== "desconocida") formulario.append("remoteip", ip);
    formulario.append("idempotency_key", crypto.randomUUID());

    const controlador = new AbortController();
    const temporizador = setTimeout(() => controlador.abort(), TIMEOUT_TURNSTILE_MS);
    let respuestaCloudflare: Response;

    try {
      respuestaCloudflare = await fetch(
        "https://challenges.cloudflare.com/turnstile/v0/siteverify",
        {
          method: "POST",
          body: formulario,
          signal: controlador.signal,
        },
      );
    } finally {
      clearTimeout(temporizador);
    }

    if (!respuestaCloudflare.ok) {
      console.warn("Turnstile no disponible", { solicitudId });
      return responder(req, {
        success: false,
        error: "No se pudo comprobar la verificación de seguridad.",
      }, 502);
    }

    const resultadoTurnstile = await respuestaCloudflare.json();
    const hostValido = HOSTS_TURNSTILE_PERMITIDOS.has(resultadoTurnstile.hostname);
    const accionValida = resultadoTurnstile.action === "pedido";
    const fechaDesafio = Date.parse(resultadoTurnstile.challenge_ts || "");
    const fechaValida = Number.isFinite(fechaDesafio) &&
      Date.now() - fechaDesafio >= -60 * 1000 &&
      Date.now() - fechaDesafio <= 5 * 60 * 1000;

    if (!resultadoTurnstile.success || !hostValido || !accionValida || !fechaValida) {
      console.warn("Turnstile rechazó la solicitud", {
        solicitudId,
        codigos: resultadoTurnstile["error-codes"] || [],
      });
      return responder(req, {
        success: false,
        error: "La verificación de seguridad fue rechazada.",
      }, 403);
    }

    const limiteTelefono = await comprobarLimite(
      supabaseUrl,
      serviceRoleKey,
      "telefono",
      telefonoHash,
    );

    if (!limiteTelefono.permitido) {
      const espera = Math.max(1, Number(limiteTelefono.reintentar_en) || 60);
      return responder(req, {
        success: false,
        error: "Ya se enviaron varias cotizaciones con este teléfono. Inténtalo más tarde.",
      }, 429, { "Retry-After": String(espera) });
    }

    const respuestaPedido = await fetch(
      `${supabaseUrl}/rest/v1/rpc/crear_pedido`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: serviceRoleKey,
          Authorization: `Bearer ${serviceRoleKey}`,
        },
        body: JSON.stringify({
          p_nombre_cliente: pedido.nombre,
          p_telefono: pedido.telefono,
          p_tipo_entrega: pedido.tipoEntrega,
          p_region: pedido.region,
          p_comuna: pedido.comuna,
          p_direccion: pedido.direccion,
          p_empresa_envio: pedido.empresaEnvio,
          p_forma_pago: pedido.formaPago,
          p_observaciones: pedido.observaciones,
          p_items: pedido.items,
        }),
      },
    );

    const textoRespuesta = await respuestaPedido.text();
    let datosPedido: unknown = null;

    try {
      datosPedido = textoRespuesta ? JSON.parse(textoRespuesta) : null;
    } catch {
      datosPedido = null;
    }

    if (!respuestaPedido.ok) {
      console.error("No se pudo crear la cotización", {
        solicitudId,
        status: respuestaPedido.status,
      });
      return responder(req, {
        success: false,
        error: "No se pudo guardar la cotización.",
      }, 500);
    }

    const pedidoGuardado = Array.isArray(datosPedido)
      ? datosPedido[0]
      : datosPedido;

    if (!pedidoGuardado || typeof pedidoGuardado !== "object" || !(pedidoGuardado as Json).codigo) {
      console.error("Respuesta inesperada al crear la cotización", { solicitudId });
      return responder(req, {
        success: false,
        error: "No se recibió el código de la cotización.",
      }, 500);
    }

    const guardado = pedidoGuardado as Json;

    return responder(req, {
      success: true,
      pedido: {
        pedido_id: guardado.pedido_id,
        codigo: guardado.codigo,
        total_referencial: guardado.total_referencial,
      },
    });
  } catch (error) {
    const codigo = error instanceof Error ? error.message : "ERROR_INTERNO";

    if (codigo === "CUERPO_DEMASIADO_GRANDE") {
      return responder(req, { success: false, error: "La solicitud es demasiado grande." }, 413);
    }

    if (codigo === "JSON_INVALIDO") {
      return responder(req, { success: false, error: "La solicitud no es válida." }, 400);
    }

    console.error("Error interno de seguridad", { solicitudId, codigo });
    return responder(req, { success: false, error: "Error interno de seguridad." }, 500);
  }
});
