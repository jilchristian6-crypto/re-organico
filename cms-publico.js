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
        if (error || !Array.isArray(data) || data.length === 0) return [];
        return data;
    }

    function renderizarCarrusel(items) {
        const carrusel = document.getElementById("hero-carrusel");
        if (!carrusel || !items.length) return;
        const pista = carrusel.querySelector(".hero-carrusel-pista");
        const indicadores = carrusel.querySelector(".hero-carrusel-indicadores");
        if (!pista || !indicadores) return;

        pista.innerHTML = items.map((item, i) => {
            const url = urlPublica(item.archivo_path);
            const media = item.tipo === "video"
                ? `<video src="${escapar(url)}" controls muted playsinline preload="metadata" aria-label="${escapar(item.titulo)}"></video>`
                : `<img src="${escapar(url)}" alt="${escapar(item.titulo)}" loading="${i === 0 ? "eager" : "lazy"}">`;
            return `<div class="hero-diapositiva ${i === 0 ? "activa" : ""}" data-cms-hero-slide aria-hidden="${i === 0 ? "false" : "true"}">${media}</div>`;
        }).join("");

        indicadores.innerHTML = items.map((item, i) => `<button class="hero-carrusel-indicador" type="button" data-cms-hero-index="${i}" aria-label="Ver contenido ${i + 1}" aria-current="${i === 0 ? "true" : "false"}"></button>`).join("");

        const slides = [...pista.querySelectorAll("[data-cms-hero-slide]")];
        const dots = [...indicadores.querySelectorAll("[data-cms-hero-index]")];
        let actual = 0;
        let timer = null;
        const mostrar = (indice) => {
            actual = (indice + slides.length) % slides.length;
            slides.forEach((slide, i) => { slide.classList.toggle("activa", i === actual); slide.setAttribute("aria-hidden", i === actual ? "false" : "true"); });
            dots.forEach((dot, i) => dot.setAttribute("aria-current", i === actual ? "true" : "false"));
        };
        const avanzar = () => mostrar(actual + 1);
        dots.forEach((dot) => dot.addEventListener("click", () => { mostrar(Number(dot.dataset.cmsHeroIndex)); reiniciar(); }));
        const anterior = carrusel.querySelector("[data-hero-anterior]");
        const siguiente = carrusel.querySelector("[data-hero-siguiente]");
        anterior?.addEventListener("click", () => { mostrar(actual - 1); reiniciar(); });
        siguiente?.addEventListener("click", () => { mostrar(actual + 1); reiniciar(); });
        function reiniciar() { if (timer) clearInterval(timer); if (slides.length > 1) timer = setInterval(avanzar, 6500); }
        reiniciar();
    }

    function renderizarBlog(items) {
        const contenedor = document.querySelector(".impacto-videos");
        if (!contenedor || !items.length) return;
        contenedor.innerHTML = items.map((item) => {
            const url = urlPublica(item.archivo_path);
            const media = item.tipo === "video"
                ? `<video src="${escapar(url)}" controls preload="metadata" playsinline aria-label="${escapar(item.titulo)}"></video>`
                : `<img src="${escapar(url)}" alt="${escapar(item.titulo)}" loading="lazy">`;
            return `<article class="impacto-video revelar"><div class="impacto-video-marco">${media}<span>${item.tipo === "video" ? "Video" : "Artículo"}</span></div><div class="impacto-video-info"><h3>${escapar(item.titulo)}</h3><p>${escapar(item.descripcion || "")}</p></div></article>`;
        }).join("");
    }

    async function iniciar() {
        const [carrusel, blog] = await Promise.all([cargar("carrusel"), cargar("blog")]);
        renderizarCarrusel(carrusel);
        renderizarBlog(blog);
    }

    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", iniciar, { once: true });
    else iniciar();
})();
