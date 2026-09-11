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
        const existentes = [...pista.querySelectorAll("[data-hero-diapositiva]")].map((slide) => slide.innerHTML);
        const contenidos = [...existentes.map((html) => ({ html, cms: false })), ...items.map((item) => ({ html: crearMedia(item, "Carrusel"), cms: true }))];
        pista.innerHTML = contenidos.map((item, i) => `<div class="hero-diapositiva ${i === 0 ? "activa" : ""}" data-cms-hero-slide aria-hidden="${i === 0 ? "false" : "true"}">${item.html}</div>`).join("");
        indicadores.innerHTML = contenidos.map((_, i) => `<button class="hero-carrusel-indicador" type="button" data-cms-hero-index="${i}" aria-label="Ver foto ${i + 1}" aria-current="${i === 0 ? "true" : "false"}"></button>`).join("");
        const slides = [...pista.querySelectorAll("[data-cms-hero-slide]")];
        const dots = [...indicadores.querySelectorAll("[data-cms-hero-index]")];
        let actual = 0; let timer = null;
        const mostrar = (indice) => { actual = (indice + slides.length) % slides.length; slides.forEach((slide, i) => { slide.classList.toggle("activa", i === actual); slide.setAttribute("aria-hidden", i === actual ? "false" : "true"); }); dots.forEach((dot, i) => dot.setAttribute("aria-current", i === actual ? "true" : "false")); };
        const reiniciar = () => { if (timer) clearInterval(timer); if (slides.length > 1) timer = setInterval(() => mostrar(actual + 1), 6500); };
        dots.forEach((dot) => dot.addEventListener("click", () => { mostrar(Number(dot.dataset.cmsHeroIndex)); reiniciar(); }));
        const anterior = carrusel.querySelector("[data-hero-anterior]"); const siguiente = carrusel.querySelector("[data-hero-siguiente]");
        anterior?.addEventListener("click", () => { mostrar(actual - 1); reiniciar(); }); siguiente?.addEventListener("click", () => { mostrar(actual + 1); reiniciar(); }); reiniciar();
    }

    function renderizarBlog(items) {
        const contenedor = document.querySelector(".impacto-videos");
        if (!contenedor || !items.length) return;
        const nuevasPublicaciones = items.map((item) => { const media = crearMedia(item, "Blog"); return `<article class="impacto-video revelar"><div class="impacto-video-marco">${media}<span>${item.tipo === "video" ? "Video" : "Artículo"}</span></div><div class="impacto-video-info"><h3>${escapar(item.titulo)}</h3><p>${escapar(item.descripcion || "")}</p></div></article>`; }).join("");
        contenedor.insertAdjacentHTML("beforeend", nuevasPublicaciones);
    }

    async function iniciar() { const [carrusel, blog] = await Promise.all([cargar("carrusel"), cargar("blog")]); renderizarCarrusel(carrusel); renderizarBlog(blog); }
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", iniciar, { once: true }); else iniciar();
})();

