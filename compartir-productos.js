/* Re Orgánico: enlaces de producto con vista previa dinámica para compartir */
(() => {
    const CLASE_ENLACE = "enlace-producto-directo";
    const PARAMETRO = "producto";
    const RUTA_COMPARTIR = "/producto/";

    function obtenerIdDesdeUrl(url) {
        try {
            return new URL(url, window.location.origin).searchParams.get(PARAMETRO);
        } catch (error) {
            return null;
        }
    }

    function crearUrlCompartir(id) {
        return new URL(`${RUTA_COMPARTIR}${encodeURIComponent(id)}`, window.location.origin).toString();
    }

    function actualizarEnlaces() {
        document.querySelectorAll(`.${CLASE_ENLACE}`).forEach((enlace) => {
            const id = enlace.dataset.productoId || obtenerIdDesdeUrl(enlace.href);
            if (!id) return;

            enlace.dataset.productoId = id;
            enlace.href = crearUrlCompartir(id);
        });

        document.querySelectorAll(".enlace-compartible-producto input[readonly]").forEach((input) => {
            const id = obtenerIdDesdeUrl(input.value);
            if (!id) return;
            input.value = crearUrlCompartir(id);
        });
    }

    function iniciar() {
        actualizarEnlaces();

        const observer = new MutationObserver(() => {
            actualizarEnlaces();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", iniciar, { once: true });
    } else {
        iniciar();
    }
})();
