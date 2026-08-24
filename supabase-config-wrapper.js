"use strict";

document.write('<script src="https://cdn.jsdelivr.net/gh/jilchristian6-crypto/re-organico@c06631bda7a8a6a6a2b088bb542ed5e10e7a2cd1/supabase-config.js"></script><script src="/image-state-fix.js?v=20260824-1611"></script>');

(() => {
  const instagram = `
    <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false" style="width:24px;height:24px;display:block;flex:0 0 auto">
      <defs>
        <linearGradient id="ig-reorganico-runtime" x1="4" y1="28" x2="28" y2="4" gradientUnits="userSpaceOnUse">
          <stop offset="0" stop-color="#FEDA75"/>
          <stop offset="0.28" stop-color="#FA7E1E"/>
          <stop offset="0.53" stop-color="#D62976"/>
          <stop offset="0.76" stop-color="#962FBF"/>
          <stop offset="1" stop-color="#4F5BD5"/>
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="28" height="28" rx="8.5" fill="url(#ig-reorganico-runtime)"/>
      <rect x="8.2" y="8.2" width="15.6" height="15.6" rx="4.8" fill="none" stroke="#fff" stroke-width="2.2"/>
      <circle cx="16" cy="16" r="3.7" fill="none" stroke="#fff" stroke-width="2.2"/>
      <circle cx="21.3" cy="10.8" r="1.25" fill="#fff"/>
    </svg>`;

  const whatsapp = `
    <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false" style="width:32px;height:32px;display:block">
      <circle cx="16" cy="16" r="15" fill="#25D366"/>
      <path fill="#fff" d="M23.3 8.6A10.03 10.03 0 0 0 16.03 5.6C10.4 5.6 5.82 10.05 5.82 15.52c0 1.75.47 3.46 1.36 4.96L5.74 25.7l5.5-1.4a10.35 10.35 0 0 0 4.78 1.16h.01c5.62 0 10.2-4.45 10.2-9.93 0-2.65-1.04-5.14-2.93-6.93Zm-7.27 15.2h-.01a8.58 8.58 0 0 1-4.37-1.17l-.31-.18-3.26.83.87-3.08-.2-.32a8.02 8.02 0 0 1-1.28-4.36c0-4.56 3.83-8.27 8.56-8.27 2.29 0 4.44.86 6.06 2.43a8.12 8.12 0 0 1 2.5 5.86c0 4.55-3.84 8.26-8.56 8.26Zm4.67-6.17c-.26-.13-1.51-.73-1.75-.81-.23-.09-.4-.13-.57.13-.17.25-.66.81-.81.97-.15.17-.3.19-.56.06-.26-.13-1.08-.39-2.06-1.23-.76-.65-1.27-1.47-1.42-1.72-.15-.25-.02-.38.11-.51.12-.11.26-.29.39-.43.13-.15.17-.25.26-.42.09-.17.04-.32-.02-.45-.06-.13-.57-1.36-.79-1.86-.21-.49-.42-.42-.57-.43h-.49c-.17 0-.45.06-.68.32-.24.25-.9.87-.9 2.11s.92 2.45 1.05 2.62c.13.17 1.8 2.7 4.37 3.78.61.26 1.09.41 1.46.52.61.19 1.17.16 1.61.1.49-.07 1.51-.6 1.73-1.19.21-.6.21-1.11.15-1.21-.06-.11-.23-.17-.49-.3Z"/>
    </svg>`;

  function aplicar() {
    document.querySelectorAll('.trabajo-instagram').forEach((a) => {
      a.style.display = 'inline-flex';
      a.style.alignItems = 'center';
      a.style.justifyContent = 'center';
      a.style.gap = '9px';
      a.innerHTML = `${instagram}<span>Ver Instagram</span>`;
    });

    const wsp = document.getElementById('whatsapp-flotante');
    if (wsp) {
      wsp.style.display = 'flex';
      wsp.style.alignItems = 'center';
      wsp.style.justifyContent = 'center';
      wsp.style.padding = '0';
      wsp.innerHTML = whatsapp;
    }
  }

  document.addEventListener('DOMContentLoaded', aplicar);
  window.addEventListener('load', aplicar);

  let intentos = 0;
  const timer = setInterval(() => {
    aplicar();
    intentos += 1;
    if (intentos >= 24) clearInterval(timer);
  }, 250);
})();
