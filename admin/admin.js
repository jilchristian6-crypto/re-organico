"use strict";

const CATEGORIAS = {
    bolsas: "Bolsas compostables",
    rollos: "Bolsas en rollo",
    papel: "Papel compost",
    contenedores: "Contenedores compostables",
    vasos: "Vasos compostables",
    tapas: "Tapas compostables",
    heladeria: "Heladería",
    cubiertos: "Cubiertos y sets",
    bombillas: "Bombillas compostables"
};

const CORRECCIONES_PRODUCTOS = {
    "bolsa-taco-25x35-my14": {
        nombre: "Bolsa compostable tipo taco 25 × 35 cm MY14",
        descripcion: "Bolsa compostable tipo taco. Venta mínima: 1 pack de 100 bolsas."
    },
    "rollo-basura-50x60-my16": {
        nombre: "Bolsa de basura compostable blanca en rollo 50 × 60 cm MY16",
        descripcion: "Bolsa de basura compostable blanca en rollo. Cada rollo trae 25 bolsas."
    },
    "rollo-basura-70x90-my20": {
        nombre: "Bolsa de basura compostable blanca en rollo 70 × 90 cm MY20",
        descripcion: "Bolsa de basura compostable blanca en rollo. Cada rollo trae 20 bolsas."
    },
    "rollo-camiseta-34x50-my11": {
        nombre: "Bolsa compostable tipo camiseta en rollo 34 × 50 cm MY11",
        descripcion: "Bolsa compostable tipo camiseta en rollo. Cada rollo contiene 200 bolsas."
    }
};

function normalizarProducto(producto) {
    const correccion = CORRECCIONES_PRODUCTOS[producto?.id];
    return correccion ? { ...producto, ...correccion } : producto;
}

const ESTADOS = {
    disponible: "Disponible",
    ultimas: "Últimas unidades",
    pedido: "A pedido",
    agotado: "Agotado"
};

const ESTADOS_PEDIDO = {
    cotizacion: "Cotización",
    confirmado: "Pedido confirmado",
    esperando_pago: "Esperando pago",
    pago_confirmado: "Pago confirmado",
    preparando: "Preparando",
    enviado: "Enviado",
    entregado: "Entregado",
    cancelado: "Cancelado"
};

let clienteSupabase = null;
let productos = [];
let pedidos = [];
let contenidoGaleria = [];
let usuarioActual = null;
let temporizadorToast = null;
let modoRecuperacion = false;
let mfaFactorId = null;

const elementos = {
    vistaAcceso: document.getElementById("vista-acceso"),
    vistaPanel: document.getElementById("vista-panel"),
    formularioLogin: document.getElementById("formulario-login"),
    email: document.getElementById("login-email"),
    password: document.getElementById("login-password"),
    botonLogin: document.getElementById("boton-login"),
    mostrarPassword: document.getElementById("mostrar-password"),
    mensajeLogin: document.getElementById("mensaje-login"),
    tituloAcceso: document.getElementById("titulo-acceso"),
    descripcionAcceso: document.getElementById("descripcion-acceso"),
    formularioRecuperacion: document.getElementById("formulario-recuperacion"),
    nuevaPassword: document.getElementById("nueva-password"),
    repetirPassword: document.getElementById("repetir-password"),
    botonRecuperacion: document.getElementById("boton-recuperacion"),
    formularioMfa: document.getElementById("formulario-mfa"),
    mfaConfiguracion: document.getElementById("mfa-configuracion"),
    mfaQr: document.getElementById("mfa-qr"),
    mfaSecreto: document.getElementById("mfa-secreto"),
    mfaCodigo: document.getElementById("mfa-codigo"),
    botonMfa: document.getElementById("boton-mfa"),
    correoAdmin: document.getElementById("correo-admin"),
    cerrarSesion: document.getElementById("cerrar-sesion"),
    nuevoProducto: document.getElementById("nuevo-producto"),
    actualizarListado: document.getElementById("actualizar-listado"),
    formularioProducto: document.getElementById("formulario-producto"),
    productoId: document.getElementById("producto-id"),
    productoNombre: document.getElementById("producto-nombre"),
    productoPrecio: document.getElementById("producto-precio"),
    productoMedida: document.getElementById("producto-medida"),
    productoMicras: document.getElementById("producto-micras"),
    productoP1Nombre: document.getElementById("producto-p1-nombre"),
    productoP1Unidades: document.getElementById("producto-p1-unidades"),
    productoP1Unidad: document.getElementById("producto-p1-unidad"),
    productoP1Precio: document.getElementById("producto-p1-precio"),
    productoP1Detalle: document.getElementById("producto-p1-detalle"),
    productoP2Nombre: document.getElementById("producto-p2-nombre"),
    productoP2Unidades: document.getElementById("producto-p2-unidades"),
    productoP2Unidad: document.getElementById("producto-p2-unidad"),
    productoP2Precio: document.getElementById("producto-p2-precio"),
    productoP2Detalle: document.getElementById("producto-p2-detalle"),
    productoCategoria: document.getElementById("producto-categoria"),
    productoEstado: document.getElementById("producto-estado"),
    productoEmoji: document.getElementById("producto-emoji"),
    productoEtiqueta: document.getElementById("producto-etiqueta"),
    productoOrden: document.getElementById("producto-orden"),
    productoDescripcion: document.getElementById("producto-descripcion"),
    guardarProducto: document.getElementById("guardar-producto"),
    cancelarEdicion: document.getElementById("cancelar-edicion"),
    modoFormulario: document.getElementById("modo-formulario"),
    tituloFormulario: document.getElementById("titulo-formulario"),
    mensajeProducto: document.getElementById("mensaje-producto"),
    estadoCarga: document.getElementById("estado-carga"),
    listaAdmin: document.getElementById("lista-admin"),
    pestanasPanel: document.querySelectorAll("[data-seccion-panel]"),
    seccionProductos: document.getElementById("seccion-productos"),
    seccionPedidos: document.getElementById("seccion-pedidos"),
    contadorPedidosPestana: document.getElementById("contador-pedidos-pestana"),
    actualizarPedidos: document.getElementById("actualizar-pedidos"),
    estadoPedidos: document.getElementById("estado-pedidos"),
    listaPedidos: document.getElementById("lista-pedidos"),
    resumenTotalPedidos: document.getElementById("resumen-total-pedidos"),
    resumenPedidosPendientes: document.getElementById("resumen-pedidos-pendientes"),
    resumenPagosConfirmados: document.getElementById("resumen-pagos-confirmados"),
    resumenPedidosEntregados: document.getElementById("resumen-pedidos-entregados"),

    seccionGaleria: document.getElementById("seccion-galeria"),
    contadorGaleriaPestana: document.getElementById("contador-galeria-pestana"),
    nuevoContenido: document.getElementById("nuevo-contenido"),
    actualizarGaleria: document.getElementById("actualizar-galeria"),
    formularioGaleria: document.getElementById("formulario-galeria"),
    galeriaId: document.getElementById("galeria-id"),
    galeriaPathActual: document.getElementById("galeria-path-actual"),
    galeriaTitulo: document.getElementById("galeria-titulo"),
    galeriaDescripcion: document.getElementById("galeria-descripcion"),
    galeriaArchivo: document.getElementById("galeria-archivo"),
    galeriaOrden: document.getElementById("galeria-orden"),
    galeriaActivo: document.getElementById("galeria-activo"),
    galeriaVistaPrevia: document.getElementById("galeria-vista-previa"),
    guardarContenido: document.getElementById("guardar-contenido"),
    cancelarContenido: document.getElementById("cancelar-contenido"),
    modoGaleria: document.getElementById("modo-galeria"),
    tituloFormularioGaleria: document.getElementById("titulo-formulario-galeria"),
    mensajeGaleria: document.getElementById("mensaje-galeria"),
    estadoGaleria: document.getElementById("estado-galeria"),
    listaGaleriaAdmin: document.getElementById("lista-galeria-admin"),

    toast: document.getElementById("toast")
};

