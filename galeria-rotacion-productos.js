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

    function esperar(ms) {
        return new Promise((resolve) => window.setTimeout(resolve, ms));
    }

    async function rutasProducto(id, imagenActual) {
        if (!id) return [];
        if (cacheGalerias.has(id)) return cacheGalerias.get(id);

        const cliente = clientePublico();
        if (!cliente) return imagenActual ? [imagenActual] : [];

        let data = null;
        let error = null;

        for (let intento = 0; intento < 3; intento++) {
            const resultado = await cliente.storage
                .from("productos")
                .list(id, {
                    limit: 100,
                    sortBy: { column: "name", order: "asc" }
                });

            data = resultado.data;
            error = resultado.error;

            if (!error) break;
            await esperar(500);
        }

        if (error) {
            console.warn("No se pudo cargar la galeria del producto:", id, error);
            return imagenActual ? [imagenActual] : [];
        }

        const rutas = (data || [])
            .filter((foto) => foto?.name)
            .map((foto) => cliente.storage.from("productos").getPublicUrl(`${id}/${foto.name}`).data.publicUrl)
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
        const rutas = await rutasProducto(id, imagen.src);

        if (rutas.length < 2) {
            delete tarjeta.dataset.rotacionFotos;
            return;
        }

        tarjeta.dataset.rotacionFotos = "true";
        imagen.style.transition = `opacity ${TRANSICION}ms ease`;
        let indice = Math.max(0, rutas.indexOf(imagen.src));

        const cambiar = () => {
            indice = (indice + 1) % rutas.length;
            imagen.style.opacity = "0.15";
            window.setTimeout(() => {
                if (!document.body.contains(tarjeta)) return;
                imagen.src = rutas[indice];
                imagen.style.opacity = "1";
            }, TRANSICION / 2);
        };

        const temporizador = window.setInterval(cambiar, INTERVALO);
        temporizadores.set(tarjeta, temporizador);
    }

    function aplicar() {
        document.querySelectorAll("article.producto[data-id]").forEach((tarjeta) => {
            prepararTarjeta(tarjeta);
        });
    }

    function iniciar() {
        aplicar();

        // Observamos todo el documento porque los productos se crean
        // despues de cargar la pagina mediante Supabase.
        const observador = new MutationObserver(() => {
            aplicar();
        });

        observador.observe(document.body, {
            childList: true,
            subtree: true
        });

        // Reintentos para cubrir la carga asincrona del catalogo.
        window.setTimeout(aplicar, 500);
        window.setTimeout(aplicar, 1500);
        window.setTimeout(aplicar, 3000);
        window.setTimeout(aplicar, 5000);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", iniciar, { once: true });
    } else {
        iniciar();
    }
})();
