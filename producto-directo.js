"use strict";

/* Re Orgánico: apertura fiable de productos mediante /producto/ID o ?producto=ID. */
(() => {
    const DOMINIO_SITIO = "https://reorganico.cl";
    const MARCA_ABIERTO = "productoDirectoAbierto";
    let ultimoIntentoId = null;
    let observador = null;
    let temporizador = null;

    function obtenerIdProducto() {
        try {
            const url = new URL(window.location.href);
            const partes = url.pathname.split("/").filter(Boolean);
            const indice = partes.findIndex((parte) => parte.toLowerCase() === "producto");

            if (indice !== -1 && partes[indice + 1]) {
                return decodeURIComponent(partes[indice + 1]).trim().toLowerCase();
            }

            const id = url.searchParams.get("producto");
            return id ? decodeURIComponent(id).trim().toLowerCase() : null;
        } catch (error) {
            console.error("Re Orgánico: no se pudo obtener el producto", error);
            return null;
        }
    }

    function crearUrlProducto(id) {
        return `${DOMINIO_SITIO}/producto/${encodeURIComponent(String(id).trim())}`;
    }

    function normalizarUrl() {
        const id = obtenerIdProducto();
        if (!id) return;

        const url = new URL(window.location.href);
        const esRutaProducto = url.pathname.split("/").filter(Boolean)[0]?.toLowerCase() === "producto";

        if (!esRutaProducto) {
            history.replaceState({ producto: id }, "", `/producto/${encodeURIComponent(id)}`);
        }
    }

    function normalizarEnlaces() {
        document.querySelectorAll("article.producto[data-id]").forEach((tarjeta) => {
            const id = tarjeta.dataset.id;
            if (!id) return;

            tarjeta.querySelectorAll("a.enlace-producto-directo").forEach((enlace) => {
                enlace.href = crearUrlProducto(id);
                enlace.dataset.urlProductoLimpia = enlace.href;
            });
        });
    }

    function buscarBoton(id) {
        if (!id) return null;

        return Array.from(document.querySelectorAll('[data-accion="detalle"][data-id]'))
            .find((boton) => String(boton.dataset.id || "").trim().toLowerCase() === id) || null;
    }

    function abrirProducto() {
        const id = obtenerIdProducto();
        if (!id) return false;

        const boton = buscarBoton(id);
        if (!boton) return false;

        if (boton.dataset[MARCA_ABIERTO] === "1") return true;

        boton.dataset[MARCA_ABIERTO] = "1";
        ultimoIntentoId = id;
        boton.click();

        setTimeout(() => {
            const modal = document.getElementById("modal-producto");
            if (modal) modal.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 300);

        if (temporizador) clearInterval(temporizador);
        if (observador) observador.disconnect();
        return true;
    }

    function iniciar() {
        normalizarUrl();
        normalizarEnlaces();

        // Intenta abrir el producto repetidamente mientras el catálogo se carga desde Supabase.
        abrirProducto();
        let intentos = 0;
        temporizador = setInterval(() => {
            intentos++;
            normalizarEnlaces();
            if (abrirProducto() || intentos >= 120) clearInterval(temporizador);
        }, 500);

        observador = new MutationObserver(() => {
            normalizarEnlaces();
            if (ultimoIntentoId === null) abrirProducto();
        });

        if (document.body) {
            observador.observe(document.body, { childList: true, subtree: true });
        }
    }

    document.addEventListener("click", (evento) => {
        const enlace = evento.target.closest("a.enlace-producto-directo");
        if (!enlace) return;

        const tarjeta = enlace.closest("article.producto[data-id]");
        const id = tarjeta?.dataset.id;
        if (!id) return;

        evento.preventDefault();
        evento.stopImmediatePropagation();

        const url = crearUrlProducto(id);
        navigator.clipboard.writeText(url).then(() => {
            const texto = enlace.textContent;
            enlace.textContent = "✓ Link copiado";
            setTimeout(() => enlace.textContent = texto || "🔗 Link de Producto", 1800);
        }).catch(() => window.prompt("Copia este link:", url));
    }, true);

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", iniciar, { once: true });
    } else {
        iniciar();
    }
})();
