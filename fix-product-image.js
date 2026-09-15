(() => {
    "use strict";

    const CONFIG = window.REORGANICO_SUPABASE;
    if (!CONFIG?.url) return;

    window.obtenerUrlPublicaProducto = function (path) {
        if (!path) return "";

        const partes = String(path)
            .split("/")
            .filter(Boolean)
            .map((parte) => encodeURIComponent(parte));

        return `${CONFIG.url}/storage/v1/object/public/productos/${partes.join("/")}`;
    };
})();
