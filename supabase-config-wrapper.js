"use strict";

/*
 * Capa única de compatibilidad de Re Orgánico.
 * Carga la configuración estable y aplica los ajustes visuales solicitados.
 */
document.write('<script src="https://cdn.jsdelivr.net/gh/jilchristian6-crypto/re-organico@c06631bda7a8a6a6a2b088bb542ed5e10e7a2cd1/supabase-config.js"></script>');

(() => {
  const iconoInstagram = `
    <svg class="icono-red icono-instagram" viewBox="0 0 32 32" aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id="ig-brand" cx="30%" cy="107%" r="140%">
          <stop offset="0%" stop-color="#fdf497"/>
          <stop offset="20%" stop-color="#fdf497"/>
          <stop offset="40%" stop-color="#fd5949"/>
          <stop offset="60%" stop-color="#d6249f"/>
          <stop offset="90%" stop-color="#285AEB"/>
        </radialGradient>
      </defs>
      <rect x="1.5" y="1.5" width="29" height="29" rx="8.5" fill="url(#ig-brand)"/>
      <rect x="8" y="8" width="16" height="16" rx="5" fill="none" stroke="#fff" stroke-width="2.4"/>
      <circle cx="16" cy="16" r="4" fill="none" stroke="#fff" stroke-width="2.4"/>
      <circle cx="22" cy="10.3" r="1.45" fill="#fff"/>
    </svg>`;

  const iconoWhatsApp = `
    <svg class="icono-red icono-whatsapp" viewBox="0 0 32 32" aria-hidden="true" focusable="false">
      <circle cx="16" cy="16" r="15.3" fill="#25D366"/>
      <path fill="#fff" d="M24.2 7.8A11.38 11.38 0 0 0 16.1 4.5C9.8 4.5 4.7 9.5 4.7 15.6c0 2 .5 3.9 1.5 5.6L4.6 27l6-1.5c1.6.9 3.5 1.3 5.4 1.3h.1c6.3 0 11.4-5 11.4-11.1 0-3-1.2-5.8-3.3-7.9Zm-8.1 17.1H16c-1.7 0-3.4-.5-4.8-1.3l-.3-.2-3.6.9 1-3.4-.2-.4a8.9 8.9 0 0 1-1.4-4.9c0-4.9 4.2-9 9.4-9 2.5 0 4.9.9 6.7 2.7a8.6 8.6 0 0 1 2.7 6.4c-.1 5-4.3 9.2-9.4 9.2Zm5.2-6.8c-.3-.1-1.7-.8-1.9-.9-.3-.1-.4-.1-.6.1-.2.3-.7.9-.9 1.1-.2.2-.3.2-.6.1-.3-.1-1.2-.4-2.3-1.4-.8-.7-1.4-1.6-1.6-1.9-.2-.3 0-.4.1-.6l.4-.5c.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5-.1-.1-.6-1.5-.9-2.1-.2-.5-.5-.5-.6-.5h-.5c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.4s1 2.7 1.2 2.9c.1.2 2 3 4.8 4.2.7.3 1.2.4 1.6.6.7.2 1.3.2 1.8.1.5-.1 1.7-.7 1.9-1.3.2-.7.2-1.2.2-1.3-.1-.2-.3-.3-.6-.4Z"/>
    </svg>`;

  function instalarEstilos() {
    document.getElementById("reorganico-ajustes-estables")?.remove();
    const style = document.createElement("style");
    style.id = "reorganico-ajustes-estables";
    style.textContent = `
      .icono-red{width:24px;height:24px;display:inline-block;vertical-align:middle;flex:0 0 auto}
      .trabajo-instagram,.boton-contacto,.boton-enviar-consulta{display:inline-flex!important;align-items:center!important;justify-content:center!important;gap:9px!important}
      #whatsapp-flotante{display:flex!important;align-items:center!important;justify-content:center!important;padding:0!important;background:#25D366!important;border:3px solid #fff!important;box-shadow:0 8px 24px rgba(0,0,0,.22)!important}
      #whatsapp-flotante .icono-whatsapp{width:42px!important;height:42px!important;display:block!important}
      #enlace-whatsapp-contacto .icono-whatsapp,.boton-enviar-consulta .icono-whatsapp{width:24px!important;height:24px!important}
      .trabajo-instagram .icono-instagram{width:25px!important;height:25px!important}
      #enlace-instagram-pie,#enlace-whatsapp-pie{display:inline-flex!important;align-items:center!important;gap:7px!important}
      #enlace-instagram-pie .icono-instagram,#enlace-whatsapp-pie .icono-whatsapp{width:20px!important;height:20px!important}
      .contacto-icono.social-real{background:transparent!important;font-size:0!important;display:flex!important;align-items:center!important;justify-content:center!important}
      .contacto-icono.social-real .icono-red{width:34px!important;height:34px!important}
      .servicio-rapido .icono-whatsapp{width:34px!important;height:34px!important}

      #modal-presentacion-resumen,
      #modal-cantidad-compra .modal-cantidad-texto{display:none!important}
      #modal-presentacion .presentacion-opcion,
      #modal-presentacion .presentacion-opcion *{color:#1f4d3a!important}
      #modal-presentacion .presentacion-opcion{border-color:rgba(31,77,58,.18)!important;background:#f5f7f3!important;text-decoration:none!important}
      #modal-presentacion .presentacion-opcion.activo{border-color:#1f4d3a!important;background:#e7f0e9!important;box-shadow:0 0 0 2px rgba(31,77,58,.08)!important}
      @media(max-width:700px){#whatsapp-flotante .icono-whatsapp{width:38px!important;height:38px!important}}
    `;
    document.head.appendChild(style);
  }

  function aplicarRedes() {
    document.querySelectorAll(".trabajo-instagram").forEach((enlace) => {
      enlace.innerHTML = `${iconoInstagram}<span>Ver Instagram</span>`;
    });

    const pieInstagram = document.getElementById("enlace-instagram-pie");
    if (pieInstagram) pieInstagram.innerHTML = `${iconoInstagram}<span>Instagram</span>`;

    const pieWhatsapp = document.getElementById("enlace-whatsapp-pie");
    if (pieWhatsapp) pieWhatsapp.innerHTML = `${iconoWhatsApp}<span>WhatsApp</span>`;

    const flotante = document.getElementById("whatsapp-flotante");
    if (flotante) {
      flotante.innerHTML = iconoWhatsApp;
      flotante.setAttribute("aria-label", "Contactar por WhatsApp");
    }

    const contacto = document.getElementById("enlace-whatsapp-contacto");
    if (contacto) contacto.innerHTML = `${iconoWhatsApp}<span>Hablar por WhatsApp</span>`;

    const consulta = document.querySelector(".boton-enviar-consulta");
    if (consulta) consulta.innerHTML = `${iconoWhatsApp}<span>Enviar consulta por WhatsApp</span>`;

    document.querySelectorAll(".servicio-rapido").forEach((servicio) => {
      if (!/WhatsApp/i.test(servicio.textContent || "")) return;
      const primero = servicio.querySelector(":scope > span");
      if (primero) primero.outerHTML = `<span aria-hidden="true">${iconoWhatsApp}</span>`;
    });

    document.querySelectorAll(".contacto-item").forEach((item) => {
      const texto = item.textContent || "";
      const icono = item.querySelector(".contacto-icono");
      if (!icono) return;
      if (/WhatsApp/i.test(texto)) {
        icono.classList.add("social-real");
        icono.innerHTML = iconoWhatsApp;
      } else if (/Instagram/i.test(texto)) {
        icono.classList.add("social-real");
        icono.innerHTML = iconoInstagram;
      }
    });
  }

  function aplicarImagenesSeguras() {
    const imagenes = window.REORGANICO_IMAGENES_PRODUCTOS;
    if (!imagenes) return;
    imagenes["bolsa-pequena-36x40-my14"] = "img/productos/actualizadas/bolsa-36x40-my14.webp";
    imagenes["bambu-soup-bucket-500-1bg606"] = "img/productos/actualizadas/soup-bucket-500.webp";
    imagenes["pulpa-fast-food-191x136-ydb001"] = "img/productos/cambios-20260821/fast-food-191x136.webp";
    imagenes["pulpa-fast-food-172x113-ydb004"] = "img/productos/cambios-20260821/fast-food-172x113.webp";
    imagenes["bambu-tapa-cpla-1200-1bg056"] = "img/productos/cambios-20260821/tapa-cpla-1200-750.webp";
    imagenes["bambu-tapa-cpla-750-1bg053"] = "img/productos/cambios-20260821/tapa-cpla-1200-750.webp";
    imagenes["bambu-tapa-soup-bucket-500-1bg607"] = "img/productos/cambios-20260821/tapa-soup-bucket-500.webp";
    imagenes["pack-tris-servilleta-1vp129"] = "img/productos/cambios-20260821/pack-tris-servilleta.webp";
    imagenes["contenedor-pla-tapa-250-20500"] = "img/productos/cambios-20260821/contenedor-pla-250.webp";
    imagenes["contenedor-pla-tapa-1000-20508"] = "img/productos/cambios-20260821/contenedor-pla-1000.webp";
  }

  function aplicarFaq() {
    document.querySelectorAll(".pregunta").forEach((item) => {
      const titulo = item.querySelector(".pregunta-boton span:first-child")?.textContent?.trim() || "";
      if (!/cu[aá]ntas bolsas vienen en un pack/i.test(titulo)) return;
      const respuesta = item.querySelector(".pregunta-respuesta p");
      if (respuesta) respuesta.textContent = "Rollos de bolsas, pack y cajas muestran su cantidad exacta en la descripción de cada producto.";
    });
  }

  function aplicarEtiqueta() {
    const tarjeta = document.querySelector('[data-id="bolsa-mediana-42x50-my21"]');
    const etiqueta = tarjeta?.querySelector(".producto-etiqueta");
    if (etiqueta) etiqueta.textContent = "Mediana resistente";
  }

  function aplicarTodo() {
    instalarEstilos();
    aplicarImagenesSeguras();
    aplicarRedes();
    aplicarFaq();
    aplicarEtiqueta();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", aplicarTodo, { once:true });
  } else {
    aplicarTodo();
  }

  window.addEventListener("load", aplicarRedes, { once:true });

  const observer = new MutationObserver(() => {
    aplicarRedes();
    aplicarEtiqueta();
  });

  if (document.body) observer.observe(document.body, { childList:true, subtree:true });
  else document.addEventListener("DOMContentLoaded", () => observer.observe(document.body, { childList:true, subtree:true }), { once:true });
})();
