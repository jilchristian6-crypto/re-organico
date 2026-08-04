"use strict";

/* =====================================================
   DATOS GENERALES DE LA TIENDA
===================================================== */

const TIENDA = {
    nombre: "Re Orgánico",
    whatsapp: "56900000000",
    whatsappVisible: "+56 9 0000 0000",
    instagram: "@reorganico",
    direccion: "Dirección por confirmar",
    horario: "Horario por confirmar"
};

const CLAVE_CARRITO = "reOrganico_carrito_v3";

const PRODUCTOS_RESPALDO = [
    {
        id: "palta-organica",
        nombre: "Palta orgánica",
        precio: 3500,
        categoria: "alimentos",
        descripcion: "Producto fresco, seleccionado y de excelente calidad.",
        emoji: "🥑",
        etiqueta: "Destacado",
        estado: "disponible",
        orden: 1
    },
    {
        id: "miel-natural",
        nombre: "Miel natural",
        precio: 5990,
        categoria: "alimentos",
        descripcion: "Miel pura y natural, ideal para acompañar tus desayunos.",
        emoji: "🍯",
        etiqueta: "Natural",
        estado: "ultimas",
        orden: 2
    },
    {
        id: "jabon-artesanal",
        nombre: "Jabón artesanal",
        precio: 3490,
        categoria: "cuidado",
        descripcion: "Elaborado con ingredientes naturales para cuidar tu piel.",
        emoji: "🧼",
        etiqueta: "Artesanal",
        estado: "disponible",
        orden: 3
    },
    {
        id: "vela-aromatica",
        nombre: "Vela aromática",
        precio: 6990,
        categoria: "hogar",
        descripcion: "Aroma suave y natural para crear un ambiente más agradable.",
        emoji: "🕯️",
        etiqueta: "Ecológico",
        estado: "pedido",
        orden: 4
    }
];

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

const FONDOS = {
    alimentos: "linear-gradient(145deg, #e6f1dc, #abc58f)",
    cuidado: "linear-gradient(145deg, #f8e1dc, #dda99d)",
    hogar: "linear-gradient(145deg, #deeeeb, #9bbdb4)"
};

let productos = PRODUCTOS_RESPALDO.map((producto) => ({ ...producto }));
let carrito = cargarCarrito();
let categoriaActiva = "todos";
let productoModalId = null;
let temporizadorToast = null;
let clienteSupabase = null;

const elementos = {
    encabezado: document.getElementById("encabezado"),
    botonMenu: document.getElementById("boton-menu"),
    menu: document.getElementById("menu"),
    listaProductos: document.getElementById("lista-productos"),
    buscador: document.getElementById("buscador-productos"),
    limpiarBusqueda: document.getElementById("limpiar-busqueda"),
    contadorProductos: document.getElementById("contador-productos"),
    filtros: document.getElementById("filtros-productos"),
    sinResultados: document.getElementById("sin-resultados"),
    contadorCarrito: document.getElementById("contador-carrito"),
    carrito: document.getElementById("carrito"),
    carritoLista: document.getElementById("carrito-lista"),
    carritoVacio: document.getElementById("carrito-vacio"),
    carritoTotal: document.getElementById("carrito-total"),
    modalProducto: document.getElementById("modal-producto"),
    modalProductoVisual: document.getElementById("modal-producto-visual"),
    modalProductoCategoria: document.getElementById("modal-producto-categoria"),
    modalProductoTitulo: document.getElementById("modal-producto-titulo"),
    modalProductoDescripcion: document.getElementById("modal-producto-descripcion"),
    modalProductoPrecio: document.getElementById("modal-producto-precio"),
    modalAgregarCarrito: document.getElementById("modal-agregar-carrito"),
    formularioConsulta: document.getElementById("formulario-consulta"),
    productoConsulta: document.getElementById("producto-consulta"),
    volverArriba: document.getElementById("volver-arriba"),
    toast: document.getElementById("toast")
};

inicializar();

async function inicializar() {
    aplicarDatosTienda();
    inicializarEventos();
    inicializarAnimaciones();
    actualizarNavegacion();
    renderizarCatalogo();
    renderizarCarrito();
    renderizarSelectorProductos();

    clienteSupabase = crearClienteSupabase();

    if (clienteSupabase) {
        await cargarProductosDesdeSupabase();
    }
}

