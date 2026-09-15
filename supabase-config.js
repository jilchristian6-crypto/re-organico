"use strict";

// Credenciales de Supabase
window.REORGANICO_SUPABASE = {
    url: "https://bkhpkiwbwdzlnjysdzqw.supabase.co",
    anonKey: "sb_publishable_LdpztMzZKei1nBtx36dHVg_OgzsWtcr"
};

/* REORGANICO_YOUTUBE_FLOTANTE */
(() => {
    const YOUTUBE_URL = "https://www.youtube.com/@reorganico9949";
    function instalarYouTube() {
        const contenedor = document.querySelector(".contenedor-flotantes");
        if (!contenedor || document.getElementById("youtube-flotante")) return;
        const boton = document.createElement("a");
        boton.id = "youtube-flotante";
        boton.href = YOUTUBE_URL;
        boton.target = "_blank";
        boton.rel = "noopener noreferrer";
        boton.className = "boton-red-social btn-youtube";
        boton.setAttribute("aria-label", "Visitar YouTube de Re Orgánico");
        boton.title = "YouTube Re Orgánico";
        boton.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.6 15.8V8.2l6.5 3.8-6.5 3.8Z" fill="currentColor"/></svg>`;
        contenedor.appendChild(boton);
    }
    const estilo = document.createElement("style");
    estilo.textContent = `
      #youtube-flotante{display:flex!important;align-items:center!important;justify-content:center!important;text-decoration:none!important;padding:0!important;background:#ff0000!important;border:3px solid #fff!important;box-shadow:0 8px 24px rgba(0,0,0,.22)!important;color:#fff!important;transition:transform .2s ease!important}
      #youtube-flotante svg{width:34px!important;height:34px!important;display:block!important}
      #youtube-flotante:hover{transform:translateY(-2px) scale(1.04)!important}
      @media(max-width:700px){#youtube-flotante svg{width:30px!important;height:30px!important}}
    `;
    document.head.appendChild(estilo);
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", instalarYouTube, { once: true });
    else instalarYouTube();
})();

/* Re Orgánico: enlaces directos por producto y opción de compartir */
(() => {
    const PARAMETRO_PRODUCTO = "producto";
    const CLASE_ENLACE = "enlace-producto-directo";
    let ultimoProductoAbierto = null;

    function obtenerIdDesdeUrl() {
        try {
            return new URL(window.location.href).searchParams.get(PARAMETRO_PRODUCTO);
        } catch (error) {
            return null;
        }
    }

    function crearUrlProducto(id) {
        const url = new URL(window.location.href);
        url.searchParams.set(PARAMETRO_PRODUCTO, id);
        url.hash = "productos";
        return url.toString();
    }

    function agregarEnlacesProducto() {
        document.querySelectorAll("article.producto[data-id]").forEach((tarjeta) => {
            const id = tarjeta.dataset.id;
            if (!id || tarjeta.querySelector(`.${CLASE_ENLACE}`)) return;

            const enlace = document.createElement("a");
            enlace.className = CLASE_ENLACE;
            enlace.href = crearUrlProducto(id);
            enlace.textContent = "🔗 Link de Producto";
            enlace.setAttribute("aria-label", "Abrir producto y obtener su enlace directo");

            const acciones = tarjeta.querySelector(".producto-acciones") || tarjeta;
            acciones.append(enlace);
        });
    }

    function abrirProductoDesdeUrl() {
        const id = obtenerIdDesdeUrl();
        if (!id || id === ultimoProductoAbierto) return;

        const boton = document.querySelector(`[data-accion="detalle"][data-id="${CSS.escape(id)}"]`);
        if (!boton) return;

        ultimoProductoAbierto = id;
        boton.click();
        setTimeout(() => {
            const modal = document.getElementById("modal-producto");
            if (modal) modal.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 100);
    }

    function actualizarUrlAlAbrirProducto() {
        document.addEventListener("click", (evento) => {
            const boton = evento.target.closest('[data-accion="detalle"][data-id]');
            if (!boton) return;
            const id = boton.dataset.id;
            if (!id) return;
            const url = new URL(window.location.href);
            url.searchParams.set(PARAMETRO_PRODUCTO, id);
            history.replaceState({ producto: id }, "", url.toString());
            ultimoProductoAbierto = id;
        }, true);
    }

    function activarCopia() {
        document.querySelectorAll(`.${CLASE_ENLACE}`).forEach((enlace) => {
            if (enlace.dataset.copiaActivada === '1') return;
            enlace.dataset.copiaActivada = '1';
            enlace.addEventListener('click', async (evento) => {
                evento.preventDefault();
                const url = enlace.href;
                const textoOriginal = '🔗 Link de Producto';
                try {
                    await navigator.clipboard.writeText(url);
                    enlace.textContent = '✓ Link copiado';
                } catch (error) {
                    const auxiliar = document.createElement('textarea');
                    auxiliar.value = url;
                    auxiliar.style.position = 'fixed';
                    auxiliar.style.opacity = '0';
                    document.body.appendChild(auxiliar);
                    auxiliar.select();
                    document.execCommand('copy');
                    auxiliar.remove();
                    enlace.textContent = '✓ Link copiado';
                }
                setTimeout(() => {
                    enlace.textContent = textoOriginal;
                }, 1800);
            });
        });
    }

    function iniciarEnlacesProducto() {
        const catalogo = document.getElementById("lista-productos");
        if (!catalogo) return;

        const observer = new MutationObserver(() => {
            agregarEnlacesProducto();
            activarCopia();
            abrirProductoDesdeUrl();
        });
        observer.observe(catalogo, { childList: true, subtree: true });

        agregarEnlacesProducto();
        activarCopia();
        abrirProductoDesdeUrl();
        actualizarUrlAlAbrirProducto();
    }

    const estilo = document.createElement("style");
    estilo.textContent = `
        .producto-acciones {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            align-items: center;
        }
        .enlace-producto-directo {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
            width: 100%;
            margin-top: 6px;
            padding: 9px 13px;
            border: 1px solid #6f9b73;
            border-radius: 999px;
            background: #f3f8f1;
            color: #2f6840;
            font-size: 13px;
            font-weight: 800;
            line-height: 1.1;
            text-decoration: none;
            cursor: pointer;
            transition: .2s ease;
        }
        .enlace-producto-directo:hover,
        .enlace-producto-directo:focus-visible {
            background: #e5f0e3;
            color: #235331;
            transform: translateY(-1px);
        }
    `;
    document.head.append(estilo);

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", iniciarEnlacesProducto, { once: true });
    } else {
        iniciarEnlacesProducto();
    }
})();

