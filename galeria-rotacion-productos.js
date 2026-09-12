"use strict";

(() => {
    const INTERVALO = 3500;
    const TRANSICION = 650;
    const temporizadores = new WeakMap();
    const cacheGalerias = new Map();

    function clientePublico() {
        const config = window.REORGANICO_SUPABASE;
        if (!config || !window.supabase?.createClient) return null;
        if (!window.__REORGANICO_CLIENTE_ROTACION) {
            window.__REORGANICO_CLIENTE_ROTACION = window.supabase.createClient(
                config.url,
                config.anonKey
            );
        }
        return window.__REORGANICO_CLIENTE_ROTACION;
    }

    async function rutasProducto(id, imagenActual, intento = 0) {
        if (!id) return [];
        if (cacheGalerias.has(id)) return cacheGalerias.get(id);

        const cliente = clientePublico();
        if (!cliente) return [];

        const { data, error } = await cliente.storage
            .from("productos")
            .list(id, {
                limit: 100,
                sortBy: { column: "created_at", order: "asc" }
            });

        if (error) {
            if (intento < 2) {
                await new Promise((resolve) => window.setTimeout(resolve, 1000));
                return rutasProducto(id, imagenActual, intento + 1);
            }
            console.warn("No se pudo cargar la galeria del producto:", id, error);
            return [];
        }

        const rutas = (data || [])
            .filter((foto) => foto?.name && !foto.name.endsWith("/"))
            .map((foto) => cliente.storage
                .from("productos")
                .getPublicUrl(`${id}/${foto.name}`).data.publicUrl)
            .filter(Boolean);

        if (imagenActual && !rutas.includes(imagenActual)) {
            rutas.unshift(imagenActual);
        }

        const unicas = [...new Set(rutas)];
        cacheGalerias.set(id, unicas);
        return unicas;
    }

    async function prepararTarjeta(tarjeta) {
        if (tarjeta.dataset.rotacionFotos === "true" || tarjeta.dataset.rotacionFotos === "cargando") return;

        const id = tarjeta.dataset.id;
        const visual = tarjeta.querySelector(".producto-visual");
        const imagen = visual?.querySelector("img.producto-imagen, img.imagen-producto-escena");
        if (!id || !imagen) return;

        tarjeta.dataset.rotacionFotos = "cargando";

        try {
            const rutas = await rutasProducto(id, imagen.currentSrc || imagen.src);

            if (rutas.length < 2) {
                delete tarjeta.dataset.rotacionFotos;
                return;
            }

            tarjeta.dataset.rotacionFotos = "true";
            imagen.style.transition = `opacity ${TRANSICION}ms ease`;

            let indice = rutas.indexOf(imagen.currentSrc || imagen.src);
            if (indice < 0) indice = 0;

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
        } catch (error) {
            delete tarjeta.dataset.rotacionFotos;
            console.warn("Error iniciando rotacion del producto:", id, error);
        }
    }

    function aplicar() {
        document.querySelectorAll("article.producto[data-id]").forEach((tarjeta) => {
            prepararTarjeta(tarjeta);
        });
    }

    function iniciar() {
        aplicar();

        const catalogo = document.getElementById("lista-productos");
        if (catalogo) {
            new MutationObserver(aplicar).observe(catalogo, {
                childList: true,
                subtree: true
            });
        }

        // El catalogo se carga de forma asincrona; hacemos varios intentos
        // para asegurar que la rotacion se conecte aunque Supabase demore.
        let intentos = 0;
        const reintentar = window.setInterval(() => {
            aplicar();
            intentos += 1;
            if (intentos >= 30) window.clearInterval(reintentar);
        }, 1000);
    }

    function esperarDependencias() {
        if (window.REORGANICO_SUPABASE && window.supabase?.createClient) {
            iniciar();
            return;
        }

        window.setTimeout(esperarDependencias, 250);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", esperarDependencias, { once: true });
    } else {
        esperarDependencias();
    }
})();