inicializar();

async function inicializar() {
    registrarEventos();

    const configuracion = window.REORGANICO_SUPABASE;

    if (!configuracionValida(configuracion)) {
        mostrarMensaje(
            elementos.mensajeLogin,
            "La configuración de Supabase no es válida."
        );
        elementos.botonLogin.disabled = true;
        return;
    }

    if (!window.supabase || !window.supabase.createClient) {
        mostrarMensaje(
            elementos.mensajeLogin,
            "No se pudo cargar la conexión con Supabase."
        );
        elementos.botonLogin.disabled = true;
        return;
    }

    clienteSupabase = window.supabase.createClient(
        configuracion.url,
        configuracion.anonKey
    );

    if (!clienteSupabase || !clienteSupabase.auth) {
        mostrarMensaje(
            elementos.mensajeLogin,
            "No fue posible iniciar Supabase. Actualiza la página."
        );
        return;
    }

    clienteSupabase.auth.onAuthStateChange(
        (evento, sessionActual) => {
            console.log("Evento Supabase:", evento);

            if (evento === "PASSWORD_RECOVERY") {
                modoRecuperacion = true;
                mostrarVistaRecuperacion();
                return;
            }

            if (evento === "SIGNED_OUT") {
                usuarioActual = null;

                if (!modoRecuperacion) {
                    mostrarVistaAcceso();
                }

                return;
            }

            if (
                evento === "TOKEN_REFRESHED" &&
                sessionActual?.user
            ) {
                usuarioActual = sessionActual.user;
            }
        }
    );

    const parametrosHash = new URLSearchParams(
        window.location.hash.replace("#", "")
    );

    const parametrosUrl = new URLSearchParams(
        window.location.search
    );

    const errorEnlace =
        parametrosHash.get("error_code") ||
        parametrosUrl.get("error_code");

    if (errorEnlace) {
        mostrarMensaje(
            elementos.mensajeLogin,
            "El enlace de recuperación venció o ya fue utilizado. Solicita uno nuevo."
        );
        return;
    }

    const codigoRecuperacion = parametrosUrl.get("code");

    if (codigoRecuperacion) {
        const {
            data: datosIntercambio,
            error: errorIntercambio
        } = await clienteSupabase.auth.exchangeCodeForSession(
            codigoRecuperacion
        );

        if (errorIntercambio || !datosIntercambio?.session) {
            console.error(
                "No se pudo procesar el enlace de recuperación:",
                errorIntercambio
            );

            mostrarMensaje(
                elementos.mensajeLogin,
                "El enlace venció o ya fue utilizado. Solicita un correo nuevo."
            );
            return;
        }

        modoRecuperacion = true;
        mostrarVistaRecuperacion();

        window.history.replaceState(
            {},
            document.title,
            window.location.pathname
        );

        return;
    }

    const {
        data: { session },
        error
    } = await clienteSupabase.auth.getSession();

    if (error) {
        console.error("Error comprobando sesión:", error);

        mostrarMensaje(
            elementos.mensajeLogin,
            "No se pudo comprobar la sesión."
        );
        return;
    }

    const tipoEnlace = parametrosHash.get("type");
    const tieneTokenRecuperacion =
        parametrosHash.has("access_token") &&
        tipoEnlace === "recovery";

    if (tieneTokenRecuperacion && session?.user) {
        modoRecuperacion = true;
        mostrarVistaRecuperacion();
        return;
    }

    if (session?.user) {
        await autorizarYMostrarPanel(session.user);
    }
}

function configuracionValida(configuracion) {
    return Boolean(
        configuracion?.url &&
        configuracion?.anonKey &&
        !configuracion.url.includes("PEGA_AQUI") &&
        !configuracion.anonKey.includes("PEGA_AQUI")
    );
}

function registrarEventos() {
    elementos.formularioLogin.addEventListener("submit", iniciarSesion);
    elementos.formularioRecuperacion.addEventListener("submit", guardarNuevaPassword);
    elementos.formularioMfa.addEventListener("submit", verificarCodigoMfa);
    elementos.mostrarPassword.addEventListener("click", alternarPassword);
    elementos.cerrarSesion.addEventListener("click", cerrarSesion);
    elementos.formularioProducto.addEventListener("submit", guardarProducto);
    elementos.cancelarEdicion.addEventListener("click", limpiarFormulario);
    elementos.nuevoProducto.addEventListener("click", () => {
        limpiarFormulario();
        elementos.productoNombre.focus();
    });
    elementos.actualizarListado.addEventListener("click", cargarProductos);
    elementos.actualizarPedidos.addEventListener("click", cargarPedidos);
    elementos.actualizarGaleria.addEventListener("click", cargarGaleria);
    elementos.nuevoContenido.addEventListener("click", () => {
        limpiarFormularioGaleria();
        elementos.galeriaTitulo.focus();
    });
    elementos.cancelarContenido.addEventListener("click", limpiarFormularioGaleria);
    elementos.formularioGaleria.addEventListener("submit", guardarContenidoGaleria);
    elementos.galeriaArchivo.addEventListener("change", mostrarPreviaArchivoSeleccionado);

    elementos.listaGaleriaAdmin.addEventListener("click", (evento) => {
        const boton = evento.target.closest("[data-accion-galeria]");
        if (!boton) return;

        const { accionGaleria, id } = boton.dataset;
        if (accionGaleria === "editar") editarContenidoGaleria(id);
        if (accionGaleria === "visibilidad") cambiarVisibilidadGaleria(id);
        if (accionGaleria === "eliminar") eliminarContenidoGaleria(id);
    });

    elementos.pestanasPanel.forEach((boton) => {
        boton.addEventListener("click", () => cambiarSeccionPanel(boton.dataset.seccionPanel));
    });

    elementos.listaPedidos.addEventListener("change", (evento) => {
        const selector = evento.target.closest("[data-estado-pedido]");
        if (!selector) return;
        actualizarEstadoPedido(selector.dataset.id, selector.value, selector);
    });

    elementos.listaAdmin.addEventListener("click", (evento) => {
        const boton = evento.target.closest("[data-accion]");
        if (!boton) return;

        const { accion, id } = boton.dataset;
        if (accion === "editar") editarProducto(id);
        if (accion === "eliminar") eliminarProducto(id);
    });
}

function alternarPassword() {
    const visible = elementos.password.type === "text";
    elementos.password.type = visible ? "password" : "text";
    elementos.mostrarPassword.textContent = visible ? "👁️" : "🙈";
}

