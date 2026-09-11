"use strict";
(() => {
    function iniciar() {
        const lista = document.getElementById("lista-admin");
        if (!lista || lista.dataset.galeriaEnlaceListo === "1") return;

        lista.dataset.galeriaEnlaceListo = "1";
        lista.addEventListener("click", (evento) => {
            const boton = evento.target.closest('[data-accion="galeria"][data-id]');
            if (!boton) return;

            evento.preventDefault();
            evento.stopPropagation();

            const id = boton.dataset.id;
            const selector = document.getElementById("gpa-producto");
            const gestor = document.getElementById("gpa-manager");

            if (!id || !selector || !gestor) {
                console.warn("El gestor de fotos todavía no está disponible.");
                return;
            }

            selector.value = id;
            selector.dispatchEvent(new Event("change", { bubbles: true }));
            gestor.scrollIntoView({ behavior: "smooth", block: "center" });
        });
    }

    function esperarGestor() {
        iniciar();
        if (!document.getElementById("lista-admin") || !document.getElementById("gpa-manager")) {
            window.setTimeout(esperarGestor, 500);
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", esperarGestor, { once: true });
    } else {
        esperarGestor();
    }
})();
