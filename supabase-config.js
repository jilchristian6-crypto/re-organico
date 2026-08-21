"use strict";

window.REORGANICO_SUPABASE = {
    url: "https://bkhpkiwbwdzlnjysdzqw.supabase.co",
    anonKey: "sb_publishable_LdpztMzZKei1nBtx36dHVg_OgzsWtcr"
};

window.REORGANICO_IMAGENES_PRODUCTOS = {
    "pulpa-fast-food-251x162-ydb0030": "img/productos/contenedor-pulpa-comida.webp",
    "cuchara-pla-15-1vp222": "img/productos/cuchara-pla-15cm.webp",
    "cucharita-helado-pla-10-5-1vp226": "img/productos/cucharita-helado-10-5cm.webp"
};

(() => {
    const imagenes = window.REORGANICO_IMAGENES_PRODUCTOS;
    let productoModalId = "";

    function crearImagen(id, modal = false) {
        const imagen = document.createElement("img");
        imagen.src = imagenes[id];
        imagen.className = modal
            ? "modal-producto-imagen imagen-producto-escena"
            : "producto-imagen imagen-producto-escena";
        imagen.loading = modal ? "eager" : "lazy";
        imagen.decoding = "async";
        return imagen;
    }

    function aplicarImagenTarjeta(tarjeta) {
        const id = tarjeta.dataset.id;
        if (!imagenes[id]) return;

        const visual = tarjeta.querySelector(".producto-visual");
        if (!visual || visual.querySelector(`img[src="${imagenes[id]}"]`)) return;

        visual.querySelectorAll(".producto-imagen, .producto-emoji").forEach((elemento) => elemento.remove());
        const imagen = crearImagen(id);
        imagen.alt = tarjeta.querySelector("h3")?.textContent || "Producto compostable";
        visual.append(imagen);
    }

    function aplicarImagenesCatalogo() {
        document.querySelectorAll("article.producto[data-id]").forEach(aplicarImagenTarjeta);
    }

    function aplicarImagenModal() {
        if (!imagenes[productoModalId]) return;

        const visual = document.getElementById("modal-producto-visual");
        if (!visual || visual.querySelector(`img[src="${imagenes[productoModalId]}"]`)) return;

        const imagen = crearImagen(productoModalId, true);
        imagen.alt = document.getElementById("modal-producto-titulo")?.textContent || "Producto compostable";
        visual.replaceChildren(imagen);
    }

    function iniciarImagenesProductos() {
        const catalogo = document.getElementById("lista-productos");
        const modal = document.getElementById("modal-producto-visual");

        if (catalogo) {
            new MutationObserver(aplicarImagenesCatalogo).observe(catalogo, { childList: true, subtree: true });
            aplicarImagenesCatalogo();
        }

        if (modal) {
            new MutationObserver(aplicarImagenModal).observe(modal, { childList: true });
        }

        document.addEventListener("click", (evento) => {
            const boton = evento.target.closest('[data-accion="detalle"][data-id]');
            if (!boton) return;
            productoModalId = boton.dataset.id;
            setTimeout(aplicarImagenModal, 0);
        }, true);

        const estilo = document.createElement("style");
        estilo.textContent = `
            .producto-visual .imagen-producto-escena {
                position: absolute;
                inset: 0;
                width: 100%;
                height: 100%;
                padding: 0;
                object-fit: cover;
                filter: none;
            }

            #modal-producto-visual .imagen-producto-escena {
                width: 100%;
                height: 535px;
                padding: 0;
                object-fit: cover;
                filter: none;
            }
        `;
        document.head.append(estilo);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", iniciarImagenesProductos, { once: true });
    } else {
        iniciarImagenesProductos();
    }
})();