function mostrarVistaRecuperacion() {
    elementos.vistaPanel.hidden = true;
    elementos.vistaAcceso.hidden = false;
    elementos.formularioLogin.hidden = true;
    elementos.formularioMfa.hidden = true;
    elementos.formularioRecuperacion.hidden = false;
    elementos.tituloAcceso.textContent = "Crear nueva contraseña";
    elementos.descripcionAcceso.textContent =
        "Escribe y confirma la nueva contraseña de tu cuenta administrativa.";

    limpiarMensaje(elementos.mensajeLogin);
    elementos.nuevaPassword.focus();
}

async function guardarNuevaPassword(evento) {
    evento.preventDefault();
    limpiarMensaje(elementos.mensajeLogin);

    const nuevaPassword = elementos.nuevaPassword.value;
    const repetirPassword = elementos.repetirPassword.value;

    if (!passwordFuerte(nuevaPassword)) {
        mostrarMensaje(
            elementos.mensajeLogin,
            "Usa al menos 12 caracteres, con mayúscula, minúscula y número."
        );
        return;
    }

    if (nuevaPassword !== repetirPassword) {
        mostrarMensaje(
            elementos.mensajeLogin,
            "Las contraseñas no coinciden."
        );
        return;
    }

    cambiarEstadoBoton(elementos.botonRecuperacion, true, "Guardando...");

    const { error } = await clienteSupabase.auth.updateUser({
        password: nuevaPassword
    });

    cambiarEstadoBoton(
        elementos.botonRecuperacion,
        false,
        "Guardar nueva contraseña"
    );

    if (error) {
        console.error("No se pudo cambiar la contraseña:", error);
        mostrarMensaje(
            elementos.mensajeLogin,
            "No se pudo cambiar la contraseña. Solicita un enlace nuevo."
        );
        return;
    }

    elementos.formularioRecuperacion.reset();
    modoRecuperacion = false;

    window.history.replaceState({}, document.title, window.location.pathname);

    await clienteSupabase.auth.signOut();

    elementos.formularioRecuperacion.hidden = true;
    elementos.formularioMfa.hidden = true;
    elementos.formularioLogin.hidden = false;
    elementos.tituloAcceso.textContent = "Acceso administrativo";
    elementos.descripcionAcceso.textContent =
        "Solo el administrador autorizado puede modificar el catálogo. Los clientes no tienen acceso a esta sección.";

    mostrarMensaje(
        elementos.mensajeLogin,
        "Contraseña actualizada correctamente. Ya puedes iniciar sesión.",
        true
    );
}

async function iniciarSesion(evento) {
    evento.preventDefault();
    limpiarMensaje(elementos.mensajeLogin);

    const email = elementos.email.value.trim();
    const password = elementos.password.value;

    if (!email || !password) {
        mostrarMensaje(elementos.mensajeLogin, "Completa el correo y la contraseña.");
        return;
    }

    cambiarEstadoBoton(elementos.botonLogin, true, "Ingresando...");

    const { data, error } = await clienteSupabase.auth.signInWithPassword({
        email,
        password
    });

    if (error || !data?.user) {
        console.error("Error real de Supabase:", error);

        cambiarEstadoBoton(
            elementos.botonLogin,
            false,
            "Iniciar sesión"
        );

        const limite = error?.status === 429 || error?.code === "over_request_rate_limit";
        mostrarMensaje(
            elementos.mensajeLogin,
            limite
                ? "Demasiados intentos. Espera un momento antes de volver a intentar."
                : "Correo, contraseña o verificación no válidos."
        );

        return;
    }

    const autorizado = await autorizarYMostrarPanel(data.user);

    if (!autorizado) {
        await clienteSupabase.auth.signOut();
        cambiarEstadoBoton(elementos.botonLogin, false, "Iniciar sesión");
        mostrarMensaje(
            elementos.mensajeLogin,
            "Esta cuenta no tiene permisos de administrador."
        );
        return;
    }

    elementos.formularioLogin.reset();
    cambiarEstadoBoton(elementos.botonLogin, false, "Iniciar sesión");
}

async function autorizarYMostrarPanel(usuario) {
    const autorizado = await verificarAdministrador(usuario.id);
    if (!autorizado) return false;
    usuarioActual = usuario;
    const mfaListo = await asegurarMfaAdministrador();
    if (!mfaListo) return true;
    await mostrarPanelAutorizado();
    return true;
}

async function mostrarPanelAutorizado() {
    elementos.correoAdmin.textContent = usuarioActual?.email || "Administrador";
    elementos.vistaAcceso.hidden = true;
    elementos.vistaPanel.hidden = false;
    elementos.formularioMfa.hidden = true;
    limpiarMensaje(elementos.mensajeLogin);
    await Promise.all([cargarProductos(), cargarPedidos(), cargarGaleria()]);
}

async function asegurarMfaAdministrador() {
    const { data: nivel, error: errorNivel } = await clienteSupabase.auth.mfa.getAuthenticatorAssuranceLevel();
    if (errorNivel) {
        console.error("No se pudo comprobar MFA:", errorNivel);
        mostrarMensaje(elementos.mensajeLogin, "No se pudo comprobar la verificación en dos pasos.");
        return false;
    }
    if (nivel?.currentLevel === "aal2") return true;

    const { data: factores, error: errorFactores } = await clienteSupabase.auth.mfa.listFactors();
    if (errorFactores) {
        console.error("No se pudieron consultar factores MFA:", errorFactores);
        mostrarMensaje(elementos.mensajeLogin, "No se pudo preparar la verificación en dos pasos.");
        return false;
    }

    const totp = factores?.totp || [];
    const verificado = totp.find((factor) => factor.status === "verified");
    elementos.vistaPanel.hidden = true;
    elementos.vistaAcceso.hidden = false;
    elementos.formularioLogin.hidden = true;
    elementos.formularioRecuperacion.hidden = true;
    elementos.formularioMfa.hidden = false;
    elementos.mfaCodigo.value = "";

    if (verificado) {
        mfaFactorId = verificado.id;
        elementos.mfaConfiguracion.hidden = true;
        elementos.tituloAcceso.textContent = "Verificación en dos pasos";
        elementos.descripcionAcceso.textContent = "Ingresa el código de 6 dígitos de tu aplicación de autenticación.";
        elementos.mfaCodigo.focus();
        return false;
    }

    for (const factor of totp.filter((item) => item.status !== "verified")) {
        try { await clienteSupabase.auth.mfa.unenroll({ factorId: factor.id }); } catch (_) {}
    }

    const { data: enrolamiento, error: errorEnrolamiento } = await clienteSupabase.auth.mfa.enroll({ factorType: "totp", friendlyName: "Re Orgánico Admin" });
    if (errorEnrolamiento || !enrolamiento?.id || !enrolamiento?.totp) {
        console.error("No se pudo activar MFA:", errorEnrolamiento);
        mostrarMensaje(elementos.mensajeLogin, "No se pudo iniciar la configuración MFA.");
        return false;
    }
    mfaFactorId = enrolamiento.id;
    elementos.mfaConfiguracion.hidden = false;
    elementos.mfaQr.src = enrolamiento.totp.qr_code;
    elementos.mfaSecreto.textContent = enrolamiento.totp.secret || "";
    elementos.tituloAcceso.textContent = "Protege tu cuenta administrativa";
    elementos.descripcionAcceso.textContent = "La verificación en dos pasos es obligatoria para administrar Re Orgánico.";
    elementos.mfaCodigo.focus();
    return false;
}

