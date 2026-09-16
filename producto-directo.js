"use strict";

/* Re Orgánico: abre el producto indicado por ?producto=ID incluso si el catálogo carga después. */
(() => {
    const PARAMETRO = "producto";
    let productoAbierto = null;

    function obtenerIdProducto() {
        try {
            return new URL(window.location.href).searchParams.get(PARAMETRO);
        } catch (error) {
            return null;
        }
    }

    function encontrarBoton(id) {
        if (!id) return null;

        const botones = document.querySelectorAll('[data-accion="detalle"][data-id]');
        let encontrado = null;

        botones.forEach((boton) => {
            if (!encontrado && boton.dataset.id === id) {
                encontrado = boton;
            }
        });

        return encontrado;
    }

    function abrirProductoDesdeUrl() {
        const id = obtenerIdProducto();

        if (!id || id === productoAbierto) return false;

        const boton = encontrarBoton(id);
        if (!boton) return false;

        productoAbierto = id;
        boton.click();

        setTimeout(() => {
            const modal = document.getElementById("modal-producto");
            if (modal) {
                modal.scrollIntoView({ behavior: "smooth", block: "center" });
            }
        }, 200);

        return true;
    }

    function iniciar() {
        abrirProductoDesdeUrl();

        const observador = new MutationObserver(() => {
            abrirProductoDesdeUrl();
        });

        observador.observe(document.body, {
            childList: true,
            subtree: true
        });

        let intentos = 0;
        const temporizador = setInterval(() => {
            intentos += 1;

            if (abrirProductoDesdeUrl() || intentos >= 60) {
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
