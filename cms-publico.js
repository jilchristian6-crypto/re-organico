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

/* Re Orgánico: compartir productos */
(() => {
    const PARAMETRO_PRODUCTO = "producto";
    const CLASE_BOTON = "boton-compartir-producto";
    const ID_MODAL = "modal-compartir-reorganico";

    function crearUrlProducto(id) {
        const url = new URL(window.location.href);
        url.searchParams.set(PARAMETRO_PRODUCTO, id);
        url.hash = "productos";
        return url.toString();
    }

    function obtenerNombreProducto(tarjeta) {
        const titulo = tarjeta.querySelector("h3, h2, .producto-nombre, [data-nombre]");
        return titulo?.textContent?.trim() || "Producto Re Orgánico";
    }

    function obtenerDatosDesdeBoton(boton) {
        const tarjeta = boton.closest("article.producto[data-id]");
        if (!tarjeta) return null;
        const id = tarjeta.dataset.id;
        if (!id) return null;
        return { id, nombre: obtenerNombreProducto(tarjeta), url: crearUrlProducto(id) };
    }

    function copiarTexto(texto) {
        if (navigator.clipboard?.writeText) return navigator.clipboard.writeText(texto);
        return new Promise((resolve, reject) => {
            const auxiliar = document.createElement("textarea");
            auxiliar.value = texto;
            auxiliar.style.position = "fixed";
            auxiliar.style.opacity = "0";
            document.body.appendChild(auxiliar);
            auxiliar.select();
            try {
                document.execCommand("copy");
                auxiliar.remove();
                resolve();
            } catch (error) {
                auxiliar.remove();
                reject(error);
            }
        });
    }

    function cerrarCompartir() {
        const modal = document.getElementById(ID_MODAL);
        if (!modal) return;
        modal.classList.remove("activo");
        modal.setAttribute("aria-hidden", "true");
        document.body.classList.remove("compartir-abierto");
    }

    function abrirCompartir(datos) {
        let modal = document.getElementById(ID_MODAL);
        if (!modal) {
            modal = document.createElement("div");
            modal.id = ID_MODAL;
            modal.className = "modal-compartir-producto";
            modal.setAttribute("aria-hidden", "true");
            modal.innerHTML = `
                <div class="compartir-fondo" data-cerrar-compartir></div>
                <div class="compartir-contenido" role="dialog" aria-modal="true" aria-labelledby="compartir-titulo">
                    <button class="compartir-cerrar" type="button" data-cerrar-compartir aria-label="Cerrar">×</button>
                    <span class="compartir-kicker">Compartir producto</span>
                    <h2 id="compartir-titulo"></h2>
                    <p class="compartir-url-texto"></p>
                    <div class="compartir-opciones">
                        <button type="button" data-compartir="whatsapp">WhatsApp</button>
                        <button type="button" data-compartir="facebook">Facebook</button>
                        <button type="button" data-compartir="instagram">Instagram</button>
                        <button type="button" data-compartir="x">X</button>
                        <button type="button" data-compartir="telegram">Telegram</button>
                        <button type="button" data-compartir="linkedin">LinkedIn</button>
                        <button type="button" data-compartir="email">Email</button>
                    </div>
                    <div class="compartir-finales">
                        <button class="compartir-copiar" type="button" data-compartir="copiar">⧉ Copiar enlace</button>
                        <button class="compartir-nativo" type="button" data-compartir="nativo">↗ Compartir del dispositivo</button>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);

            modal.addEventListener("click", (evento) => {
                const cerrar = evento.target.closest("[data-cerrar-compartir]");
                if (cerrar) cerrarCompartir();
            });

            modal.addEventListener("click", async (evento) => {
                const opcion = evento.target.closest("[data-compartir]");
                if (!opcion) return;

                const accion = opcion.dataset.compartir;
                const url = modal.dataset.url;
                const nombre = modal.dataset.nombre || "Producto Re Orgánico";
                const texto = `Mira este producto de Re Orgánico: ${nombre}`;
                let destino = "";

                if (accion === "whatsapp") destino = `https://wa.me/?text=${encodeURIComponent(`${texto}\n${url}`)}`;
                if (accion === "facebook") destino = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
                if (accion === "x") destino = `https://twitter.com/intent/tweet?text=${encodeURIComponent(texto)}&url=${encodeURIComponent(url)}`;
                if (accion === "telegram") destino = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(texto)}`;
                if (accion === "linkedin") destino = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
                if (accion === "email") destino = `mailto:?subject=${encodeURIComponent(`Producto Re Orgánico: ${nombre}`)}&body=${encodeURIComponent(`${texto}\n\n${url}`)}`;

                if (accion === "copiar" || accion === "instagram") {
                    try {
                        await copiarTexto(url);
                        opcion.textContent = accion === "instagram" ? "✓ Enlace copiado" : "✓ Enlace copiado";
                        if (accion === "instagram") window.open("https://www.instagram.com/", "_blank", "noopener,noreferrer");
                    } catch (error) {
                        opcion.textContent = "No se pudo copiar";
                    }
                    setTimeout(() => {
                        opcion.textContent = accion === "instagram" ? "Instagram" : "⧉ Copiar enlace";
                    }, 1800);
                    return;
                }

                if (accion === "nativo") {
                    if (navigator.share) {
                        try {
                            await navigator.share({ title: nombre, text: texto, url });
                        } catch (error) {
                            if (error?.name !== "AbortError") console.warn("No se pudo abrir el compartir nativo:", error);
                        }
                    } else {
                        try {
                            await copiarTexto(url);
                            mostrarAviso("Enlace copiado. Tu dispositivo no admite compartir nativo desde este navegador.");
                        } catch (error) {
                            mostrarAviso("No se pudo copiar el enlace.");
                        }
                    }
                    return;
                }

                if (destino) window.open(destino, "_blank", "noopener,noreferrer");
            });
        }

        modal.dataset.url = datos.url;
        modal.dataset.nombre = datos.nombre;
        modal.querySelector("#compartir-titulo").textContent = datos.nombre;
        modal.querySelector(".compartir-url-texto").textContent = datos.url;
        modal.classList.add("activo");
        modal.setAttribute("aria-hidden", "false");
        document.body.classList.add("compartir-abierto");
    }

    function mostrarAviso(mensaje) {
        const existente = document.querySelector(".aviso-compartir-reorganico");
        if (existente) existente.remove();
        const aviso = document.createElement("div");
        aviso.className = "aviso-compartir-reorganico";
        aviso.textContent = mensaje;
        document.body.appendChild(aviso);
        setTimeout(() => aviso.remove(), 2800);
    }

    function agregarBotonesCompartir() {
        document.querySelectorAll("article.producto[data-id]").forEach((tarjeta) => {
            tarjeta.querySelectorAll(".enlace-producto-directo").forEach((enlace) => enlace.remove());
            if (tarjeta.querySelector(`.${CLASE_BOTON}`)) return;

            const acciones = tarjeta.querySelector(".producto-acciones") || tarjeta;
            const boton = document.createElement("button");
            boton.type = "button";
            boton.className = CLASE_BOTON;
            boton.textContent = "↗ Compartir";
            boton.setAttribute("aria-label", `Compartir ${obtenerNombreProducto(tarjeta)}`);
            boton.addEventListener("click", () => {
                const datos = obtenerDatosDesdeBoton(boton);
                if (datos) abrirCompartir(datos);
            });
            acciones.appendChild(boton);
        });
    }

    const estilo = document.createElement("style");
    estilo.textContent = `
        .boton-compartir-producto {
            display:inline-flex;
            align-items:center;
            justify-content:center;
            gap:6px;
            margin-top:8px;
            padding:9px 13px;
            border:1px solid #6f9b73;
            border-radius:999px;
            background:#f3f8f1;
            color:#2f6840;
            font-size:13px;
            font-weight:800;
            line-height:1.1;
            cursor:pointer;
            transition:.2s ease;
        }
        .boton-compartir-producto:hover,
        .boton-compartir-producto:focus-visible {
            background:#e5f0e3;
            color:#235331;
            transform:translateY(-1px);
        }
        .modal-compartir-producto {
            position:fixed;
            inset:0;
            z-index:99999;
            display:none;
        }
        .modal-compartir-producto.activo { display:block; }
        .compartir-fondo {
            position:absolute;
            inset:0;
            background:rgba(16,35,23,.62);
            backdrop-filter:blur(3px);
        }
        .compartir-contenido {
            position:relative;
            width:min(94vw,520px);
            margin:8vh auto 0;
            padding:28px;
            border-radius:22px;
            background:#fff;
            box-shadow:0 24px 70px rgba(0,0,0,.25);
        }
        .compartir-cerrar {
            position:absolute;
            top:12px;
            right:14px;
            width:38px;
            height:38px;
            border:0;
            border-radius:50%;
            background:#edf4ed;
            color:#205b38;
            font-size:25px;
            cursor:pointer;
        }
        .compartir-kicker { color:#438052; font-size:12px; font-weight:900; text-transform:uppercase; letter-spacing:.08em; }
        .compartir-contenido h2 { margin:7px 42px 8px 0; color:#173c27; font-size:22px; line-height:1.2; }
        .compartir-url-texto { margin:0 0 18px; color:#69756d; font-size:12px; word-break:break-all; }
        .compartir-opciones { display:grid; grid-template-columns:repeat(2,1fr); gap:9px; }
        .compartir-opciones button,
        .compartir-finales button {
            min-height:44px;
            border:1px solid #d7e3d8;
            border-radius:12px;
            background:#f7faf7;
            color:#205b38;
            font-weight:800;
            cursor:pointer;
            padding:10px 12px;
        }
        .compartir-opciones button:hover,
        .compartir-finales button:hover { background:#e9f2e9; }
        .compartir-finales { display:grid; grid-template-columns:1fr 1fr; gap:9px; margin-top:10px; }
        .compartir-copiar { background:#195b38 !important; color:#fff !important; border-color:#195b38 !important; }
        .compartir-nativo { background:#eef6ee !important; }
        .aviso-compartir-reorganico {
            position:fixed;
            left:50%;
            bottom:24px;
            transform:translateX(-50%);
            z-index:100000;
            max-width:90vw;
            padding:12px 16px;
            border-radius:12px;
            background:#173c27;
            color:#fff;
            font-weight:700;
            box-shadow:0 12px 30px rgba(0,0,0,.2);
        }
        body.compartir-abierto { overflow:hidden; }
        @media (max-width:600px) {
            .compartir-contenido { margin:4vh auto 0; padding:24px 18px; }
            .compartir-opciones { grid-template-columns:1fr 1fr; }
            .compartir-finales { grid-template-columns:1fr; }
        }
    `;
    document.head.appendChild(estilo);

    const iniciar = () => {
        agregarBotonesCompartir();
        const catalogo = document.getElementById("lista-productos");
        if (catalogo) new MutationObserver(agregarBotonesCompartir).observe(catalogo, { childList:true, subtree:true });

        document.addEventListener("keydown", (evento) => {
            if (evento.key === "Escape") cerrarCompartir();
        });
    };

    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", iniciar, { once:true });
    else iniciar();
})();