async function verificarCodigoMfa(evento) {
    evento.preventDefault();
    limpiarMensaje(elementos.mensajeLogin);
    const codigo = elementos.mfaCodigo.value.trim();
    if (!/^\d{6}$/.test(codigo) || !mfaFactorId) {
        mostrarMensaje(elementos.mensajeLogin, "Ingresa un código válido de 6 dígitos.");
        return;
    }
    cambiarEstadoBoton(elementos.botonMfa, true, "Verificando...");
    const { data: reto, error: errorReto } = await clienteSupabase.auth.mfa.challenge({ factorId: mfaFactorId });
    if (errorReto || !reto?.id) {
        cambiarEstadoBoton(elementos.botonMfa, false, "Verificar código");
        mostrarMensaje(elementos.mensajeLogin, "No se pudo iniciar la verificación. Intenta nuevamente.");
        return;
    }
    const { error: errorVerificacion } = await clienteSupabase.auth.mfa.verify({ factorId: mfaFactorId, challengeId: reto.id, code: codigo });
    cambiarEstadoBoton(elementos.botonMfa, false, "Verificar código");
    if (errorVerificacion) {
        elementos.mfaCodigo.value = "";
        mostrarMensaje(elementos.mensajeLogin, "Código incorrecto o vencido.");
        elementos.mfaCodigo.focus();
        return;
    }
    elementos.formularioMfa.reset();
    await mostrarPanelAutorizado();
}

function passwordFuerte(password) {
    return typeof password === "string" && password.length >= 12 && /[A-ZÁÉÍÓÚÑ]/.test(password) && /[a-záéíóúñ]/.test(password) && /\d/.test(password);
}

async function verificarAdministrador(userId) {
    const { data, error } = await clienteSupabase
        .from("admin_users")
        .select("user_id")
        .eq("user_id", userId)
        .maybeSingle();

    if (error) {
        console.error("No se pudo verificar el permiso administrativo:", error);
        return false;
    }

    return Boolean(data?.user_id);
}

function mostrarVistaAcceso() {
    elementos.vistaPanel.hidden = true;
    elementos.vistaAcceso.hidden = false;
    elementos.formularioRecuperacion.hidden = true;
    elementos.formularioMfa.hidden = true;
    elementos.formularioLogin.hidden = false;
    elementos.tituloAcceso.textContent = "Acceso administrativo";
    elementos.descripcionAcceso.textContent =
        "Solo el administrador autorizado puede modificar el catálogo. Los clientes no tienen acceso a esta sección.";
    elementos.password.value = "";
}

async function cerrarSesion() {
    await clienteSupabase.auth.signOut();
    mostrarVistaAcceso();
    mostrarToast("Sesión cerrada");
}

async function cargarProductos() {
    elementos.estadoCarga.hidden = false;
    elementos.estadoCarga.textContent = "Cargando productos...";
    elementos.listaAdmin.innerHTML = "";

    const { data, error } = await clienteSupabase
        .from("productos")
        .select("id,nombre,precio,categoria,descripcion,emoji,etiqueta,estado,orden,medida,micras,presentaciones")
        .order("orden", { ascending: true })
        .order("nombre", { ascending: true });

    if (error) {
        console.error("Error cargando productos:", error);
        elementos.estadoCarga.textContent =
            "No se pudo cargar el catálogo. Comprueba la conexión y los permisos.";
        return;
    }

    productos = Array.isArray(data) ? data.map((producto) => normalizarProducto(producto)) : [];
    renderizarProductos();
}

function renderizarProductos() {
    elementos.estadoCarga.hidden = productos.length > 0;

    if (productos.length === 0) {
        elementos.estadoCarga.hidden = false;
        elementos.estadoCarga.textContent = "Todavía no hay productos en el catálogo.";
        elementos.listaAdmin.innerHTML = "";
        return;
    }

    elementos.listaAdmin.innerHTML = productos
        .map(
            (producto) => `
                <article class="producto-admin">
                    <div class="producto-admin-icono" aria-hidden="true">
                        ${escaparHTML(producto.emoji)}
                    </div>

                    <div class="producto-admin-info">
                        <h3>${escaparHTML(producto.nombre)}</h3>
                        <p>
                            ${CATEGORIAS[producto.categoria] || "Producto"}
                            · ${formatearPrecio(producto.precio)}
                            · Orden ${Number(producto.orden) || 0}
                        </p>
                        <p>${producto.medida ? `Medida ${escaparHTML(producto.medida)}` : ""}${producto.micras ? ` · MY${Number(producto.micras)}` : ""}</p>
                        <p>${Array.isArray(producto.presentaciones) ? producto.presentaciones.map((p) => `${escaparHTML(p.detalle || p.nombre)}: ${formatearPrecio(p.precio)}`).join(" · ") : ""}</p>
                        <span class="estado-mini">${ESTADOS[producto.estado] || producto.estado}</span>
                    </div>

                    <div class="producto-admin-acciones">
                        <button type="button" data-accion="editar" data-id="${escaparHTML(producto.id)}">
                            Editar
                        </button>
                        <button class="eliminar" type="button" data-accion="eliminar" data-id="${escaparHTML(producto.id)}">
                            Eliminar
                        </button>
                    </div>
                </article>
            `
        )
        .join("");
}

function leerPresentacionesFormulario() {
    const presentaciones = [];

    const agregar = (numero) => {
        const nombre = elementos[`productoP${numero}Nombre`].value.trim();
        const unidades = Number(elementos[`productoP${numero}Unidades`].value);
        const unidad = elementos[`productoP${numero}Unidad`].value.trim();
        const precio = Number(elementos[`productoP${numero}Precio`].value);
        const detalle = elementos[`productoP${numero}Detalle`].value.trim();

        if (!nombre && !unidades && !unidad && !precio && !detalle) return;
        if (!nombre || !Number.isFinite(unidades) || unidades < 1 || !unidad || !Number.isFinite(precio) || precio < 0) {
            throw new Error(`Revisa la presentación ${numero}.`);
        }

        presentaciones.push({
            id: numero === 1 ? "principal" : "alternativa",
            nombre,
            unidades: Math.round(unidades),
            unidad,
            precio: Math.round(precio),
            detalle: detalle || `${nombre}: ${Math.round(unidades)} ${unidad}`
        });
    };

    agregar(1);
    agregar(2);
    return presentaciones;
}

