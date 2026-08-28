from pathlib import Path
import re

# Ocultar acceso administrador del menú público
p = Path('index.html')
s = p.read_text(encoding='utf-8')
s = re.sub(r'\s*<a\b[^>]*href=["\'][^"\']*admin[^"\']*["\'][^>]*>.*?Acceso Administrador.*?</a>', '', s, flags=re.I|re.S)
p.write_text(s, encoding='utf-8')

# Ajustes del catálogo público
p = Path('script.js')
s = p.read_text(encoding='utf-8')
marker = '/* AJUSTES CATALOGO 2026-08-28 */'
if marker not in s:
    s += r'''

/* AJUSTES CATALOGO 2026-08-28 */
(function () {
    "use strict";

    const PRODUCTO_OCULTO = /Vaso\s+Papel\s+Blanco\s*\+\s*PLA[\s\S]*?(?:16\s*Oz|470\s*Cc)/i;
    const TEXTO_REPETIDO = /(?:^|\s)(?:1\s*(?:Pack|Caja|Rollo)\s*:.*?Precio\s+Por|Cantidad\s+De\s+(?:Packs|Cajas|Rollos))/i;

    function limpiar() {
        document.querySelectorAll('article, .producto, .producto-card, .tarjeta-producto, .product-card, [data-producto-id], [data-id-producto]').forEach((el) => {
            const texto = (el.textContent || '').replace(/\s+/g, ' ').trim();
            if (PRODUCTO_OCULTO.test(texto)) el.remove();
        });

        const modal = document.querySelector('#modal-producto');
        if (modal) {
            modal.querySelectorAll('p, div, span, strong').forEach((el) => {
                if (el.children.length) return;
                const texto = (el.textContent || '').replace(/\s+/g, ' ').trim();
                if (TEXTO_REPETIDO.test(texto)) el.style.display = 'none';
            });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', limpiar, { once: true });
    } else {
        limpiar();
    }

    new MutationObserver(limpiar).observe(document.documentElement, { childList: true, subtree: true });
})();
'''
p.write_text(s, encoding='utf-8')