function crearClienteSupabase() {
    const configuracion = window.REORGANICO_SUPABASE;

    if (
        !configuracion ||
        !configuracion.url ||
        !configuracion.anonKey ||
        configuracion.url.includes("PEGA_AQUI") ||
        configuracion.anonKey.includes("PEGA_AQUI") ||
        !window.supabase
    ) {
        console.info("Supabase aún no está configurado. Se muestra el catálogo de respaldo.");
        return null;
    }

    return window.supabase.createClient(configuracion.url, configuracion.anonKey);
}

async function cargarProductosDesdeSupabase() {
    const { data, error } = await clienteSupabase
        .from("productos")
        .select("id,nombre,precio,categoria,descripcion,emoji,etiqueta,estado,orden")
        .order("orden", { ascending: true })
        .order("nombre", { ascending: true });

    if (error) {
        console.error("No fue posible cargar el catálogo:", error);
        mostrarToast("No se pudo actualizar el catálogo. Se muestra una copia local.");
        return;
    }

    if (Array.isArray(data) && data.length > 0) {
        productos = data;
        limpiarCarritoDesactualizado();
        renderizarCatalogo();
        renderizarCarrito();
        renderizarSelectorProductos();
    }
}

function cargarCarrito() {
    try {
        const guardado = JSON.parse(localStorage.getItem(CLAVE_CARRITO));
        return Array.isArray(guardado) ? guardado : [];
    } catch (error) {
        console.warn("No se pudo cargar el carrito:", error);
        return [];
    }
}

function guardarCarrito() {
    localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito));
}