async function guardarProducto(evento) {
    evento.preventDefault();
    limpiarMensaje(elementos.mensajeProducto);

    const idExistente = elementos.productoId.value;
    const nombre = elementos.productoNombre.value.trim();
    const precioIngresado = Number(elementos.productoPrecio.value);
    const medida = elementos.productoMedida.value.trim();
    const micrasValor = elementos.productoMicras.value.trim();
    const micras = micrasValor ? Number(micrasValor) : null;
    let presentaciones = [];

    try {
        presentaciones = leerPresentacionesFormulario();
    } catch (error) {
        mostrarMensaje(elementos.mensajeProducto, error.message);
        return;
    }

    const precio = presentaciones.length > 0 ? Number(presentaciones[0].precio) : precioIngresado;
    const categoria = elementos.productoCategoria.value;
    const estado = elementos.productoEstado.value;
    const emoji = elementos.productoEmoji.value.trim();
    const etiqueta = elementos.productoEtiqueta.value.trim();
    const orden = Number(elementos.productoOrden.value);
    const descripcion = elementos.productoDescripcion.value.trim();

    if (
        !nombre ||
        !Number.isFinite(precio) ||
        precio < 0 ||
        (micras !== null && (!Number.isFinite(micras) || micras < 1)) ||
        !categoria ||
        !estado ||
        !emoji ||
        !Number.isFinite(orden) ||
        orden < 0 ||
        !descripcion
    ) {
        mostrarMensaje(elementos.mensajeProducto, "Revisa los datos del producto.");
        return;
    }

    const payload = {
        nombre,
        precio: Math.round(precio),
        medida: medida || null,
        micras: micras === null ? null : Math.round(micras),
        presentaciones,
        categoria,
        estado,
        emoji,
        etiqueta: etiqueta || null,
        orden: Math.round(orden),
        descripcion
    };

    cambiarEstadoBoton(elementos.guardarProducto, true, "Guardando...");

    let resultado;

    if (idExistente) {
        resultado = await clienteSupabase
            .from("productos")
            .update(payload)
            .eq("id", idExistente);
    } else {
        payload.id = crearIdUnico(nombre);
        resultado = await clienteSupabase
            .from("productos")
            .insert(payload);
    }

    cambiarEstadoBoton(elementos.guardarProducto, false, "Guardar producto");

    if (resultado.error) {
        console.error("No se pudo guardar el producto:", resultado.error);
        mostrarMensaje(
            elementos.mensajeProducto,
            "No se pudo guardar. Comprueba tu sesión y los permisos de Supabase."
        );
        return;
    }

    mostrarMensaje(
        elementos.mensajeProducto,
        idExistente ? "Producto actualizado correctamente." : "Producto agregado correctamente.",
        true
    );
    mostrarToast(idExistente ? "Producto actualizado" : "Producto agregado");
    limpiarFormulario(false);
    await cargarProductos();
}

function editarProducto(id) {
    const producto = productos.find((item) => item.id === id);
    if (!producto) return;

    elementos.productoId.value = producto.id;
    elementos.productoNombre.value = producto.nombre;
    elementos.productoPrecio.value = producto.precio;
    elementos.productoMedida.value = producto.medida || "";
    elementos.productoMicras.value = producto.micras || "";
    const presentaciones = Array.isArray(producto.presentaciones) ? producto.presentaciones : [];
    const p1 = presentaciones[0] || {};
    const p2 = presentaciones[1] || {};
    elementos.productoP1Nombre.value = p1.nombre || "";
    elementos.productoP1Unidades.value = p1.unidades || "";
    elementos.productoP1Unidad.value = p1.unidad || "";
    elementos.productoP1Precio.value = p1.precio ?? "";
    elementos.productoP1Detalle.value = p1.detalle || "";
    elementos.productoP2Nombre.value = p2.nombre || "";
    elementos.productoP2Unidades.value = p2.unidades || "";
    elementos.productoP2Unidad.value = p2.unidad || "";
    elementos.productoP2Precio.value = p2.precio ?? "";
    elementos.productoP2Detalle.value = p2.detalle || "";
    elementos.productoCategoria.value = producto.categoria;
    elementos.productoEstado.value = producto.estado;
    elementos.productoEmoji.value = producto.emoji;
    elementos.productoEtiqueta.value = producto.etiqueta || "";
    elementos.productoOrden.value = Number(producto.orden) || 0;
    elementos.productoDescripcion.value = producto.descripcion;
    elementos.modoFormulario.textContent = "Editando producto";
    elementos.tituloFormulario.textContent = producto.nombre;
    limpiarMensaje(elementos.mensajeProducto);
    elementos.productoNombre.focus();
    window.scrollTo({ top: 0, behavior: "smooth" });
}

async function eliminarProducto(id) {
    const producto = productos.find((item) => item.id === id);
    if (!producto) return;

    const confirmado = window.confirm(
        `¿Seguro que deseas eliminar “${producto.nombre}”? Esta acción afectará el catálogo público.`
    );

    if (!confirmado) return;

    const { error } = await clienteSupabase
        .from("productos")
        .delete()
        .eq("id", id);

    if (error) {
        console.error("No se pudo eliminar el producto:", error);
        mostrarToast("No se pudo eliminar el producto");
        return;
    }

    if (elementos.productoId.value === id) {
        limpiarFormulario();
    }

    mostrarToast("Producto eliminado");
    await cargarProductos();
}

function limpiarFormulario(limpiarMensajeActual = true) {
    elementos.formularioProducto.reset();
    elementos.productoId.value = "";
    elementos.productoCategoria.value = "bolsas";
    elementos.productoEstado.value = "disponible";
    elementos.productoOrden.value = siguienteOrden();
    elementos.modoFormulario.textContent = "Nuevo producto";
    elementos.tituloFormulario.textContent = "Agregar al catálogo";

    if (limpiarMensajeActual) {
        limpiarMensaje(elementos.mensajeProducto);
    }
}

function siguienteOrden() {
    if (productos.length === 0) return 1;
    return Math.max(...productos.map((producto) => Number(producto.orden) || 0)) + 1;
}

function crearIdUnico(nombre) {
    const base = nombre
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "") || "producto";

    let id = base;
    let numero = 2;

    while (productos.some((producto) => producto.id === id)) {
        id = `${base}-${numero}`;
        numero += 1;
    }

    return id;
}

function cambiarSeccionPanel(seccion) {
    const mostrarProductos = seccion === "productos";
    const mostrarPedidos = seccion === "pedidos";
    const mostrarGaleria = seccion === "galeria";

    elementos.seccionProductos.hidden = !mostrarProductos;
    elementos.seccionPedidos.hidden = !mostrarPedidos;
    elementos.seccionGaleria.hidden = !mostrarGaleria;
    elementos.nuevoProducto.hidden = !mostrarProductos;

    elementos.pestanasPanel.forEach((boton) => {
        boton.classList.toggle("activa", boton.dataset.seccionPanel === seccion);
    });

    if (mostrarPedidos) cargarPedidos();
    if (mostrarGaleria) cargarGaleria();
}

async function cargarPedidos() {
    elementos.estadoPedidos.hidden = false;
    elementos.estadoPedidos.textContent = "Cargando pedidos...";
    elementos.listaPedidos.innerHTML = "";

    const { data, error } = await clienteSupabase
        .from("pedidos")
        .select(`
            id,
            codigo,
            nombre_cliente,
            telefono,
            tipo_entrega,
            region,
            comuna,
            direccion,
            empresa_envio,
            forma_pago,
            observaciones,
            total_referencial,
            estado,
            created_at,
            detalle_pedido (
                id,
                producto_id,
                nombre_producto,
                precio_unitario,
                cantidad,
                subtotal,
                presentacion_id,
                presentacion_nombre,
                unidades_por_presentacion,
                unidades_totales
            )
        `)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("No se pudieron cargar los pedidos:", error);
        elementos.estadoPedidos.textContent =
            "No se pudieron cargar los pedidos. Ejecuta ACTUALIZACION_PEDIDOS_SUPABASE.sql en Supabase.";
        return;
    }

    pedidos = Array.isArray(data) ? data : [];
    renderizarPedidos();
    actualizarResumenPedidos();
}

