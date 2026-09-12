"use strict";

/* Re Orgánico: carrusel principal administrado desde Supabase. */
(() => {
    const CONFIG = window.REORGANICO_SUPABASE;
    const INTERVALO_ACTUALIZACION = 5000;
    const INTERVALO_ROTACION = 6500;

    if (!CONFIG || !window.supabase?.createClient) return;

    const cliente = window.supabase.createClient(CONFIG.url, CONFIG.anonKey);
    let baseSlides = null;
    let itemsActuales = [];
    let indiceActual = 0;
    let timerRotacion = null;
    let timerActualizacion = null;
    let controlesInstalados = false;

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

    async function cargarCarrusel() {
        const { data, error } = await cliente
            .from("contenido_galeria")
            .select("id,tipo,titulo,descripcion,archivo_path,orden,created_at")
            .eq("destino", "carrusel")
            .eq("activo", true)
            .order("orden", { ascending: true })
            .order("created_at", { ascending: true });

        if (error) {
            console.warn("No se pudo cargar el carrusel principal:", error);
            return null;
        }

        return Array.isArray(data) ? data : [];
    }

    function crearMedia(item) {
        const url = urlPublica(item.archivo_path);
        if (!url) return "";

        if (item.tipo === "video") {
            return `<video src="${escapar(url)}" controls muted playsinline preload="metadata" aria-label="${escapar(item.titulo || "Video")}" style="width:100%;height:100%;object-fit:cover;display:block;"></video>`;
        }

        return `<img src="${escapar(url)}" alt="${escapar(item.titulo || "Re Orgánico")}" loading="lazy" decoding="async" style="width:100%;height:100%;object-fit:cover;display:block;">`;
    }

    function obtenerElementos() {
        const carrusel = document.getElementById("hero-carrusel");
        if (!carrusel) return null;

        return {
            carrusel,
            pista: carrusel.querySelector(".hero-carrusel-pista"),
            indicadores: carrusel.querySelector(".hero-carrusel-indicadores"),
            anterior: carrusel.querySelector("[data-hero-anterior]"),
            siguiente: carrusel.querySelector("[data-hero-siguiente]")
        };
    }

    function guardarSlidesBase(elementos) {
        if (baseSlides !== null || !elementos?.pista) return;

        baseSlides = [...elementos.pista.querySelectorAll(".hero-diapositiva")]
            .filter((slide) => !slide.hasAttribute("data-cms-hero-slide"))
            .map((slide) => slide.innerHTML)
            .filter((html) => html.trim());
    }

    function detenerRotacion() {
        if (timerRotacion) {
            clearInterval(timerRotacion);
            timerRotacion = null;
        }
    }

    function mostrar(indice) {
        const elementos = obtenerElementos();
        if (!elementos?.pista) return;

        const slides = [...elementos.pista.querySelectorAll(".hero-diapositiva")];
        const dots = elementos.indicadores
            ? [...elementos.indicadores.querySelectorAll("[data-cms-index]")]
            : [];

        if (!slides.length) return;

        indiceActual = (indice + slides.length) % slides.length;

        slides.forEach((slide, i) => {
            const activa = i === indiceActual;
            slide.classList.toggle("activa", activa);
            slide.setAttribute("aria-hidden", activa ? "false" : "true");
        });

        dots.forEach((dot, i) => {
            dot.setAttribute("aria-current", i === indiceActual ? "true" : "false");
        });
    }

    function reiniciarRotacion() {
        detenerRotacion();

        const elementos = obtenerElementos();
        const cantidad = elementos?.pista
            ? elementos.pista.querySelectorAll(".hero-diapositiva").length
            : 0;

        if (cantidad > 1) {
            timerRotacion = setInterval(() => {
                mostrar(indiceActual + 1);
            }, INTERVALO_ROTACION);
        }
    }

    function instalarControles() {
        if (controlesInstalados) return;

        const elementos = obtenerElementos();
        if (!elementos) return;

        controlesInstalados = true;

        elementos.anterior?.addEventListener("click", () => {
            mostrar(indiceActual - 1);
            reiniciarRotacion();
        });

        elementos.siguiente?.addEventListener("click", () => {
            mostrar(indiceActual + 1);
            reiniciarRotacion();
        });

        elementos.indicadores?.addEventListener("click", (evento) => {
            const boton = evento.target.closest("[data-cms-index]");
            if (!boton) return;

            mostrar(Number(boton.dataset.cmsIndex));
            reiniciarRotacion();
        });
    }

    function renderizar(items, conservarActual = true) {
        const elementos = obtenerElementos();
        if (!elementos?.pista || !elementos.indicadores) return;

        guardarSlidesBase(elementos);

        const total = (baseSlides?.length || 0) + items.length;
        if (!total) return;

        const indiceAnterior = conservarActual ? indiceActual : 0;
        indiceActual = Math.min(indiceAnterior, total - 1);

        const contenidos = [
            ...(baseSlides || []).map((html) => ({ html, id: "" })),
            ...items.map((item) => ({ html: crearMedia(item), id: String(item.id) }))
        ].filter((item) => item.html);

        indiceActual = Math.min(indiceActual, Math.max(0, contenidos.length - 1));

        elementos.pista.innerHTML = contenidos
            .map((item, i) => `
                <div class="hero-diapositiva ${i === indiceActual ? "activa" : ""}"
                     data-cms-hero-slide="${escapar(item.id)}"
                     aria-hidden="${i === indiceActual ? "false" : "true"}">
                    ${item.html}
                </div>
            `)
            .join("");

        elementos.indicadores.innerHTML = contenidos
            .map((_, i) => `
                <button class="hero-carrusel-indicador" type="button"
                        data-cms-index="${i}"
                        aria-label="Ver imagen ${i + 1}"
                        aria-current="${i === indiceActual ? "true" : "false"}"></button>
            `)
            .join("");

        instalarControles();
        mostrar(indiceActual);
        reiniciarRotacion();
    }

    function huboCambios(nuevos) {
        const anteriores = itemsActuales;
        if (anteriores.length !== nuevos.length) return true;

        return nuevos.some((item, indice) => {
            const anterior = anteriores[indice];
            return !anterior ||
                String(item.id) !== String(anterior.id) ||
                item.archivo_path !== anterior.archivo_path ||
                Number(item.orden) !== Number(anterior.orden) ||
                Boolean(item.activo) !== Boolean(anterior.activo);
        });
    }

    async function actualizar() {
        const nuevos = await cargarCarrusel();
        if (!nuevos) return;
        if (!huboCambios(nuevos)) return;

        itemsActuales = nuevos;
        renderizar(nuevos, true);
    }

    async function iniciar() {
        const elementos = obtenerElementos();
        if (!elementos) return;

        guardarSlidesBase(elementos);
        instalarControles();

        const iniciales = await cargarCarrusel();
        if (iniciales) {
            itemsActuales = iniciales;
            renderizar(iniciales, false);
        }

        if (timerActualizacion) clearInterval(timerActualizacion);
        timerActualizacion = setInterval(actualizar, INTERVALO_ACTUALIZACION);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", iniciar, { once: true });
    } else {
        iniciar();
    }
})();