function limpiarCarritoDesactualizado() {
    const idsDisponibles = new Set(productos.map((producto) => producto.id));
    const carritoLimpio = carrito.filter((item) => idsDisponibles.has(item.id));

    if (carritoLimpio.length !== carrito.length) {
        carrito = carritoLimpio;
        guardarCarrito();
    }
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

function fondoProducto(producto) {
    return FONDOS[producto.categoria] || FONDOS.alimentos;
}

function mostrarToast(mensaje) {
    elementos.toast.textContent = mensaje;
    elementos.toast.classList.add("visible");

    clearTimeout(temporizadorToast);
    temporizadorToast = setTimeout(() => {
        elementos.toast.classList.remove("visible");
    }, 2600);
}

function construirEnlaceWhatsApp(mensaje) {
    return `https://wa.me/${TIENDA.whatsapp}?text=${encodeURIComponent(mensaje)}`;
}

function aplicarDatosTienda() {
    document.getElementById("dato-direccion").textContent = TIENDA.direccion;
    document.getElementById("dato-whatsapp").textContent = TIENDA.whatsappVisible;
    document.getElementById("dato-instagram").textContent = TIENDA.instagram;
    document.getElementById("dato-horario").textContent = TIENDA.horario;

    const mensajeGeneral = `Hola, quiero consultar por los productos de ${TIENDA.nombre}.`;
    const enlace = construirEnlaceWhatsApp(mensajeGeneral);

    document.getElementById("enlace-whatsapp-contacto").href = enlace;
    document.getElementById("whatsapp-flotante").href = enlace;
}

function productosFiltrados() {
    const busqueda = elementos.buscador.value.toLowerCase().trim();

    return productos.filter((producto) => {
        const coincideCategoria =
            categoriaActiva === "todos" || producto.categoria === categoriaActiva;

        const contenido = `${producto.nombre} ${producto.descripcion} ${CATEGORIAS[producto.categoria] || ""}`
            .toLowerCase();

        return coincideCategoria && contenido.includes(busqueda);
    });
}

function renderizarCatalogo() {
    const visibles = productosFiltrados();

    elementos.listaProductos.innerHTML = visibles
        .map((producto) => crearTarjetaProducto(producto))
        .join("");

    elementos.sinResultados.hidden = visibles.length !== 0;
    elementos.contadorProductos.textContent =
        visibles.length === 1
            ? "1 producto encontrado"
            : `${visibles.length} productos encontrados`;

    actualizarBotonLimpiar();
}

function crearTarjetaProducto(producto) {
    const agotado = producto.estado === "agotado";
    const etiqueta = producto.etiqueta
        ? `<span class="producto-etiqueta">${escaparHTML(producto.etiqueta)}</span>`
        : "";

    return `
        <article class="producto revelar visible" data-id="${escaparHTML(producto.id)}">
            <div class="producto-visual" style="--fondo-producto: ${fondoProducto(producto)}">
                ${etiqueta}
                <span class="estado-producto ${escaparHTML(producto.estado)}">${ESTADOS[producto.estado] || "Disponible"}</span>
                <span class="producto-emoji" aria-hidden="true">${escaparHTML(producto.emoji)}</span>
            </div>

            <div class="producto-informacion">
                <span class="producto-categoria">${CATEGORIAS[producto.categoria] || "Producto"}</span>
                <h3>${escaparHTML(producto.nombre)}</h3>
                <p>${escaparHTML(producto.descripcion)}</p>

                <div class="producto-acciones">
                    <div class="producto-precio">
                        <span>Precio referencial</span>
                        <strong>${formatearPrecio(producto.precio)}</strong>
                    </div>

                    <button class="boton-detalle" type="button" data-accion="detalle" data-id="${escaparHTML(producto.id)}">
                        Ver detalles
                    </button>

                    <button class="boton-agregar" type="button" data-accion="agregar" data-id="${escaparHTML(producto.id)}" ${agotado ? "disabled" : ""}>
                        ${agotado ? "Agotado" : "Agregar"}
                    </button>
                </div>
            </div>
        </article>
    `;
}

function actualizarBotonLimpiar() {
    elementos.limpiarBusqueda.style.visibility = elementos.buscador.value ? "visible" : "hidden";
}

function renderizarSelectorProductos() {
    const valorActual = elementos.productoConsulta.value;

    elementos.productoConsulta.innerHTML = `
        <option value="">Selecciona un producto</option>
        ${productos
            .map(
                (producto) =>
                    `<option value="${escaparHTML(producto.nombre)}">${escaparHTML(producto.nombre)}</option>`
            )
            .join("")}
    `;

    if ([...elementos.productoConsulta.options].some((opcion) => opcion.value === valorActual)) {
        elementos.productoConsulta.value = valorActual;
    }
}

function abrirDetalleProducto(id) {
    const producto = productos.find((item) => item.id === id);
    if (!producto) return;

    productoModalId = id;
    elementos.modalProductoVisual.textContent = producto.emoji;
    elementos.modalProductoVisual.style.setProperty("--fondo-producto", fondoProducto(producto));
    elementos.modalProductoCategoria.textContent = CATEGORIAS[producto.categoria] || "Producto";
    elementos.modalProductoTitulo.textContent = producto.nombre;
    elementos.modalProductoDescripcion.textContent = producto.descripcion;
    elementos.modalProductoPrecio.textContent = formatearPrecio(producto.precio);
    elementos.modalAgregarCarrito.disabled = producto.estado === "agotado";
    elementos.modalAgregarCarrito.textContent =
        producto.estado === "agotado" ? "Producto agotado" : "Agregar a la cotización";

    abrirModal(elementos.modalProducto);
}

function abrirModal(modal) {
    modal.classList.add("activo");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("bloqueado");
}

function cerrarModal(modal) {
    modal.classList.remove("activo");
    modal.setAttribute("aria-hidden", "true");

    if (!document.querySelector(".modal.activo, .carrito.activo")) {
        document.body.classList.remove("bloqueado");
    }
}

function agregarAlCarrito(id) {
    const producto = productos.find((item) => item.id === id);
    if (!producto || producto.estado === "agotado") return;

    const item = carrito.find((productoCarrito) => productoCarrito.id === id);

    if (item) {
        item.cantidad += 1;
    } else {
        carrito.push({ id, cantidad: 1 });
    }

    guardarCarrito();
    renderizarCarrito();
    mostrarToast(`${producto.nombre} agregado a la cotización`);
}

function cambiarCantidad(id, cambio) {
    const item = carrito.find((productoCarrito) => productoCarrito.id === id);
    if (!item) return;

    item.cantidad += cambio;

    if (item.cantidad <= 0) {
        carrito = carrito.filter((productoCarrito) => productoCarrito.id !== id);
    }

    guardarCarrito();
    renderizarCarrito();
}

function eliminarDelCarrito(id) {
    carrito = carrito.filter((item) => item.id !== id);
    guardarCarrito();
    renderizarCarrito();
}

function vaciarCarrito() {
    carrito = [];
    guardarCarrito();
    renderizarCarrito();
    mostrarToast("Cotización vaciada");
}

function obtenerDetalleCarrito() {
    return carrito
        .map((item) => {
            const producto = productos.find((productoActual) => productoActual.id === item.id);
            return producto ? { ...producto, cantidad: item.cantidad } : null;
        })
        .filter(Boolean);
}

function calcularTotal() {
    return obtenerDetalleCarrito().reduce(
        (total, item) => total + Number(item.precio) * item.cantidad,
        0
    );
}

function renderizarCarrito() {
    const detalle = obtenerDetalleCarrito();
    const cantidadTotal = detalle.reduce((total, item) => total + item.cantidad, 0);

    elementos.contadorCarrito.textContent = cantidadTotal;
    elementos.carritoVacio.hidden = detalle.length !== 0;
    elementos.carritoLista.hidden = detalle.length === 0;

    elementos.carritoLista.innerHTML = detalle
        .map(
            (item) => `
                <article class="carrito-item">
                    <div class="carrito-item-visual" style="--fondo-producto: ${fondoProducto(item)}">
                        ${escaparHTML(item.emoji)}
                    </div>

                    <div class="carrito-item-info">
                        <h3>${escaparHTML(item.nombre)}</h3>
                        <span>${formatearPrecio(item.precio)} c/u</span>

                        <div class="control-cantidad">
                            <button type="button" data-carrito="restar" data-id="${escaparHTML(item.id)}" aria-label="Restar una unidad">−</button>
                            <strong>${item.cantidad}</strong>
                            <button type="button" data-carrito="sumar" data-id="${escaparHTML(item.id)}" aria-label="Agregar una unidad">+</button>
                        </div>
                    </div>

                    <button class="carrito-item-eliminar" type="button" data-carrito="eliminar" data-id="${escaparHTML(item.id)}" aria-label="Eliminar producto">×</button>
                </article>
            `
        )
        .join("");

    elementos.carritoTotal.textContent = formatearPrecio(calcularTotal());
    document.getElementById("enviar-pedido").disabled = detalle.length === 0;
    document.getElementById("vaciar-carrito").disabled = detalle.length === 0;
}

function abrirCarrito() {
    elementos.carrito.classList.add("activo");
    elementos.carrito.setAttribute("aria-hidden", "false");
    document.body.classList.add("bloqueado");
}

function cerrarCarrito() {
    elementos.carrito.classList.remove("activo");
    elementos.carrito.setAttribute("aria-hidden", "true");

    if (!document.querySelector(".modal.activo")) {
        document.body.classList.remove("bloqueado");
    }
}

function enviarCotizacionWhatsApp() {
    const detalle = obtenerDetalleCarrito();

    if (detalle.length === 0) {
        mostrarToast("Agrega productos antes de enviar");
        return;
    }

    const lineas = detalle.map(
        (item) =>
            `• ${item.cantidad} x ${item.nombre} — ${formatearPrecio(item.precio * item.cantidad)}`
    );

    const mensaje = [
        `Hola, quiero solicitar una cotización en ${TIENDA.nombre}:`,
        "",
        ...lineas,
        "",
        `Total referencial: ${formatearPrecio(calcularTotal())}`,
        "",
        "Quedo atento(a) a la disponibilidad y forma de entrega."
    ].join("\n");

    window.open(construirEnlaceWhatsApp(mensaje), "_blank", "noopener,noreferrer");
}

function enviarConsulta(evento) {
    evento.preventDefault();

    const nombre = document.getElementById("nombre-cliente").value.trim();
    const producto = elementos.productoConsulta.value;
    const adicional = document.getElementById("mensaje-consulta").value.trim();

    if (!nombre || !producto) {
        mostrarToast("Completa tu nombre y selecciona un producto");
        return;
    }

    const mensaje = [
        `Hola, mi nombre es ${nombre}.`,
        `Quiero consultar por: ${producto}.`,
        adicional ? `Consulta adicional: ${adicional}` : "",
        `Mensaje enviado desde la página de ${TIENDA.nombre}.`
    ]
        .filter(Boolean)
        .join("\n\n");

    window.open(construirEnlaceWhatsApp(mensaje), "_blank", "noopener,noreferrer");
}

function inicializarEventos() {
    elementos.botonMenu.addEventListener("click", () => {
        const activo = elementos.menu.classList.toggle("activo");
        elementos.botonMenu.setAttribute("aria-expanded", String(activo));
    });

    elementos.menu.addEventListener("click", (evento) => {
        if (evento.target.matches("a")) {
            elementos.menu.classList.remove("activo");
            elementos.botonMenu.setAttribute("aria-expanded", "false");
        }
    });

    elementos.buscador.addEventListener("input", renderizarCatalogo);

    elementos.limpiarBusqueda.addEventListener("click", () => {
        elementos.buscador.value = "";
        elementos.buscador.focus();
        renderizarCatalogo();
    });

    elementos.filtros.addEventListener("click", (evento) => {
        const boton = evento.target.closest("[data-categoria]");
        if (!boton) return;

        categoriaActiva = boton.dataset.categoria;
        elementos.filtros.querySelectorAll(".filtro").forEach((filtro) => {
            filtro.classList.toggle("activo", filtro === boton);
        });
        renderizarCatalogo();
    });

    elementos.listaProductos.addEventListener("click", (evento) => {
        const boton = evento.target.closest("[data-accion]");
        if (!boton) return;

        if (boton.dataset.accion === "detalle") abrirDetalleProducto(boton.dataset.id);
        if (boton.dataset.accion === "agregar") agregarAlCarrito(boton.dataset.id);
    });

    document.getElementById("abrir-carrito").addEventListener("click", abrirCarrito);
    document.getElementById("hero-abrir-carrito").addEventListener("click", abrirCarrito);
    document.getElementById("cerrar-carrito").addEventListener("click", cerrarCarrito);
    document.getElementById("cerrar-carrito-fondo").addEventListener("click", cerrarCarrito);
    document.getElementById("enviar-pedido").addEventListener("click", enviarCotizacionWhatsApp);
    document.getElementById("vaciar-carrito").addEventListener("click", vaciarCarrito);

    elementos.carritoLista.addEventListener("click", (evento) => {
        const boton = evento.target.closest("[data-carrito]");
        if (!boton) return;

        const { carrito: accion, id } = boton.dataset;
        if (accion === "sumar") cambiarCantidad(id, 1);
        if (accion === "restar") cambiarCantidad(id, -1);
        if (accion === "eliminar") eliminarDelCarrito(id);
    });

    elementos.modalAgregarCarrito.addEventListener("click", () => {
        if (productoModalId) agregarAlCarrito(productoModalId);
    });

    document.querySelectorAll('[data-cerrar-modal="producto"]').forEach((boton) => {
        boton.addEventListener("click", () => cerrarModal(elementos.modalProducto));
    });

    elementos.formularioConsulta.addEventListener("submit", enviarConsulta);

    document.querySelectorAll(".pregunta-boton").forEach((boton) => {
        boton.addEventListener("click", () => {
            const pregunta = boton.closest(".pregunta");
            const yaActiva = pregunta.classList.contains("activa");

            document.querySelectorAll(".pregunta").forEach((item) => {
                item.classList.remove("activa");
                item.querySelector(".pregunta-boton").setAttribute("aria-expanded", "false");
            });

            if (!yaActiva) {
                pregunta.classList.add("activa");
                boton.setAttribute("aria-expanded", "true");
            }
        });
    });

    elementos.volverArriba.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });

    window.addEventListener("scroll", actualizarNavegacion, { passive: true });

    document.addEventListener("visibilitychange", () => {
        if (!document.hidden && clienteSupabase) {
            cargarProductosDesdeSupabase();
        }
    });

    document.addEventListener("keydown", (evento) => {
        if (evento.key !== "Escape") return;
        cerrarModal(elementos.modalProducto);
        cerrarCarrito();
    });
}

