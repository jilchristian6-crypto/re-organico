"use strict";

/* Re Orgánico: mantiene actualizado el carrusel principal desde CMS. */
(() => {
    const CONFIG = window.REORGANICO_SUPABASE;
    const INTERVALO = 5000;

    if (!CONFIG || !window.supabase?.createClient) return;

    const cliente = window.supabase.createClient(CONFIG.url, CONFIG.anonKey);
    let timerRotacion = null;
    let timerActualizacion = null;
    let indiceActual = 0;
    let itemsCmsActuales = [];
    let baseSlides = [];

    function escapar(texto) {
        return String(texto ?? "")
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");
    }

    function urlPublica(path) {
        if (!path) return "";
        return cliente.storage.from("galeria").getPublicUrl(path).data?.publicUrl || "";
    }

    async function cargar() {
        const { data, error } = await cliente
            .from("contenido_galeria")
            .select("id,tipo,titulo,descripcion,archivo_path,orden")
            .eq("destino", "carrusel")
            .eq("activo", true)
            .order("orden", { ascending: true })
            .order("created_at", { ascending: true });

        if (error || !Array.isArray(data)) {
            console.warn("No se pudo actualizar el carrusel:", error);
            return [];
        }

        return data;
    }

    function crearMedia(item) {
        const url = urlPublica(item.archivo_path);
        if (item.tipo === "video") {
            return `<video src="${escapar(url)}" controls muted playsinline preload="metadata" aria-label="${escapar(item.titulo || "Video")}" style="width:100%;height:100%;object-fit:cover;display:block;"></video>`;
        }
        return `<img src="${escapar(url)}" alt="${escapar(item.titulo || "Re Orgánico")}" loading="lazy" style="width:100%;height:100%;object-fit:cover;display:block;">`;
    }

    function obtenerBaseSlides(carrusel) {
        const pista = carrusel?.querySelector(".hero-carrusel-pista");
        if (!pista) return [];

        return [...pista.querySelectorAll(".hero-diapositiva")]
            .map((slide) => slide.innerHTML)
            .filter((html) => html.trim());
    }

    function detenerRotacion() {
        if (timerRotacion) {
            clearInterval(timerRotacion);
            timerRotacion = null;
        }
    }

    function renderizar(items, conservarIndice = true) {
        const carrusel = document.getElementById("hero-carrusel");
        if (!carrusel) return;

        const pista = carrusel.querySelector(".hero-carrusel-pista");
        const indicadores = carrusel.querySelector(".hero-carrusel-indicadores");
        if (!pista || !indicadores) return;

        const total = baseSlides.length + items.length;
        if (!total) return;

        const indiceAnterior = conservarIndice ? indiceActual : 0;
        indiceActual = Math.min(indiceAnterior, total - 1);

        const contenidos = [
            ...baseSlides.map((html) => ({ html, cmsId: "" })),
            ...items.map((item) => ({ html: crearMedia(item), cmsId: item.id }))
        ];

        pista.innerHTML = contenidos
            .map((item, i) => `
                <div class="hero-diapositiva ${i === indiceActual ? "activa" : ""}"
                     data-cms-hero-slide="${escapar(item.cmsId)}"
                     aria-hidden="${i === indiceActual ? "false" : "true"}">
                    ${item.html}
                </div>
            `)
            .join("");

        indicadores.innerHTML = contenidos
            .map((_, i) => `
                <button class="hero-carrusel-indicador" type="button"
                        data-cms-live-index="${i}"
                        aria-label="Ver foto ${i + 1}"
                        aria-current="${i === indiceActual ? "true" : "false"}"></button>
            `)
            .join("");

        const slides = [...pista.querySelectorAll(".hero-diapositiva")];
        const dots = [...indicadores.querySelectorAll("[data-cms-live-index]")];

        const mostrar = (indice) => {
            if (!slides.length) return;
            indiceActual = (indice + slides.length) % slides.length;
            slides.forEach((slide, i) => {
                slide.classList.toggle("activa", i === indiceActual);
                slide.setAttribute("aria-hidden", i === indiceActual ? "false" : "true");
            });
            dots.forEach((dot, i) => {
                dot.setAttribute("aria-current", i === indiceActual ? "true" : "false");
            });
        };

        dots.forEach((dot) => {
            dot.addEventListener("click", () => {
                mostrar(Number(dot.dataset.cmsLiveIndex));
                reiniciarRotacion(mostrar);
            });
        });

        const anterior = carrusel.querySelector("[data-hero-anterior]");
        const siguiente = carrusel.querySelector("[data-hero-siguiente]");

        anterior?.addEventListener("click", () => {
            mostrar(indiceActual - 1);
            reiniciarRotacion(mostrar);
        });

        siguiente?.addEventListener("click", () => {
            mostrar(indiceActual + 1);
            reiniciarRotacion(mostrar);
        });

        reiniciarRotacion(mostrar);
    }

    function reiniciarRotacion(mostrar) {
        detenerRotacion();
        const cantidad = document.querySelectorAll("#hero-carrusel .hero-carrusel-pista .hero-diapositiva").length;
        if (cantidad > 1) {
            timerRotacion = setInterval(() => mostrar(indiceActual + 1), 6500);
        }
    }

    async function actualizar() {
        const carrusel = document.getElementById("hero-carrusel");
        if (!carrusel) return;

        const nuevos = await cargar();
        const idsNuevos = nuevos.map((item) => String(item.id));
        const idsActuales = itemsCmsActuales.map((item) => String(item.id));
        const cambio = JSON.stringify(idsNuevos) !== JSON.stringify(idsActuales) ||
            nuevos.some((item, i) => item.archivo_path !== itemsCmsActuales[i]?.archivo_path || item.orden !== itemsCmsActuales[i]?.orden);

        if (!cambio) return;

        itemsCmsActuales = nuevos;
        renderizar(nuevos, true);
    }

    function iniciar() {
        const carrusel = document.getElementById("hero-carrusel");
        if (!carrusel) return;

        /* Este script se carga antes de cms-publico.js y guarda las diapositivas originales. */
        if (baseSlides.length === 0) baseSlides = obtenerBaseSlides(carrusel);

        setTimeout(async () => {
            const actual = await cargar();
            itemsCmsActuales = actual;
            renderizar(actual, false);

            if (timerActualizacion) clearInterval(timerActualizacion);
            timerActualizacion = setInterval(actualizar, INTERVALO);
        }, 300);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", iniciar, { once: true });
    } else {
        iniciar();
    }
})();