function renderizarPedidos() {
    elementos.estadoPedidos.hidden = pedidos.length > 0;

    if (pedidos.length === 0) {
        elementos.estadoPedidos.hidden = false;
        elementos.estadoPedidos.textContent = "Todavía no hay pedidos registrados.";
        elementos.listaPedidos.innerHTML = "";
        return;
    }

    elementos.listaPedidos.innerHTML = pedidos
        .map((pedido) => {
            const detalles = Array.isArray(pedido.detalle_pedido)
                ? pedido.detalle_pedido
                : [];
            const telefonoWhatsApp = normalizarTelefonoWhatsApp(pedido.telefono);
            const mensajeWhatsApp = encodeURIComponent(
                `Hola ${pedido.nombre_cliente}, te escribimos de Re Orgánico por tu solicitud ${pedido.codigo}.`
            );
            const entrega = pedido.tipo_entrega === "ruta"
                ? ["Ruta Re Orgánico", pedido.comuna].filter(Boolean).join(" · ")
                : ["Despacho", pedido.comuna, pedido.region].filter(Boolean).join(" · ");

            return `
                <article class="pedido-admin">
                    <header class="pedido-admin-cabecera">
                        <div>
                            <span>${escaparHTML(formatearFecha(pedido.created_at))}</span>
                            <h3>${escaparHTML(pedido.codigo)}</h3>
                        </div>
                        <strong>${formatearPrecio(pedido.total_referencial)}</strong>
                    </header>

                    <div class="pedido-admin-grid">
                        <div class="pedido-dato">
                            <span>Cliente</span>
                            <strong>${escaparHTML(pedido.nombre_cliente)}</strong>
                        </div>
                        <div class="pedido-dato">
                            <span>Teléfono</span>
                            <strong>${escaparHTML(pedido.telefono)}</strong>
                        </div>
                        <div class="pedido-dato">
                            <span>Entrega</span>
                            <strong>${escaparHTML(entrega)}</strong>
                        </div>
                        <div class="pedido-dato">
                            <span>Transporte</span>
                            <strong>${escaparHTML(pedido.empresa_envio || "Por coordinar")}</strong>
                        </div>
                        <div class="pedido-dato">
                            <span>Forma de pago</span>
                            <strong>${escaparHTML(pedido.forma_pago ? (pedido.forma_pago === "efectivo" ? "Efectivo" : "Transferencia") : "Por coordinar")}</strong>
                        </div>
                    </div>

                    ${pedido.direccion ? `
                        <p class="pedido-direccion"><b>Dirección o sucursal:</b> ${escaparHTML(pedido.direccion)}</p>
                    ` : ""}

                    <div class="pedido-productos">
                        <span>Productos</span>
                        <ul>
                            ${detalles.map((detalle) => `
                                <li>
                                    <span>
                                        ${escaparHTML(detalle.nombre_producto)}<br>
                                        <small>
                                            ${Number(detalle.cantidad) || 0} × ${escaparHTML(detalle.presentacion_nombre || "Presentación")}
                                            ${detalle.unidades_totales ? `= ${new Intl.NumberFormat("es-CL").format(Number(detalle.unidades_totales))} unidades` : ""}
                                        </small>
                                    </span>
                                    <strong>${formatearPrecio(detalle.subtotal)}</strong>
                                </li>
                            `).join("")}
                        </ul>
                    </div>

                    ${pedido.observaciones ? `
                        <p class="pedido-observaciones"><b>Observaciones:</b> ${escaparHTML(pedido.observaciones)}</p>
                    ` : ""}

                    <footer class="pedido-admin-acciones">
                        <label>
                            <span>Estado</span>
                            <select data-estado-pedido data-id="${escaparHTML(pedido.id)}">
                                ${Object.entries(ESTADOS_PEDIDO).map(([valor, texto]) => `
                                    <option value="${valor}" ${pedido.estado === valor ? "selected" : ""}>${texto}</option>
                                `).join("")}
                            </select>
                        </label>

                        <a
                            class="boton-whatsapp-cliente"
                            href="https://wa.me/${telefonoWhatsApp}?text=${mensajeWhatsApp}"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            💬 Hablar por WhatsApp
                        </a>
                    </footer>
                </article>
            `;
        })
        .join("");
}

function actualizarResumenPedidos() {
    const pendientes = pedidos.filter((pedido) =>
        ["cotizacion", "confirmado", "esperando_pago"].includes(pedido.estado)
    ).length;
    const pagados = pedidos.filter((pedido) => pedido.estado === "pago_confirmado").length;
    const entregados = pedidos.filter((pedido) => pedido.estado === "entregado").length;

    elementos.resumenTotalPedidos.textContent = pedidos.length;
    elementos.resumenPedidosPendientes.textContent = pendientes;
    elementos.resumenPagosConfirmados.textContent = pagados;
    elementos.resumenPedidosEntregados.textContent = entregados;
    elementos.contadorPedidosPestana.textContent = pendientes;
}

async function actualizarEstadoPedido(id, estado, selector) {
    if (!Object.hasOwn(ESTADOS_PEDIDO, estado)) return;

    selector.disabled = true;

    const { error } = await clienteSupabase
        .from("pedidos")
        .update({ estado })
        .eq("id", id);

    selector.disabled = false;

    if (error) {
        console.error("No se pudo cambiar el estado:", error);
        mostrarToast("No se pudo cambiar el estado");
        await cargarPedidos();
        return;
    }

    const pedido = pedidos.find((item) => item.id === id);
    if (pedido) pedido.estado = estado;

    actualizarResumenPedidos();
    mostrarToast(`Estado actualizado: ${ESTADOS_PEDIDO[estado]}`);
}


const MIME_GALERIA_PERMITIDOS = new Set([
    "image/jpeg",
    "image/png",
    "image/webp",
    "video/mp4",
    "video/webm"
]);

const MAX_ARCHIVO_GALERIA = 50 * 1024 * 1024;

async function cargarGaleria() {
    if (!clienteSupabase || !elementos.estadoGaleria) return;

    elementos.estadoGaleria.hidden = false;
    elementos.estadoGaleria.textContent = "Cargando fotos y videos...";
    elementos.listaGaleriaAdmin.innerHTML = "";

    const { data, error } = await clienteSupabase
        .from("contenido_galeria")
        .select("id,tipo,titulo,descripcion,archivo_path,activo,orden,created_at,updated_at")
        .order("orden", { ascending: true })
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error cargando galería:", error);
        elementos.estadoGaleria.textContent =
            "No se pudo cargar la galería. Revisa la conexión y los permisos.";
        return;
    }

    contenidoGaleria = Array.isArray(data) ? data : [];
    renderizarGaleriaAdmin();
}

function obtenerUrlPublicaGaleria(path) {
    if (!path || !clienteSupabase) return "";

    const { data } = clienteSupabase.storage
        .from("galeria")
        .getPublicUrl(path);

    return data?.publicUrl || "";
}

