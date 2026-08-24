"use strict";

(() => {
  const imagenes = window.REORGANICO_IMAGENES_PRODUCTOS;
  if (!imagenes) return;

  // Usar solo rutas internas del sitio para evitar bloqueos por la política de seguridad.
  imagenes["pulpa-fast-food-191x136-ydb001"] = "img/productos/cambios-20260821/fast-food-191x136.webp";
  imagenes["pulpa-fast-food-172x113-ydb004"] = "img/productos/cambios-20260821/fast-food-172x113.webp";
  imagenes["bambu-tapa-cpla-1200-1bg056"] = "img/productos/cambios-20260821/tapa-cpla-1200-750.webp";
  imagenes["bambu-tapa-cpla-750-1bg053"] = "img/productos/cambios-20260821/tapa-cpla-1200-750.webp";
  imagenes["bambu-tapa-soup-bucket-500-1bg607"] = "img/productos/cambios-20260821/tapa-soup-bucket-500.webp";
  imagenes["pack-tris-servilleta-1vp129"] = "img/productos/cambios-20260821/pack-tris-servilleta.webp";
  imagenes["contenedor-pla-tapa-250-20500"] = "img/productos/cambios-20260821/contenedor-pla-250.webp";
  imagenes["contenedor-pla-tapa-1000-20508"] = "img/productos/cambios-20260821/contenedor-pla-1000.webp";

  // Bolsa pequeña: volver a la foto original interna que sí carga correctamente.
  imagenes["bolsa-pequena-36x40-my14"] = "img/productos/cambios-20260821/bolsa-36x40-my14.webp";

  // Mantener la versión nítida del Soup Bucket desde una ruta interna.
  imagenes["bambu-soup-bucket-500-1bg606"] = "img/productos/actualizadas/soup-bucket-500.webp";
})();
