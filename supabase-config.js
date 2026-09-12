"use strict";

window.REORGANICO_SUPABASE = {
    url: "https://bkhpkiwbwdzlnjysdzqw.supabase.co",
    anonKey: "sb_publishable_LdpztMzZKei1nBtx36dHVg_OgzsWtcr"
};
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
        .enlace-producto-directo {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
            margin-top: 8px;
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
        const modal = document.getElementById('modal-producto');
        if (!modal || modal.querySelector('.' + MARCADOR)) return;
        const id = obtenerId();
        if (!id) return;

        const botonCerrar = modal.querySelector('[data-accion="cerrar-modal"], .cerrar-modal, button[aria-label*="errar"]');
        const contenedor = modal.querySelector('.modal-producto-contenido, .contenido-modal, .modal-contenido') || modal;
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
        if (botonCerrar && botonCerrar.parentElement) botonCerrar.parentElement.insertBefore(caja, botonCerrar);
        else contenedor.appendChild(caja);

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