"use strict";

/* Re Orgánico: URLs limpias /producto/ID y apertura directa del producto. */
(() => {

    function obtenerIdProducto() {
        try {
            const url = new URL(window.location.href);
            const partes = url.pathname.split("/").filter(Boolean);
            const indiceProducto = partes.indexOf("producto");

            if (indiceProducto !== -1 && partes[indiceProducto + 1]) {
                return decodeURIComponent(partes[indiceProducto + 1]).trim().toLowerCase();
            }

            const idQuery = url.searchParams.get("producto");
            if (idQuery) {
                return decodeURIComponent(idQuery).trim().toLowerCase();
            }
        } catch (error) {
            console.error("Re Orgánico: error obteniendo ID", error);
        }

        return null;
    }

    function crearUrlProducto(id) {
        return `${window.location.origin}/producto/${encodeURIComponent(id)}`;
    }

    function normalizarEnlaces() {
        document.querySelectorAll(
            'a.enlace-producto-directo, .enlace-compartible-producto input'
        ).forEach((elemento) => {
            const tarjeta = elemento.closest("article.producto[data-id]");
            const id = tarjeta?.dataset.id;

            if (!id) return;

            const url = crearUrlProducto(id);

            if (elemento.tagName === "A") {
                elemento.href = url;
                elemento.dataset.urlProductoLimpia = url;
            } else {
                elemento.value = url;
            }
        });
    }

    function buscarBoton(id) {
        if (!id) return null;

        const botones = document.querySelectorAll(
            '[data-accion="detalle"][data-id]'
        );

        for (const boton of botones) {
            const idBoton = String(boton.dataset.id || "")
                .trim()
                .toLowerCase();

            if (idBoton === id) return boton;
        }

        return null;
    }

    function abrirProductoDesdeUrl() {
        const id = obtenerIdProducto();
        if (!id) return false;

        const boton = buscarBoton(id);
        if (!boton) return false;

        if (boton.dataset.productoDirectoAbierto === "1") return true;

        boton.dataset.productoDirectoAbierto = "1";
        boton.click();

        setTimeout(() => {
            const modal = document.getElementById("modal-producto");
            if (modal) {
                modal.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });
            }
        }, 250);

        return true;
    }

    function interceptarEnlaces() {
        document.addEventListener("click", async (evento) => {
            const enlace = evento.target.closest("a.enlace-producto-directo");
            if (!enlace) return;

            const tarjeta = enlace.closest("article.producto[data-id]");
            const id = tarjeta?.dataset.id;
            if (!id) return;

            evento.preventDefault();
            evento.stopImmediatePropagation();

            const url = crearUrlProducto(id);

            try {
                await navigator.clipboard.writeText(url);
                const texto = enlace.textContent;
                enlace.textContent = "✓ Link copiado";
                setTimeout(() => {
                    enlace.textContent = texto || "🔗 Link de Producto";
                }, 1800);
            } catch (error) {
                window.prompt("Copia este link:", url);
            }
        }, true);
    }

    function iniciar() {
        normalizarEnlaces();
        abrirProductoDesdeUrl();
        interceptarEnlaces();

        const observador = new MutationObserver(() => {
            normalizarEnlaces();
            abrirProductoDesdeUrl();
        });

        observador.observe(document.body, {
            childList: true,
            subtree: true
        });

        let intentos = 0;
        const temporizador = setInterval(() => {
            intentos++;
            normalizarEnlaces();

            if (abrirProductoDesdeUrl() || intentos >= 120) {
                clearInterval(temporizador);
            }
        }, 500);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", iniciar, { once: true });
    } else {
        iniciar();
    }
})();
