"use strict";

window.REORGANICO_SUPABASE = {
    url: "https://bkhpkiwbwdzlnjysdzqw.supabase.co",
    anonKey: "sb_publishable_LdpztMzZKei1nBtx36dHVg_OgzsWtcr"
};

window.REORGANICO_IMAGENES_PRODUCTOS = {
    "pulpa-fast-food-251x162-ydb0030": "img/productos/contenedor-pulpa-comida.webp",
    "cuchara-pla-15-1vp222": "img/productos/cuchara-pla-15cm.webp",
    "cucharita-helado-pla-10-5-1vp226": "img/productos/cucharita-helado-10-5cm.webp",
    "vermicompostera-4-niveles": [
        "img/productos/vermicompostera/vermicompostera-4-niveles-01.webp",
        "img/productos/vermicompostera/vermicompostera-4-niveles-02.webp",
        "img/productos/vermicompostera/vermicompostera-4-niveles-03.webp",
        "img/productos/vermicompostera/vermicompostera-4-niveles-04.webp"
    ]
};

(() => {
    const imagenes = window.REORGANICO_IMAGENES_PRODUCTOS;
    let productoModalId = "";

    function obtenerRutas(id) {
        const valor = imagenes[id];
        if (!valor) return [];
        return Array.isArray(valor) ? valor : [valor];
    }

    function crearImagen(ruta, modal = false) {
        const imagen = document.createElement("img");
        imagen.src = ruta;
        imagen.className = modal
            ? "modal-producto-imagen imagen-producto-escena"
            : "producto-imagen imagen-producto-escena";
        imagen.loading = modal ? "eager" : "lazy";
        imagen.decoding = "async";
        return imagen;
    }

    function aplicarImagenTarjeta(tarjeta) {
        const id = tarjeta.dataset.id;
        const [rutaPrincipal] = obtenerRutas(id);
        if (!rutaPrincipal) return;

        const visual = tarjeta.querySelector(".producto-visual");
        if (!visual || visual.querySelector(`img[src="${rutaPrincipal}"]`)) return;

        visual.querySelectorAll(".producto-imagen, .producto-emoji").forEach((elemento) => elemento.remove());
        const imagen = crearImagen(rutaPrincipal);
        imagen.alt = tarjeta.querySelector("h3")?.textContent || "Producto compostable";
        visual.append(imagen);
    }

    function aplicarImagenesCatalogo() {
        document.querySelectorAll("article.producto[data-id]").forEach(aplicarImagenTarjeta);
    }

    function crearGaleriaModal(id, rutas) {
        const galeria = document.createElement("div");
        galeria.className = "galeria-producto-local";
        galeria.dataset.productoId = id;

        const imagenPrincipal = crearImagen(rutas[0], true);
        imagenPrincipal.classList.add("galeria-producto-principal");
        imagenPrincipal.alt = document.getElementById("modal-producto-titulo")?.textContent || "Vermicompostera Re Orgánico";
        galeria.append(imagenPrincipal);

        if (rutas.length > 1) {
            const miniaturas = document.createElement("div");
            miniaturas.className = "galeria-producto-miniaturas";
            miniaturas.setAttribute("aria-label", "Fotos del producto");

            rutas.forEach((ruta, indice) => {
                const boton = document.createElement("button");
                boton.type = "button";
                boton.className = `galeria-producto-miniatura${indice === 0 ? " activa" : ""}`;
                boton.setAttribute("aria-label", `Ver foto ${indice + 1} del producto`);

                const miniatura = document.createElement("img");
                miniatura.src = ruta;
                miniatura.alt = "";
                miniatura.loading = "lazy";
                boton.append(miniatura);

                boton.addEventListener("click", () => {
                    imagenPrincipal.src = ruta;
                    miniaturas.querySelectorAll("button").forEach((item) => item.classList.toggle("activa", item === boton));
                });

                miniaturas.append(boton);
            });

            galeria.append(miniaturas);
        }

        return galeria;
    }

    function aplicarImagenModal() {
        const rutas = obtenerRutas(productoModalId);
        if (rutas.length === 0) return;

        const visual = document.getElementById("modal-producto-visual");
        if (!visual || visual.querySelector(`[data-producto-id="${productoModalId}"]`)) return;

        if (rutas.length === 1) {
            const imagen = crearImagen(rutas[0], true);
            imagen.dataset.productoId = productoModalId;
            imagen.alt = document.getElementById("modal-producto-titulo")?.textContent || "Producto compostable";
            visual.replaceChildren(imagen);
            return;
        }

        visual.replaceChildren(crearGaleriaModal(productoModalId, rutas));
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

            #modal-producto-visual .galeria-producto-local {
                display: grid;
                grid-template-rows: minmax(0, 1fr) auto;
                width: 100%;
                height: 535px;
                min-width: 0;
                background: #eef5e9;
            }

            #modal-producto-visual .galeria-producto-principal {
                width: 100%;
                height: 100%;
                min-height: 0;
                object-fit: contain;
                background: #eef5e9;
            }

            .galeria-producto-miniaturas {
                display: grid;
                grid-template-columns: repeat(4, minmax(0, 1fr));
                gap: 8px;
                padding: 10px;
                background: rgba(255, 255, 255, 0.96);
            }

            .galeria-producto-miniatura {
                height: 68px;
                padding: 0;
                overflow: hidden;
                border: 2px solid transparent;
                border-radius: 10px;
                background: #e8eee5;
                cursor: pointer;
            }

            .galeria-producto-miniatura.activa {
                border-color: #4f7b55;
                box-shadow: 0 0 0 2px rgba(79, 123, 85, 0.2);
            }

            .galeria-producto-miniatura img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }

            @media (max-width: 780px) {
                #modal-producto-visual .galeria-producto-local {
                    height: 390px;
                }

                .galeria-producto-miniatura {
                    height: 56px;
                }
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
