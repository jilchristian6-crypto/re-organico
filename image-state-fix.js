"use strict";

(() => {
  const imagenes = window.REORGANICO_IMAGENES_PRODUCTOS;
  if (!imagenes) return;

  const base = "https://cdn.jsdelivr.net/gh/jilchristian6-crypto/re-organico@bc63c8149a2a7124e4d1d87d6d9638c6f4eec6f8/";

  // Mantener el aspecto de inicio de hoy para las fotos que fueron reemplazadas después.
  imagenes["pulpa-fast-food-191x136-ydb001"] = base + "img/productos/cambios-20260821/fast-food-191x136.webp";
  imagenes["pulpa-fast-food-172x113-ydb004"] = base + "img/productos/cambios-20260821/fast-food-172x113.webp";
  imagenes["bambu-tapa-cpla-1200-1bg056"] = base + "img/productos/cambios-20260821/tapa-cpla-1200-750.webp";
  imagenes["bambu-tapa-cpla-750-1bg053"] = base + "img/productos/cambios-20260821/tapa-cpla-1200-750.webp";
  imagenes["bambu-tapa-soup-bucket-500-1bg607"] = base + "img/productos/cambios-20260821/tapa-soup-bucket-500.webp";
  imagenes["pack-tris-servilleta-1vp129"] = base + "img/productos/cambios-20260821/pack-tris-servilleta.webp";
  imagenes["contenedor-pla-tapa-250-20500"] = base + "img/productos/cambios-20260821/contenedor-pla-250.webp";
  imagenes["contenedor-pla-tapa-1000-20508"] = base + "img/productos/cambios-20260821/contenedor-pla-1000.webp";

  // Estas dos estaban pixeladas: conservar la misma foto pero desde su versión de mayor calidad anterior.
  imagenes["bolsa-pequena-36x40-my14"] = base + "img/productos/actualizadas/bolsa-36x40-my14.webp";
  imagenes["bambu-soup-bucket-500-1bg606"] = base + "img/productos/actualizadas/soup-bucket-500.webp";
})();
