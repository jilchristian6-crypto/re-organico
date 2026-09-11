"use strict";
(() => {
    function aplicar() {
        const acciones = document.getElementById("guardar-producto")?.closest(".acciones-formulario");
        const galeria = document.getElementById("gpa");
        if (acciones && galeria && !document.getElementById("boton-gestionar-fotos")) {
            const boton = document.createElement("button");
            boton.id = "boton-gestionar-fotos";
            boton.type = "button";
            boton.className = "boton-fotos-admin";
            boton.textContent = "📸 Gestionar fotos del producto";
            boton.addEventListener("click", () => galeria.scrollIntoView({ behavior: "smooth", block: "center" }));
            acciones.insertBefore(boton, acciones.firstChild);
        }
        document.querySelectorAll('#lista-admin [data-accion="foto"][data-id]').forEach((boton) => {
            boton.textContent = "📸 Gestionar fotos";
            boton.classList.add("boton-fotos-admin-listado");
        });
    }
    function iniciar() {
        aplicar();
        const panel = document.getElementById("vista-panel");
        if (panel) new MutationObserver(aplicar).observe(panel, { childList: true, subtree: true });
        window.setInterval(aplicar, 700);
    }
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", iniciar, { once: true });
    else iniciar();
})();
