"use strict";

(function () {
    const CONFIG = window.REORGANICO_SUPABASE;
    if (!CONFIG || !window.supabase?.createClient) return;

    const cliente = window.supabase.createClient(CONFIG.url, CONFIG.anonKey);

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

    async function cargar(destino) {
        const { data, error } = await cliente
            .from("contenido_galeria")
            .select("id,tipo,titulo,descripcion,archivo_path,orden")
            .eq("destino", destino)
            .eq("activo", true)
            .order("orden", { ascending: true })
            .order("created_at", { ascending: true });
        if (error || !Array.isArray(data)) return [];
        return data;
    }

    function crearMedia(item, etiqueta) {
        const url = urlPublica(item.archivo_path);
        if (item.tipo === "video") {
            return `<video src="${escapar(url)}" controls muted playsinline preload="metadata" aria-label="${escapar(item.titulo)}" style="width:100%;height:100%;object-fit:cover;display:block;"></video>`;
        }
        return `<img src="${escapar(url)}" alt="${escapar(item.titulo)}" loading="lazy" style="width:100%;height:100%;object-fit:cover;display:block;">`;
    }

    function renderizarCarrusel(items) {
        const carrusel = document.getElementById("hero-carrusel");
        if (!carrusel || !items.length) return;
        const pista = carrusel.querySelector(".hero-carrusel-pista");
        const indicadores = carrusel.querySelector(".hero-carrusel-indicadores");
        if (!pista || !indicadores) return;

        const existentes = [...pista.querySelectorAll("[data-hero-diapositiva]")]
            .map((slide) => slide.innerHTML);

        const contenidos = [
            ...existentes.map((html) => ({ html, cms: false })),
            ...items.map((item) => ({ html: crearMedia(item, "Carrusel"), cms: true }))
        ];

        pista.innerHTML = contenidos.map((item, i) => `
            <div class="hero-diapositiva ${i === 0 ? "activa" : ""}" data-cms-hero-slide aria-hidden="${i === 0 ? "false" : "true"}">
                ${item.html}
            </div>
        `).join("");

        indicadores.innerHTML = contenidos.map((_, i) => `
            <button class="hero-carrusel-indicador" type="button" data-cms-hero-index="${i}" aria-label="Ver foto ${i + 1}" aria-current="${i === 0 ? "true" : "false"}"></button>
        `).join("");

        const slides = [...pista.querySelectorAll("[data-cms-hero-slide]")];
        const dots = [...indicadores.querySelectorAll("[data-cms-hero-index]")];
        let actual = 0;
        let timer = null;

        const mostrar = (indice) => {
            actual = (indice + slides.length) % slides.length;
            slides.forEach((slide, i) => {
                slide.classList.toggle("activa", i === actual);
                slide.setAttribute("aria-hidden", i === actual ? "false" : "true");
            });
            dots.forEach((dot, i) => dot.setAttribute("aria-current", i === actual ? "true" : "false"));
        };

        const reiniciar = () => {
            if (timer) clearInterval(timer);
            if (slides.length > 1) timer = setInterval(() => mostrar(actual + 1), 6500);
        };

        dots.forEach((dot) => dot.addEventListener("click", () => {
            mostrar(Number(dot.dataset.cmsHeroIndex));
            reiniciar();
        }));

        const anterior = carrusel.querySelector("[data-hero-anterior]");
        const siguiente = carrusel.querySelector("[data-hero-siguiente]");
        anterior?.addEventListener("click", () => { mostrar(actual - 1); reiniciar(); });
        siguiente?.addEventListener("click", () => { mostrar(actual + 1); reiniciar(); });
        reiniciar();
    }

    function renderizarBlog(items) {
        const contenedor = document.querySelector(".impacto-videos");
        if (!contenedor || !items.length) return;

        const nuevasPublicaciones = items.map((item) => {
            const media = crearMedia(item, "Blog");
            return `<article class="impacto-video revelar"><div class="impacto-video-marco">${media}<span>${item.tipo === "video" ? "Video" : "Artículo"}</span></div><div class="impacto-video-info"><h3>${escapar(item.titulo)}</h3><p>${escapar(item.descripcion || "")}</p></div></article>`;
        }).join("");

        contenedor.insertAdjacentHTML("beforeend", nuevasPublicaciones);
    }

    async function iniciar() {
        const [carrusel, blog] = await Promise.all([cargar("carrusel"), cargar("blog")]);
        renderizarCarrusel(carrusel);
        renderizarBlog(blog);
    }

    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", iniciar, { once: true });
    else iniciar();
})();