/* RE ORGÁNICO: compartir productos en la misma página */
(() => {
    const BOTON = "boton-compartir-producto";
    const URL_PRODUCTO = (id) => { const url = new URL(window.location.href); url.searchParams.set("producto", id); url.hash = "productos"; return url.toString(); };
    const NOMBRE = (tarjeta) => tarjeta?.querySelector("h3,h2,.producto-nombre,[data-nombre]")?.textContent?.trim() || "Producto Re Orgánico";

    function copiar(texto) {
        if (navigator.clipboard?.writeText) return navigator.clipboard.writeText(texto);
        const aux = document.createElement("textarea"); aux.value = texto; document.body.append(aux); aux.select(); document.execCommand("copy"); aux.remove(); return Promise.resolve();
    }

    function abrirCompartir(id, tarjeta) {
        const url = URL_PRODUCTO(id);
        const nombre = NOMBRE(tarjeta);
        let modal = document.getElementById("modal-compartir-reorganico");
        if (!modal) {
            modal = document.createElement("div");
            modal.id = "modal-compartir-reorganico";
            modal.innerHTML = `<div class="compartir-caja" role="dialog" aria-modal="true" aria-labelledby="titulo-compartir-reorganico"><button class="compartir-cerrar" type="button" aria-label="Cerrar">×</button><span>Compartir producto</span><h2 id="titulo-compartir-reorganico"></h2><div class="compartir-opciones"><button type="button" data-red="whatsapp">WhatsApp</button><button type="button" data-red="facebook">Facebook</button><button type="button" data-red="instagram">Instagram</button><button type="button" data-red="x">X</button><button type="button" data-red="telegram">Telegram</button><button type="button" data-red="linkedin">LinkedIn</button><button type="button" data-red="email">Email</button><button type="button" data-red="copiar">⧉ Copiar enlace</button></div><button class="compartir-nativo" type="button" data-red="nativo">↗ Compartir del dispositivo</button></div>`;
            document.body.append(modal);
            modal.querySelector(".compartir-cerrar").onclick = cerrar;
            modal.addEventListener("click", async (e) => {
                if (e.target === modal) { cerrar(); return; }
                const boton = e.target.closest("[data-red]");
                const accion = boton?.dataset.red;
                if (!accion) return;
                const enlace = modal.dataset.url;
                const nombreActual = modal.dataset.nombre || "Producto Re Orgánico";
                const texto = `Mira este producto de Re Orgánico: ${nombreActual}`;
                const u = encodeURIComponent(enlace);
                const t = encodeURIComponent(texto);

                try {
                    if (accion === "copiar") {
                        await copiar(enlace);
                        boton.textContent = "✓ Enlace copiado";
                        setTimeout(() => boton.textContent = "⧉ Copiar enlace", 1600);
                        return;
                    }
                    if (accion === "instagram") {
                        await copiar(enlace);
                        window.open("https://www.instagram.com/", "_blank", "noopener,noreferrer");
                        boton.textContent = "✓ Enlace copiado";
                        setTimeout(() => boton.textContent = "Instagram", 1600);
                        return;
                    }
                    if (accion === "nativo") {
                        if (navigator.share) {
                            await navigator.share({ title: nombreActual, text: texto, url: enlace });
                        } else {
                            await copiar(enlace);
                            alert("Tu navegador no tiene compartir nativo. El enlace fue copiado.");
                        }
                        return;
                    }
                    const destinos = {
                        whatsapp: `https://wa.me/?text=${encodeURIComponent(`${texto}\n${enlace}`)}`,
                        facebook: `https://www.facebook.com/sharer/sharer.php?u=${u}`,
                        x: `https://twitter.com/intent/tweet?text=${t}&url=${u}`,
                        telegram: `https://t.me/share/url?url=${u}&text=${t}`,
                        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${u}`,
                        email: `mailto:?subject=${encodeURIComponent(nombreActual)}&body=${encodeURIComponent(`${texto}\n\n${enlace}`)}`
                    };
                    if (destinos[accion]) window.open(destinos[accion], "_blank", "noopener,noreferrer");
                } catch (error) {
                    if (error?.name !== "AbortError") console.error("Error al compartir producto:", error);
                }
            });
        }

        modal.dataset.url = url;
        modal.dataset.nombre = nombre;
        modal.querySelector("h2").textContent = nombre;
        modal.classList.add("activo");
        document.body.style.overflow = "hidden";
    }

    function cerrar() {
        const modal = document.getElementById("modal-compartir-reorganico");
        if (!modal) return;
        modal.classList.remove("activo");
        document.body.style.overflow = "";
    }

    function instalar() {
        document.querySelectorAll("article.producto[data-id]").forEach((tarjeta) => {
            const id = tarjeta.dataset.id;
            if (!id || tarjeta.querySelector(`.${BOTON}`)) return;
            const boton = document.createElement("button");
            boton.type = "button";
            boton.className = BOTON;
            boton.textContent = "↗ Compartir";
            boton.setAttribute("aria-label", `Compartir ${NOMBRE(tarjeta)}`);
            boton.addEventListener("click", (e) => { e.preventDefault(); e.stopPropagation(); abrirCompartir(id, tarjeta); });
            (tarjeta.querySelector(".producto-acciones") || tarjeta).append(boton);
        });
    }

    const estilo = document.createElement("style");
    estilo.textContent = `.boton-compartir-producto{display:inline-flex;align-items:center;justify-content:center;gap:6px;margin-top:8px;padding:9px 13px;border:1px solid #6f9b73;border-radius:999px;background:#f3f8f1;color:#2f6840;font-size:13px;font-weight:800;cursor:pointer}.boton-compartir-producto:hover{background:#e5f0e3}.boton-compartir-producto:focus-visible{outline:3px solid rgba(47,104,64,.28);outline-offset:2px}.modal-compartir-reorganico{position:fixed;inset:0;z-index:99999;display:none;align-items:flex-start;justify-content:center;padding:8vh 16px;background:rgba(14,35,23,.58);box-sizing:border-box;overflow:auto}.modal-compartir-reorganico.activo{display:flex}.compartir-caja{position:relative;width:min(94vw,520px);padding:28px;border-radius:22px;background:#fff;box-shadow:0 24px 70px rgba(0,0,0,.25);box-sizing:border-box}.compartir-cerrar{position:absolute;top:12px;right:14px;width:38px;height:38px;border:0;border-radius:50%;background:#edf4ed;color:#205b38;font-size:25px;cursor:pointer}.compartir-caja span{color:#438052;font-size:12px;font-weight:900;text-transform:uppercase}.compartir-caja h2{margin:7px 42px 18px 0;color:#173c27;font-size:22px}.compartir-opciones{display:grid;grid-template-columns:repeat(2,1fr);gap:9px}.compartir-opciones button,.compartir-nativo{min-height:44px;border:1px solid #d7e3d8;border-radius:12px;background:#f7faf7;color:#205b38;font-weight:800;cursor:pointer;padding:10px 12px}.compartir-opciones button:hover,.compartir-nativo:hover{background:#e9f2e9}.compartir-nativo{width:100%;margin-top:10px}@media(max-width:600px){.modal-compartir-reorganico{padding:4vh 10px}.compartir-caja{width:100%;padding:24px 18px}.compartir-opciones{grid-template-columns:1fr 1fr}}`;
    document.head.append(estilo);
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", instalar, { once: true }); else instalar();
    const catalogo = document.getElementById("lista-productos");
    if (catalogo) new MutationObserver(instalar).observe(catalogo, { childList:true, subtree:true });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") cerrar(); });
})();