/* Re Orgánico: enlace visible y copiable dentro del modal de detalle */
(() => {
    const PARAMETRO = 'producto';
    const MARCADOR = 'enlace-compartible-producto';

    function urlProducto(id) {
        const url = new URL(window.location.href);
        url.searchParams.set(PARAMETRO, id);
        url.hash = 'productos';
        return url.toString();
    }

    function obtenerId() {
        try {
            return new URL(window.location.href).searchParams.get(PARAMETRO);
        } catch (e) {
            return null;
        }
    }

    function agregarEnlaceVisible() {
        const modal = document.getElementById('modal-producto') || document.querySelector('.modal.activo, #modal-producto.activo');
        if (!modal || modal.querySelector('.' + MARCADOR)) return;
        const id = obtenerId();
        if (!id) return;

        const contenedor = modal.querySelector('.modal-producto-contenido, .modal-contenido, .contenido-modal') || modal.querySelector('.modal-informacion') || modal;
        const caja = document.createElement('div');
        caja.className = MARCADOR;
        caja.innerHTML = `
            <div class="titulo-enlace-producto">🔗 Enlace de este producto</div>
            <div class="fila-enlace-producto">
                <input type="text" readonly value="${urlProducto(id).replace(/&/g, '&amp;').replace(/"/g, '&quot;')}" aria-label="Enlace directo del producto">
                <button type="button" data-copiar-producto="1">Copiar enlace</button>
            </div>
            <div class="texto-enlace-producto">Puedes copiar este enlace y enviárselo directamente a un cliente.</div>
        `;
        contenedor.appendChild(caja);

        const copiar = caja.querySelector('[data-copiar-producto="1"]');
        copiar.addEventListener('click', async () => {
            const input = caja.querySelector('input');
            try { await navigator.clipboard.writeText(input.value); }
            catch (e) { input.select(); document.execCommand('copy'); }
            copiar.textContent = '✓ Enlace copiado';
            setTimeout(() => copiar.textContent = 'Copiar enlace', 1800);
        });
    }

    const estilo = document.createElement('style');
    estilo.textContent = `
        .enlace-compartible-producto { margin:20px 0 8px; padding:14px; border:1px solid #d8e4da; border-radius:14px; background:#f5f9f5; }
        .titulo-enlace-producto { margin-bottom:9px; color:#165b38; font-weight:800; font-size:14px; }
        .fila-enlace-producto { display:flex; gap:8px; }
        .fila-enlace-producto input { min-width:0; flex:1; padding:10px 11px; border:1px solid #d5dcd7; border-radius:9px; background:#fff; color:#555; font-size:12px; }
        .fila-enlace-producto button { padding:10px 13px; border:0; border-radius:9px; background:#195b38; color:#fff; font-weight:800; cursor:pointer; white-space:nowrap; }
        .texto-enlace-producto { margin-top:7px; color:#68736c; font-size:12px; }
        @media (max-width:600px) { .fila-enlace-producto { flex-direction:column; } }
    `;
    document.head.appendChild(estilo);
    new MutationObserver(agregarEnlaceVisible).observe(document.body, {childList:true, subtree:true});
    agregarEnlaceVisible();
})();

