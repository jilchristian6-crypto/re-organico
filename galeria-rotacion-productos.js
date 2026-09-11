"use strict";

(() => {
    const INTERVALO = 3500;
    const TRANSICION = 650;
    const temporizadores = new WeakMap();

    function rutasProducto(id) {
        const mapa = window.REORGANICO_IMAGENES_PRODUCTOS || {};
        const valor = mapa[id];
        if (!Array.isArray(valor) || valor.length < 2) return [];
        return valor.filter(Boolean);
    }

    function prepararTarjeta(tarjeta) {
        if (tarjeta.dataset.rotacionFotos === "true") return;

        const id = tarjeta.dataset.id;
        const rutas = rutasProducto(id);
        if (rutas.length < 2) return;

        const visual = tarjeta.querySelector(".producto-visual");
        if (!visual) return;

        const iniciar = () => {
            const imagen = visual.querySelector("img.producto-imagen, img.imagen-producto-escena");
            if (!imagen) return;

            tarjeta.dataset.rotacionFotos = "true";
            imagen.style.transition = `opacity ${TRANSICION}ms ease`;
            imagen.style.opacity = "1";
            imagen.dataset.rotacionProducto = "true";

            let indice = 0;
            const cambiar = () => {
                indice = (indice + 1) % rutas.length;
                imagen.style.opacity = "0.15";

                window.setTimeout(() => {
                    imagen.src = rutas[indice];
                    imagen.style.opacity = "1";
                }, TRANSICION / 2);
            };

            const temporizador = window.setInterval(cambiar, INTERVALO);
            temporizadores.set(tarjeta, temporizador);
        };

        iniciar();

        const espera = window.setInterval(() => {
            if (tarjeta.dataset.rotacionFotos === "true") {
                window.clearInterval(espera);
                return;
            }
            iniciar();
        }, 150);

        window.setTimeout(() => window.clearInterval(espera), 5000);
    }

    function aplicar() {
        document.querySelectorAll("article.producto[data-id]").forEach(prepararTarjeta);
    }

    function iniciar() {
        aplicar();
        const catalogo = document.getElementById("lista-productos");
        if (catalogo) {
            new MutationObserver(aplicar).observe(catalogo, { childList: true, subtree: true });
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", iniciar, { once: true });
    } else {
        iniciar();
    }
})();
