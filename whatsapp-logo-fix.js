"use strict";

(() => {
    const logoWhatsApp = `
      <svg class="icono-red icono-whatsapp" viewBox="0 0 32 32" aria-hidden="true" focusable="false">
        <circle cx="16" cy="16" r="15" fill="#25D366"/>
        <g transform="translate(5.2 5.2) scale(1.2)">
          <path fill="#fff" d="M13.601 2.326A7.854 7.854 0 0 0 9.594 1C5.217 1 1.659 4.557 1.659 8.934c0 1.398.366 2.761 1.057 3.958L1.592 17l4.222-1.108a7.93 7.93 0 0 0 3.78.965h.004c4.376 0 7.934-3.558 7.934-7.934 0-2.12-.826-4.113-2.329-5.616a7.855 7.855 0 0 0-1.602-.981Zm-4.007 13.19h-.003a6.6 6.6 0 0 1-3.36-.92l-.24-.144-2.501.656.667-2.434-.156-.251a6.56 6.56 0 0 1-1.007-3.493c0-3.642 2.964-6.605 6.61-6.605A6.567 6.567 0 0 1 14.28 4.26a6.561 6.561 0 0 1 1.935 4.664c0 3.642-2.964 6.605-6.621 6.605Zm3.626-4.945c-.198-.099-1.175-.58-1.357-.646-.182-.066-.314-.099-.445.099-.132.198-.511.646-.627.778-.116.132-.231.148-.429.05-.198-.099-.836-.308-1.593-.982-.588-.525-.985-1.174-1.101-1.372-.116-.198-.012-.305.087-.404.089-.088.198-.231.297-.347.1-.116.132-.198.198-.33.066-.132.033-.248-.017-.347-.05-.099-.445-1.074-.61-1.47-.16-.389-.323-.336-.445-.342-.116-.006-.248-.007-.38-.007a.729.729 0 0 0-.528.248c-.182.198-.693.677-.693 1.65 0 .973.71 1.914.81 2.046.099.132 1.398 2.134 3.385 2.993.473.204.842.326 1.13.417.475.151.907.129 1.248.078.381-.057 1.175-.48 1.34-.943.165-.462.165-.858.116-.943-.05-.083-.182-.132-.38-.231Z"/>
        </g>
      </svg>`;

    function aplicarLogo() {
        const flotante = document.getElementById("whatsapp-flotante");
        if (flotante) flotante.innerHTML = logoWhatsApp;

        const contacto = document.getElementById("enlace-whatsapp-contacto");
        if (contacto) contacto.innerHTML = `${logoWhatsApp}<span>Hablar por WhatsApp</span>`;

        const consulta = document.querySelector(".boton-enviar-consulta");
        if (consulta) consulta.innerHTML = `${logoWhatsApp}<span>Enviar consulta por WhatsApp</span>`;

        document.querySelectorAll(".servicio-rapido").forEach((servicio) => {
            if (!servicio.textContent.includes("WhatsApp")) return;
            const icono = servicio.querySelector(":scope > span");
            if (icono) icono.innerHTML = logoWhatsApp;
        });
    }

    function iniciar() {
        aplicarLogo();
        setTimeout(aplicarLogo, 100);
        setTimeout(aplicarLogo, 800);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", iniciar, { once: true });
    } else {
        iniciar();
    }
})();