/* Re Orgánico: publicaciones de Nuestro Blog administradas desde Supabase. */
(() => {
    const CONFIG = window.REORGANICO_SUPABASE;
    const INTERVALO_ACTUALIZACION_BLOG = 5000;

    if (!CONFIG || !window.supabase?.createClient) return;

    const cliente = window.supabase.createClient(CONFIG.url, CONFIG.anonKey);
    let publicacionesActuales = [];

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

    async function cargarBlog() {
        const { data, error } = await cliente
            .from("contenido_galeria")
            .select("id,tipo,titulo,descripcion,archivo_path,orden,created_at")
            .eq("destino", "blog")
            .eq("activo", true)
            .order("orden", { ascending: true })
            .order("created_at", { ascending: false });

        if (error) {
            console.warn("No se pudo cargar Nuestro Blog:", error);
            return null;
        }

        return Array.isArray(data) ? data : [];
    }

    function obtenerContenedor() {
        const seccion = document.getElementById("impacto");
        if (!seccion) return null;
        const contenedor = seccion.querySelector(".contenedor");
        if (!contenedor) return null;

        let publicaciones = document.getElementById("blog-publicaciones-cms");
        if (!publicaciones) {
            publicaciones = document.createElement("div");
            publicaciones.id = "blog-publicaciones-cms";
            publicaciones.setAttribute("aria-live", "polite");
            publicaciones.style.cssText = "display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:24px;margin-top:40px;";
            contenedor.appendChild(publicaciones);
        }
        return publicaciones;
    }

    function crearTarjeta(item) {
        const url = urlPublica(item.archivo_path);
        if (!url) return "";

        const titulo = escapar(item.titulo || "Publicación Re Orgánico");
        const descripcion = escapar(item.descripcion || "");
        const fecha = item.created_at
            ? new Intl.DateTimeFormat("es-CL", { day: "2-digit", month: "long", year: "numeric" }).format(new Date(item.created_at))
            : "";

        const media = item.tipo === "video"
            ? `<video src="${escapar(url)}" controls muted playsinline preload="metadata" style="width:100%;height:230px;object-fit:cover;display:block;"></video>`
            : `<img src="${escapar(url)}" alt="${titulo}" loading="lazy" decoding="async" style="width:100%;height:230px;object-fit:cover;display:block;">`;

        return `
            <article data-blog-cms-id="${escapar(item.id)}" style="overflow:hidden;border:1px solid rgba(31,77,58,.14);border-radius:22px;background:#fff;box-shadow:0 12px 30px rgba(31,77,58,.08);">
                ${media}
                <div style="padding:20px;">
                    <span style="display:inline-block;margin-bottom:9px;font-size:11px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#2c7c45;">${item.tipo === "video" ? "Video" : "Foto"}</span>
                    <h3 style="margin:0;color:#1f4d3a;font-size:22px;line-height:1.2;">${titulo}</h3>
                    ${descripcion ? `<p style="margin:12px 0 0;color:#626762;line-height:1.55;">${descripcion}</p>` : ""}
                    ${fecha ? `<small style="display:block;margin-top:15px;color:#858a85;">${fecha}</small>` : ""}
                </div>
            </article>
        `;
    }

    function huboCambios(nuevas) {
        if (nuevas.length !== publicacionesActuales.length) return true;
        return nuevas.some((item, i) => {
            const anterior = publicacionesActuales[i];
            return !anterior ||
                String(item.id) !== String(anterior.id) ||
                item.archivo_path !== anterior.archivo_path ||
                item.titulo !== anterior.titulo ||
                item.descripcion !== anterior.descripcion ||
                Number(item.orden) !== Number(anterior.orden) ||
                Boolean(item.activo) !== Boolean(anterior.activo);
        });
    }

    function renderizarBlog(items) {
        const contenedor = obtenerContenedor();
        if (!contenedor) return;

        contenedor.innerHTML = items.map(crearTarjeta).filter(Boolean).join("");
        contenedor.hidden = items.length === 0;
    }

    async function actualizarBlog() {
        const nuevas = await cargarBlog();
        if (!nuevas) return;
        if (!huboCambios(nuevas)) return;

        publicacionesActuales = nuevas;
        renderizarBlog(nuevas);
    }

    async function iniciarBlog() {
        const iniciales = await cargarBlog();
        if (iniciales) {
            publicacionesActuales = iniciales;
            renderizarBlog(iniciales);
        }

        setInterval(actualizarBlog, INTERVALO_ACTUALIZACION_BLOG);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", iniciarBlog, { once: true });
    } else {
        iniciarBlog();
    }
})();