/* Re Orgánico: Estilos forzados en runtime para ordenar el Blog CMS */
(() => {
    const ID_ESTILO = "estilo-forzado-blog-cms";
    if (document.getElementById(ID_ESTILO)) return;

    const estilo = document.createElement("style");
    estilo.id = ID_ESTILO;
    estilo.textContent = `
      #blog-publicaciones-cms {
        display: grid !important;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)) !important;
        gap: 28px !important;
        margin: 40px auto 0 !important;
        width: 100% !important;
        max-width: 1200px !important;
        box-sizing: border-box !important;
      }
      #blog-publicaciones-cms article[data-blog-cms-id] {
        display: flex !important;
        flex-direction: column !important;
        height: 100% !important;
        background: #ffffff !important;
        border: 1px solid rgba(255, 255, 255, 0.2) !important;
        border-radius: 20px !important;
        overflow: hidden !important;
        box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15) !important;
        transition: transform 0.25s ease, box-shadow 0.25s ease !important;
      }
      #blog-publicaciones-cms article[data-blog-cms-id]:hover {
        transform: translateY(-4px) !important;
        box-shadow: 0 18px 36px rgba(0, 0, 0, 0.22) !important;
      }
      #blog-publicaciones-cms article[data-blog-cms-id] img,
      #blog-publicaciones-cms article[data-blog-cms-id] video {
        width: 100% !important;
        height: 230px !important;
        min-height: 230px !important;
        max-height: 230px !important;
        object-fit: cover !important;
        object-position: center !important;
        display: block !important;
      }
      #blog-publicaciones-cms article[data-blog-cms-id] > div {
        display: flex !important;
        flex-direction: column !important;
        flex: 1 1 auto !important;
        padding: 22px !important;
        box-sizing: border-box !important;
      }
      #blog-publicaciones-cms article[data-blog-cms-id] span {
        font-size: 11px !important;
        font-weight: 800 !important;
        color: #2c7c45 !important;
        text-transform: uppercase !important;
        letter-spacing: .08em !important;
        margin-bottom: 8px !important;
      }
      #blog-publicaciones-cms article[data-blog-cms-id] h3 {
        color: #1f4d3a !important;
        font-size: 20px !important;
        line-height: 1.25 !important;
        margin: 0 0 10px 0 !important;
      }
      #blog-publicaciones-cms article[data-blog-cms-id] p {
        color: #55625b !important;
        font-size: 14px !important;
        line-height: 1.55 !important;
        margin: 0 !important;
      }
      #blog-publicaciones-cms article[data-blog-cms-id] small {
        margin-top: auto !important;
        padding-top: 14px !important;
        color: #858a85 !important;
        border-top: 1px solid #eef3ee !important;
        display: block !important;
      }
      @media (max-width: 640px) {
        #blog-publicaciones-cms {
          grid-template-columns: 1fr !important;
        }
      }
    `;
    document.head.appendChild(estilo);
})();

/* REORGANICO_SHARE_VERSION_V2 */
(() => {
    "use strict";
    const CONFIG = window.REORGANICO_SUPABASE;
    if (!CONFIG?.url || !CONFIG?.anonKey) return;
    const API = `${CONFIG.url}/rest/v1/productos`;
    const HEADERS = { apikey: CONFIG.anonKey, Authorization: `Bearer ${CONFIG.anonKey}` };
    const BASE = "https://reorganico.cl/";
    const cache = new Map();
    const version = (v) => {
        const n = Date.parse(v || "");
        return Number.isFinite(n) ? String(n) : String(Date.now());
    };
    async function getVersion(id) {
        if (!id) return null;
        if (cache.has(id)) return cache.get(id);
        try {
            const r = await fetch(`${API}?select=id,updated_at&id=eq.${encodeURIComponent(id)}`, { headers: HEADERS, cache: "no-store" });
            if (!r.ok) return null;
            const row = (await r.json())[0] || null;
            if (row) cache.set(id, row);
            return row;
        } catch (_) { return null; }
    }
    async function setLink(link, id) {
        const row = await getVersion(id);
        if (!row) return;
        const u = new URL(BASE);
        u.searchParams.set("producto", id);
        u.searchParams.set("v", version(row.updated_at));
        link.href = u.toString();
        link.dataset.shareVersion = version(row.updated_at);
    }
    function process() {
        document.querySelectorAll("article.producto[data-id]").forEach(card => {
            const id = card.dataset.id;
            const link = card.querySelector(".enlace-producto-directo");
            if (link && id) setLink(link, id);
        });
        document.querySelectorAll(".enlace-compartible-producto input").forEach(input => {
            const id = new URLSearchParams(location.search).get("producto");
            if (id) getVersion(id).then(row => {
                if (!row) return;
                const u = new URL(BASE);
                u.searchParams.set("producto", id);
                u.searchParams.set("v", version(row.updated_at));
                input.value = u.toString();
            });
        });
    }
    const start = () => {
        process();
        new MutationObserver(process).observe(document.body, { childList: true, subtree: true });
    };
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start, { once: true });
    else start();
})();
