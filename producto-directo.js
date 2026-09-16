"use strict";

/* Re Orgánico: abre automáticamente el producto indicado por ?producto=ID o /producto/ID. */
(() => {
    const PARAMETRO = "producto";
    let productoAbierto = null;

    function obtenerIdProducto() {
        try {
            const url = new URL(window.location.href);
            const desdeQuery = url.searchParams.get(PARAMETRO);
            if (desdeQuery) return decodeURIComponent(desdeQuery).trim();

            const partes = url.pathname.split("/").filter(Boolean);
            if (partes.length >= 2 && partes[0].toLowerCase() === "producto") {
                return decodeURIComponent(partes[partes.length - 1]).trim();
            }
        } catch (error) {
            return null;
        }
        return null;
    }

    function normalizarId(valor) {
        return String(valor || "")
            .trim()
            .toLowerCase();
    }

    function encontrarBoton(id) {
        const buscado = normalizarId(id);
        if (!buscado) return null;

        const tarjetas = document.querySelectorAll("article.producto[data-id]");
        for (const tarjeta of tarjetas) {
            if (normalizarId(tarjeta.dataset.id) === buscado) {
                const boton = tarjeta.querySelector('[data-accion="detalle"][data-id]');
                if (boton) return boton;
            }
        }

        const botones = document.querySelectorAll('[data-accion="detalle"][data-id]');
        for (const boton of botones) {
            if (normalizarId(boton.dataset.id) === buscado) return boton;
        }

        return null;
    }

    function abrirProductoDesdeUrl() {
        const id = obtenerIdProducto();
        if (!id || normalizarId(id) === normalizarId(productoAbierto)) return false;

        const boton = encontrarBoton(id);
        if (!boton) return false;

        productoAbierto = id;
        boton.click();

        setTimeout(() => {
            const modal = document.getElementById("modal-producto");
            if (modal) modal.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 250);

        return true;
    }

    function iniciar() {
        abrirProductoDesdeUrl();

        const observador = new MutationObserver(() => {
            abrirProductoDesdeUrl();
        });

        observador.observe(document.body, { childList: true, subtree: true });

        let intentos = 0;
        const temporizador = setInterval(() => {
            intentos += 1;
            if (abrirProductoDesdeUrl() || intentos >= 120) clearInterval(temporizador);
        }, 500);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", iniciar, { once: true });
    } else {
        iniciar();
    }
})();
