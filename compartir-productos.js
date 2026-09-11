"use strict";

(() => {
    const CLASE_BOTON = "boton-compartir-producto";

    function urlProducto(id) {
        const url = new URL(window.location.href);
        url.searchParams.set("producto", id);
        url.hash = "productos";
        return url.toString();
    }

    function nombreProducto(tarjeta) {
        return tarjeta?.querySelector("h3, h2, .producto-nombre, [data-nombre]")?.textContent?.trim() || "Producto Re Orgánico";
    }

    function cerrar(modal) {
        modal?.remove();
        document.body.style.overflow = "";
    }

    function compartir(id, tarjeta) {
        const enlace = urlProducto(id);
        const nombre = nombreProducto(tarjeta);
        const texto = `Mira este producto de Re Orgánico: ${nombre}`;
        const u = encodeURIComponent(enlace);
        const t = encodeURIComponent(texto);

        let modal = document.getElementById("modal-compartir-reorganico");
        if (!modal) {
            modal = document.createElement("div");
            modal.id = "modal-compartir-reorganico";
            modal.innerHTML = `
                <div class="compartir-reorganico-caja" role="dialog" aria-modal="true" aria-labelledby="compartir-reorganico-titulo">
                    <button type="button" class="compartir-reorganico-cerrar" aria-label="Cerrar">×</button>
                    <h3 id="compartir-reorganico-titulo">Compartir producto</h3>
                    <p class="compartir-reorganico-nombre"></p>
                    <div class="compartir-reorganico-redes">
                        <a data-red="whatsapp" target="_blank" rel="noopener">WhatsApp</a>
                        <a data-red="facebook" target="_blank" rel="noopener">Facebook</a>
                        <a data-red="instagram" target="_blank" rel="noopener">Instagram</a>
                        <a data-red="x" target="_blank" rel="noopener">X</a>
                        <a data-red="telegram" target="_blank" rel="noopener">Telegram</a>
                        <a data-red="linkedin" target="_blank" rel="noopener">LinkedIn</a>
                        <a data-red="email">Email</a>
                    </div>
                    <div class="compartir-reorganico-link">
                        <input type="text" readonly aria-label="Enlace del producto">
                        <button type="button" class="compartir-reorganico-copiar">Copiar link</button>
                    </div>
                    <button type="button" class="compartir-reorganico-nativo" hidden>Compartir desde el teléfono</button>
                </div>`;
            document.body.append(modal);

            modal.querySelector(".compartir-reorganico-cerrar").addEventListener("click", () => cerrar(modal));
            modal.addEventListener("click", (evento) => {
                if (evento.target === modal) cerrar(modal);
            });
            modal.querySelector(".compartir-reorganico-copiar").addEventListener("click", async () => {
                const input = modal.querySelector("input");
                try {
                    await navigator.clipboard.writeText(input.value);
                } catch (error) {
                    input.select();
                    document.execCommand("copy");
                }
                modal.querySelector(".compartir-reorganico-copiar").textContent = "¡Copiado!";
                setTimeout(() => {
                    if (document.body.contains(modal)) modal.querySelector(".compartir-reorganico-copiar").textContent = "Copiar link";
                }, 1500);
            });
            modal.querySelector('[data-red="instagram"]').addEventListener("click", async () => {
                try { await navigator.clipboard.writeText(enlace); } catch (error) {}
            });
            modal.querySelector(".compartir-reorganico-nativo").addEventListener("click", async () => {
                if (!navigator.share) return;
                try { await navigator.share({ title: nombre, text: texto, url: enlace }); } catch (error) {}
            });
        }

        modal.querySelector(".compartir-reorganico-nombre").textContent = nombre;
        modal.querySelector("input").value = enlace;
        modal.querySelector('[data-red="whatsapp"]').href = `https://wa.me/?text=${t}%20${u}`;
        modal.querySelector('[data-red="facebook"]').href = `https://www.facebook.com/sharer/sharer.php?u=${u}`;
        modal.querySelector('[data-red="instagram"]').href = "https://www.instagram.com/";
        modal.querySelector('[data-red="x"]').href = `https://twitter.com/intent/tweet?url=${u}&text=${t}`;
        modal.querySelector('[data-red="telegram"]').href = `https://t.me/share/url?url=${u}&text=${t}`;
        modal.querySelector('[data-red="linkedin"]').href = `https://www.linkedin.com/sharing/share-offsite/?url=${u}`;
        modal.querySelector('[data-red="email"]').href = `mailto:?subject=${encodeURIComponent(nombre)}&body=${t}%20${u}`;

        const nativo = modal.querySelector(".compartir-reorganico-nativo");
        nativo.hidden = !navigator.share;
        modal.style.display = "flex";
        document.body.style.overflow = "hidden";
    }

    function instalarBotones() {
        document.querySelectorAll("article.producto[data-id]").forEach((tarjeta) => {
            const id = tarjeta.dataset.id;
            if (!id || tarjeta.querySelector(`.${CLASE_BOTON}`)) return;

            const anterior = tarjeta.querySelector(".enlace-producto-directo");
            const boton = document.createElement("button");
            boton.type = "button";
            boton.className = CLASE_BOTON;
            boton.textContent = "↗ Compartir";
            boton.setAttribute("aria-label", `Compartir ${nombreProducto(tarjeta)}`);
            boton.addEventListener("click", () => compartir(id, tarjeta));

            if (anterior) anterior.replaceWith(boton);
            else (tarjeta.querySelector(".producto-acciones") || tarjeta).append(boton);
        });
    }

    function estilos() {
        if (document.getElementById("estilos-compartir-reorganico")) return;
        const style = document.createElement("style");
        style.id = "estilos-compartir-reorganico";
        style.textContent = `
          .boton-compartir-producto{display:inline-flex;align-items:center;justify-content:center;gap:7px;margin-top:8px;padding:9px 15px;border:1px solid #6f9b73;border-radius:999px;background:#f3f8f1;color:#2f6840;font-size:13px;font-weight:800;line-height:1.1;cursor:pointer;transition:.2s ease}
          .boton-compartir-producto:hover,.boton-compartir-producto:focus-visible{background:#e5f0e3;color:#235331;transform:translateY(-1px)}
          #modal-compartir-reorganico{position:fixed;inset:0;z-index:100000;display:none;align-items:center;justify-content:center;padding:18px;background:rgba(12,28,20,.52);backdrop-filter:blur(3px)}
          .compartir-reorganico-caja{position:relative;width:min(760px,100%);padding:25px;border-radius:24px;background:#fff;box-shadow:0 24px 70px rgba(0,0,0,.28);color:#26352d}
          .compartir-reorganico-caja h3{margin:0;color:#1f4d3a;font-size:24px}.compartir-reorganico-nombre{margin:7px 0 20px;color:#647068}
          .compartir-reorganico-cerrar{position:absolute;top:12px;right:16px;border:0;background:transparent;color:#66736b;font-size:32px;line-height:1;cursor:pointer}
          .compartir-reorganico-redes{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px}.compartir-reorganico-redes a{display:flex;align-items:center;justify-content:center;min-height:48px;padding:10px;border:1px solid #d8e4d6;border-radius:14px;background:#f5f9f4;color:#245f3c;text-decoration:none;font-weight:800;cursor:pointer}.compartir-reorganico-redes a:hover{background:#e7f2e5}
          .compartir-reorganico-link{display:flex;gap:10px;margin-top:18px}.compartir-reorganico-link input{min-width:0;flex:1;padding:12px 14px;border:1px solid #d7dfd9;border-radius:12px;background:#f8faf8;color:#53615a}.compartir-reorganico-copiar,.compartir-reorganico-nativo{border:0;border-radius:12px;padding:12px 18px;background:#1f4d3a;color:#fff;font-weight:800;cursor:pointer}.compartir-reorganico-nativo{width:100%;margin-top:12px}
          @media(max-width:600px){.compartir-reorganico-caja{align-self:flex-end;width:100%;padding:22px 16px;border-radius:22px 22px 0 0}.compartir-reorganico-redes{grid-template-columns:repeat(2,minmax(0,1fr))}.compartir-reorganico-link{flex-direction:column}.compartir-reorganico-copiar{width:100%}}
        `;
        document.head.append(style);
    }

    function iniciar() {
        estilos();
        instalarBotones();
        const catalogo = document.getElementById("lista-productos");
        if (catalogo) new MutationObserver(instalarBotones).observe(catalogo, { childList: true, subtree: true });
        document.addEventListener("keydown", (evento) => {
            if (evento.key === "Escape") cerrar(document.getElementById("modal-compartir-reorganico"));
        });
    }

    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", iniciar, { once: true });
    else iniciar();
})();