function renderizarGaleriaAdmin() {
    if (!elementos.listaGaleriaAdmin) return;

    elementos.contadorGaleriaPestana.textContent = String(contenidoGaleria.length);

    if (contenidoGaleria.length === 0) {
        elementos.estadoGaleria.hidden = false;
        elementos.estadoGaleria.textContent =
            "Todavía no has agregado fotos o videos desde el panel.";
        elementos.listaGaleriaAdmin.innerHTML = "";
        return;
    }

    elementos.estadoGaleria.hidden = true;

    elementos.listaGaleriaAdmin.innerHTML = contenidoGaleria.map((item) => {
        const url = obtenerUrlPublicaGaleria(item.archivo_path);
        const esVideo = item.tipo === "video";

        const media = esVideo
            ? `<video src="${escaparAtributo(url)}" preload="metadata" playsinline muted></video>`
            : `<img src="${escaparAtributo(url)}" alt="${escaparAtributo(item.titulo)}" loading="lazy">`;

        return `
            <article class="contenido-admin ${item.activo ? "" : "contenido-admin-inactivo"}">
                <div class="contenido-admin-media">
                    ${media}
                    <span class="contenido-admin-tipo">${esVideo ? "VIDEO" : "FOTO"}</span>
                </div>

                <div class="contenido-admin-info">
                    <div>
                        <h3>${escaparHTML(item.titulo)}</h3>
                        <p>${item.descripcion ? escaparHTML(item.descripcion) : "Sin descripción"}</p>
                    </div>

                    <div class="contenido-admin-meta">
                        <span>Orden ${Number(item.orden) || 0}</span>
                        <span class="${item.activo ? "visible" : "oculto"}">
                            ${item.activo ? "Visible en página" : "Oculto de la página"}
                        </span>
                    </div>
                </div>

                <div class="contenido-admin-acciones">
                    <button type="button" data-accion-galeria="editar" data-id="${item.id}">
                        Editar
                    </button>
                    <button type="button" data-accion-galeria="visibilidad" data-id="${item.id}">
                        ${item.activo ? "Ocultar" : "Publicar"}
                    </button>
                    <button class="eliminar" type="button" data-accion-galeria="eliminar" data-id="${item.id}">
                        Eliminar
                    </button>
                </div>
            </article>
        `;
    }).join("");
}

function mostrarPreviaArchivoSeleccionado() {
    const archivo = elementos.galeriaArchivo.files?.[0];

    if (!archivo) {
        const itemActual = contenidoGaleria.find(
            (item) => item.id === elementos.galeriaId.value
        );

        if (itemActual) {
            mostrarPreviaGaleriaDesdeUrl(itemActual);
        } else {
            elementos.galeriaVistaPrevia.hidden = true;
            elementos.galeriaVistaPrevia.innerHTML = "";
        }
        return;
    }

    if (!MIME_GALERIA_PERMITIDOS.has(archivo.type)) {
        mostrarMensaje(
            elementos.mensajeGaleria,
            "Formato no permitido. Usa JPG, PNG, WEBP, MP4 o WEBM."
        );
        elementos.galeriaArchivo.value = "";
        return;
    }

    if (archivo.size > MAX_ARCHIVO_GALERIA) {
        mostrarMensaje(
            elementos.mensajeGaleria,
            "El archivo supera el máximo de 50 MB."
        );
        elementos.galeriaArchivo.value = "";
        return;
    }

    limpiarMensaje(elementos.mensajeGaleria);

    const urlTemporal = URL.createObjectURL(archivo);
    const tipo = archivo.type.startsWith("video/") ? "video" : "foto";

    elementos.galeriaVistaPrevia.hidden = false;
    elementos.galeriaVistaPrevia.innerHTML = tipo === "video"
        ? `<video src="${escaparAtributo(urlTemporal)}" controls playsinline></video>`
        : `<img src="${escaparAtributo(urlTemporal)}" alt="Vista previa del archivo seleccionado">`;
}

function mostrarPreviaGaleriaDesdeUrl(item) {
    const url = obtenerUrlPublicaGaleria(item.archivo_path);
    if (!url) return;

    elementos.galeriaVistaPrevia.hidden = false;
    elementos.galeriaVistaPrevia.innerHTML = item.tipo === "video"
        ? `<video src="${escaparAtributo(url)}" controls playsinline></video>`
        : `<img src="${escaparAtributo(url)}" alt="${escaparAtributo(item.titulo)}">`;
}

async function guardarContenidoGaleria(evento) {
    evento.preventDefault();
    limpiarMensaje(elementos.mensajeGaleria);

    const id = elementos.galeriaId.value.trim();
    const titulo = elementos.galeriaTitulo.value.trim();
    const descripcion = elementos.galeriaDescripcion.value.trim();
    const orden = Number(elementos.galeriaOrden.value);
    const activo = elementos.galeriaActivo.checked;
    const archivo = elementos.galeriaArchivo.files?.[0] || null;
    const pathActual = elementos.galeriaPathActual.value.trim();

    if (!titulo) {
        mostrarMensaje(elementos.mensajeGaleria, "Escribe un título.");
        return;
    }

    if (!Number.isInteger(orden) || orden < 0) {
        mostrarMensaje(elementos.mensajeGaleria, "El orden debe ser 0 o mayor.");
        return;
    }

    if (!id && !archivo) {
        mostrarMensaje(
            elementos.mensajeGaleria,
            "Selecciona una foto o video para publicar."
        );
        return;
    }

    if (archivo && !MIME_GALERIA_PERMITIDOS.has(archivo.type)) {
        mostrarMensaje(
            elementos.mensajeGaleria,
            "Formato no permitido. Usa JPG, PNG, WEBP, MP4 o WEBM."
        );
        return;
    }

    if (archivo && archivo.size > MAX_ARCHIVO_GALERIA) {
        mostrarMensaje(
            elementos.mensajeGaleria,
            "El archivo supera el máximo de 50 MB."
        );
        return;
    }

    cambiarEstadoBoton(
        elementos.guardarContenido,
        true,
        archivo ? "Subiendo..." : "Guardando..."
    );

    let nuevoPath = null;
    let tipo = null;

    try {
        if (archivo) {
            tipo = archivo.type.startsWith("video/") ? "video" : "foto";
            nuevoPath = crearPathGaleria(archivo.name, tipo);

            const { error: errorSubida } = await clienteSupabase.storage
                .from("galeria")
                .upload(nuevoPath, archivo, {
                    cacheControl: "3600",
                    upsert: false,
                    contentType: archivo.type
                });

            if (errorSubida) {
                console.error("Error subiendo archivo:", errorSubida);
                mostrarMensaje(
                    elementos.mensajeGaleria,
                    "No se pudo subir el archivo. Revisa los permisos o intenta nuevamente."
                );
                return;
            }
        }

        if (id) {
            const actual = contenidoGaleria.find((item) => item.id === id);
            const payload = {
                titulo,
                descripcion: descripcion || null,
                activo,
                orden
            };

            if (nuevoPath) {
                payload.archivo_path = nuevoPath;
                payload.tipo = tipo;
            }

            const { error: errorActualizar } = await clienteSupabase
                .from("contenido_galeria")
                .update(payload)
                .eq("id", id);

            if (errorActualizar) {
                console.error("Error actualizando contenido:", errorActualizar);

                if (nuevoPath) {
                    await clienteSupabase.storage.from("galeria").remove([nuevoPath]);
                }

                mostrarMensaje(
                    elementos.mensajeGaleria,
                    "No se pudo guardar el cambio."
                );
                return;
            }

            if (nuevoPath && actual?.archivo_path && actual.archivo_path !== nuevoPath) {
                const { error: errorBorrarAnterior } = await clienteSupabase.storage
                    .from("galeria")
                    .remove([actual.archivo_path]);

                if (errorBorrarAnterior) {
                    console.warn("No se pudo borrar el archivo anterior:", errorBorrarAnterior);
                }
            }

            mostrarToast("Contenido actualizado");
        } else {
            const { error: errorInsertar } = await clienteSupabase
                .from("contenido_galeria")
                .insert({
                    tipo,
                    titulo,
                    descripcion: descripcion || null,
                    archivo_path: nuevoPath,
                    activo,
                    orden
                });

            if (errorInsertar) {
                console.error("Error guardando contenido:", errorInsertar);

                if (nuevoPath) {
                    await clienteSupabase.storage.from("galeria").remove([nuevoPath]);
                }

                mostrarMensaje(
                    elementos.mensajeGaleria,
                    "El archivo subió, pero no se pudo registrar el contenido."
                );
                return;
            }

            mostrarToast("Contenido publicado");
        }

        limpiarFormularioGaleria(false);
        mostrarMensaje(
            elementos.mensajeGaleria,
            id ? "Contenido actualizado correctamente." : "Contenido publicado correctamente.",
            true
        );
        await cargarGaleria();
    } finally {
        cambiarEstadoBoton(
            elementos.guardarContenido,
            false,
            elementos.galeriaId.value ? "Guardar cambios" : "Publicar contenido"
        );
    }
}