function inicializarAnimaciones() {
    const elementosAnimados = document.querySelectorAll(".revelar");

    if (!("IntersectionObserver" in window)) {
        elementosAnimados.forEach((elemento) => elemento.classList.add("visible"));
        return;
    }

    const observador = new IntersectionObserver(
        (entradas) => {
            entradas.forEach((entrada) => {
                if (entrada.isIntersecting) {
                    entrada.target.classList.add("visible");
                    observador.unobserve(entrada.target);
                }
            });
        },
        { threshold: 0.1 }
    );

    elementosAnimados.forEach((elemento) => observador.observe(elemento));
}

function actualizarNavegacion() {
    elementos.encabezado.classList.toggle("con-scroll", window.scrollY > 35);
    elementos.volverArriba.classList.toggle("visible", window.scrollY > 500);

    const enlaces = [...document.querySelectorAll('.menu a[href^="#"]')];
    const posicion = window.scrollY + 180;
    let enlaceActivo = null;

    enlaces.forEach((enlace) => {
        const seccion = document.querySelector(enlace.getAttribute("href"));
        if (!seccion) return;

        const inicio = seccion.offsetTop;
        const final = inicio + seccion.offsetHeight;

        if (posicion >= inicio && posicion < final) enlaceActivo = enlace;
    });

    enlaces.forEach((enlace) => enlace.classList.toggle("enlace-activo", enlace === enlaceActivo));
}
