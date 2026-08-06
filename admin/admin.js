"use strict";

const CATEGORIAS = {
    alimentos: "Alimentos",
    cuidado: "Cuidado personal",
    hogar: "Hogar"
};

const ESTADOS = {
    disponible: "Disponible",
    ultimas: "Últimas unidades",
    pedido: "A pedido",
    agotado: "Agotado"
};

let clienteSupabase = null;
let productos = [];
let usuarioActual = null;
let temporizadorToast = null;
let modoRecuperacion = false;

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
    correoAdmin: document.getElementById("correo-admin"),
    cerrarSesion: document.getElementById("cerrar-sesion"),
    nuevoProducto: document.getElementById("nuevo-producto"),
    actualizarListado: document.getElementById("actualizar-listado"),
    formularioProducto: document.getElementById("formulario-producto"),
    productoId: document.getElementById("producto-id"),
    productoNombre: document.getElementById("producto-nombre"),
    productoPrecio: document.getElementById("producto-precio"),
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
    elementos.mostrarPassword.addEventListener("click", alternarPassword);
    elementos.cerrarSesion.addEventListener("click", cerrarSesion);
    elementos.formularioProducto.addEventListener("submit", guardarProducto);
    elementos.cancelarEdicion.addEventListener("click", limpiarFormulario);
    elementos.nuevoProducto.addEventListener("click", () => {
        limpiarFormulario();
        elementos.productoNombre.focus();
    });
    elementos.actualizarListado.addEventListener("click", cargarProductos);

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

    if (nuevaPassword.length < 8) {
        mostrarMensaje(
            elementos.mensajeLogin,
            "La contraseña debe tener por lo menos 8 caracteres."
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

        mostrarMensaje(
            elementos.mensajeLogin,
            `Error: ${error?.code || "sin código"} - ${error?.message || "No se recibió el usuario."}`
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

    if (!autorizado) {
        return false;
    }

    usuarioActual = usuario;
    elementos.correoAdmin.textContent = usuario.email || "Administrador";
    elementos.vistaAcceso.hidden = true;
    elementos.vistaPanel.hidden = false;
    limpiarMensaje(elementos.mensajeLogin);
    await cargarProductos();
    return true;
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
        .select("id,nombre,precio,categoria,descripcion,emoji,etiqueta,estado,orden")
        .order("orden", { ascending: true })
        .order("nombre", { ascending: true });

    if (error) {
        console.error("Error cargando productos:", error);
        elementos.estadoCarga.textContent =
            "No se pudo cargar el catálogo. Comprueba la conexión y los permisos.";
        return;
    }

    productos = Array.isArray(data) ? data : [];
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

async function guardarProducto(evento) {
    evento.preventDefault();
    limpiarMensaje(elementos.mensajeProducto);

    const idExistente = elementos.productoId.value;
    const nombre = elementos.productoNombre.value.trim();
    const precio = Number(elementos.productoPrecio.value);
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
    elementos.productoCategoria.value = "alimentos";
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