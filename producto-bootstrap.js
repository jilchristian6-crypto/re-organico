(async function () {
  try {
    const ruta = new URL(window.location.href);
    const partes = ruta.pathname.split('/').filter(Boolean);
    const indiceProducto = partes.findIndex((parte) => parte.toLowerCase() === 'producto');
    const idProducto = indiceProducto !== -1 && partes[indiceProducto + 1]
      ? decodeURIComponent(partes[indiceProducto + 1]).trim()
      : ruta.searchParams.get('producto');

    const respuesta = await fetch('/index.html?directo=' + Date.now(), {
      cache: 'no-store',
      credentials: 'same-origin'
    });
    if (!respuesta.ok) throw new Error('No se pudo cargar index.html');

    const htmlOriginal = await respuesta.text();
    const parser = new DOMParser();
    const documento = parser.parseFromString(htmlOriginal, 'text/html');

    let base = documento.querySelector('base');
    if (!base) {
      base = documento.createElement('base');
      documento.head.prepend(base);
    }
    base.setAttribute('href', '/');

    documento.querySelectorAll(
      'link[href],script[src],img[src],source[src],video[src],audio[src],iframe[src],object[data],embed[src],track[src]'
    ).forEach((elemento) => {
      const atributo = elemento.hasAttribute('href') ? 'href'
        : elemento.hasAttribute('src') ? 'src'
        : elemento.hasAttribute('data') ? 'data' : null;
      if (!atributo) return;
      const valor = (elemento.getAttribute(atributo) || '').trim();
      if (!valor || valor.startsWith('/') || valor.startsWith('#') || valor.startsWith('?') ||
          valor.startsWith('http://') || valor.startsWith('https://') || valor.startsWith('//') ||
          valor.startsWith('data:') || valor.startsWith('blob:') || valor.startsWith('mailto:') ||
          valor.startsWith('tel:') || valor.startsWith('javascript:')) return;
      elemento.setAttribute(atributo, '/' + valor.replace(/^\.\//, ''));
    });

    documento.querySelectorAll('script[src*="producto-directo.js"]').forEach((script) => script.remove());
    const scriptProducto = documento.createElement('script');
    scriptProducto.src = '/producto-directo.js?v=' + Date.now();
    documento.body.appendChild(scriptProducto);

    if (idProducto) {
      const urlProducto = '/producto/' + encodeURIComponent(idProducto);
      const html = '<!DOCTYPE html>\n' + documento.documentElement.outerHTML;
      document.open();
      document.write(html);
      document.close();
      history.replaceState({ producto: idProducto }, '', urlProducto);
    } else {
      document.open();
      document.write('<!DOCTYPE html>\n' + documento.documentElement.outerHTML);
      document.close();
    }
  } catch (error) {
    console.error('Re Orgánico bootstrap:', error);
    document.body.innerHTML = '<div class="cargando"><strong>No se pudo cargar Re Orgánico.</strong><br>Recarga la página e inténtalo nuevamente.</div>';
  }
})();