function crearPathGaleria(nombreOriginal, tipo) {
    const extension = (nombreOriginal.split(".").pop() || "").toLowerCase();
    const extensionSegura = extension.replace(/[^a-z0-9]/g, "") || (tipo === "video" ? "mp4" : "jpg");
    const aleatorio = (crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2));
    const carpeta = tipo === "video" ? "videos" : "fotos";
    return `${carpeta}/${Date.now()}-${aleatorio}.${extensionSegura}`;
}

function editarContenidoGaleria(id) {
    const item = contenidoGaleria.find((contenido) => contenido.id === id);
    if (!item) return;

    elementos.galeriaId.value = item.id;
    elementos.galeriaPathActual.value = item.archivo_path;
    elementos.galeriaTitulo.value = item.titulo || "";
    elementos.galeriaDescripcion.value = item.descripcion || "";
    elementos.galeriaOrden.value = Number(item.orden) || 0;
    elementos.galeriaActivo.checked = Boolean(item.activo);
    elementos.galeriaArchivo.value = "";

    elementos.modoGaleria.textContent = "Editar contenido";
    elementos.tituloFormularioGaleria.textContent = item.titulo || "Editar publicación";
    elementos.guardarContenido.textContent = "Guardar cambios";
    mostrarPreviaGaleriaDesdeUrl(item);
    limpiarMensaje(elementos.mensajeGaleria);

    elementos.formularioGaleria.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}

async function cambiarVisibilidadGaleria(id) {
    const item = contenidoGaleria.find((contenido) => contenido.id === id);
    if (!item) return;

    const nuevoEstado = !item.activo;

    const { error } = await clienteSupabase
        .from("contenido_galeria")
        .update({ activo: nuevoEstado })
        .eq("id", id);

    if (error) {
        console.error("No se pudo cambiar la visibilidad:", error);
        mostrarToast("No se pudo cambiar la visibilidad");
        return;
    }

    mostrarToast(nuevoEstado ? "Contenido publicado" : "Contenido ocultado");
    await cargarGaleria();
}

async function eliminarContenidoGaleria(id) {
    const item = contenidoGaleria.find((contenido) => contenido.id === id);
    if (!item) return;

    const confirmar = window.confirm(
        `¿Eliminar "${item.titulo}"? Esta acción quitará el contenido del panel y de la página.`
    );

    if (!confirmar) return;

    const { error: errorRegistro } = await clienteSupabase
        .from("contenido_galeria")
        .delete()
        .eq("id", id);

    if (errorRegistro) {
        console.error("No se pudo eliminar el registro:", errorRegistro);
        mostrarToast("No se pudo eliminar el contenido");
        return;
    }

    const { error: errorArchivo } = await clienteSupabase.storage
        .from("galeria")
        .remove([item.archivo_path]);

    if (errorArchivo) {
        console.warn(
            "El registro se eliminó, pero el archivo quedó pendiente de limpieza:",
            errorArchivo
        );
    }

    if (elementos.galeriaId.value === id) {
        limpiarFormularioGaleria();
    }

    mostrarToast("Contenido eliminado");
    await cargarGaleria();
}

function limpiarFormularioGaleria(limpiarMensajeActual = true) {
    elementos.formularioGaleria.reset();
    elementos.galeriaId.value = "";
    elementos.galeriaPathActual.value = "";
    elementos.galeriaOrden.value = siguienteOrdenGaleria();
    elementos.galeriaActivo.checked = true;
    elementos.galeriaArchivo.value = "";
    elementos.galeriaVistaPrevia.hidden = true;
    elementos.galeriaVistaPrevia.innerHTML = "";
    elementos.modoGaleria.textContent = "Nuevo contenido";
    elementos.tituloFormularioGaleria.textContent = "Publicar foto o video";
    elementos.guardarContenido.textContent = "Publicar contenido";

    if (limpiarMensajeActual) {
        limpiarMensaje(elementos.mensajeGaleria);
    }
}

function siguienteOrdenGaleria() {
    if (contenidoGaleria.length === 0) return 1;

    return Math.max(
        ...contenidoGaleria.map((item) => Number(item.orden) || 0)
    ) + 1;
}

function escaparAtributo(texto) {
    return escaparHTML(texto).replace(/`/g, "&#96;");
}


function formatearFecha(fecha) {
    if (!fecha) return "Sin fecha";

    return new Intl.DateTimeFormat("es-CL", {
        dateStyle: "medium",
        timeStyle: "short"
    }).format(new Date(fecha));
}

function normalizarTelefonoWhatsApp(telefono) {
    let digitos = String(telefono || "").replace(/\D/g, "");

    if (digitos.startsWith("00")) digitos = digitos.slice(2);
    if (digitos.startsWith("0")) digitos = digitos.slice(1);
    if (digitos.length === 9) digitos = `56${digitos}`;

    return digitos;
}

function formatearPrecio(valor) {
    return new Intl.NumberFormat("es-CL", {
        style: "currency",
        currency: "CLP",
        maximumFractionDigits: 0
    }).format(Number(valor) || 0);
}

function escaparHTML(texto) {
    return String(texto ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function mostrarMensaje(elemento, texto, exito = false) {
    elemento.textContent = texto;
    elemento.classList.toggle("exito", exito);
}

function limpiarMensaje(elemento) {
    elemento.textContent = "";
    elemento.classList.remove("exito");
}

function cambiarEstadoBoton(boton, cargando, texto) {
    boton.disabled = cargando;
    boton.textContent = texto;
}

function mostrarToast(mensaje) {
    elementos.toast.textContent = mensaje;
    elementos.toast.classList.add("visible");

    clearTimeout(temporizadorToast);
    temporizadorToast = setTimeout(() => {
        elementos.toast.classList.remove("visible");
    }, 2400);
}