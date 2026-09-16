const SUPABASE_URL = process.env.SUPABASE_URL || "https://bkhpkiwbwdzlnjysdzqw.supabase.co";
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || "sb_publishable_LdpztMzZKei1nBtx36dHVg_OgsWtcr";
const SITE_URL = "https://reorganico.cl";

function escapeHtml(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

function imageUrl(path) {
    if (!path) return `${SITE_URL}/assets/logo-re-organico.png`;
    if (/^https?:\/\//i.test(path)) return path;
    return `${SUPABASE_URL}/storage/v1/object/public/productos/${String(path).replace(/^\/+/, "")}`;
}

function formatPrice(value) {
    const number = Number(value);
    if (!Number.isFinite(number)) return "";
    return `$${Math.round(number).toLocaleString("es-CL")}`;
}

module.exports = async function handler(req, res) {
    const id = String(req.query?.id || "").trim();

    if (!id) {
        res.statusCode = 400;
        res.setHeader("Content-Type", "text/html; charset=utf-8");
        res.end("<h1>Producto no especificado</h1>");
        return;
    }

    try {
        const endpoint = `${SUPABASE_URL}/rest/v1/productos?id=eq.${encodeURIComponent(id)}&select=id,nombre,precio,descripcion,categoria,medida,imagen_path,imagen_admin_path`;
        const response = await fetch(endpoint, {
            headers: {
                apikey: SUPABASE_ANON_KEY,
                Authorization: `Bearer ${SUPABASE_ANON_KEY}`
            }
        });

        if (!response.ok) throw new Error(`Supabase respondió ${response.status}`);

        const productos = await response.json();
        const producto = productos?.[0];

        if (!producto) {
            res.statusCode = 404;
            res.setHeader("Content-Type", "text/html; charset=utf-8");
            res.end("<h1>Producto no encontrado</h1>");
            return;
        }

        const nombre = String(producto.nombre || "Producto Re Orgánico").trim();
        const descripcionBase = String(producto.descripcion || "Producto Re Orgánico.").replace(/\s+/g, " ").trim();
        const precio = formatPrice(producto.precio);
        const descripcion = precio ? `${precio} | ${descripcionBase}` : descripcionBase;
        const imagen = imageUrl(producto.imagen_admin_path || producto.imagen_path);
        const productoUrl = `${SITE_URL}/producto/${encodeURIComponent(id)}`;
        const destino = `${SITE_URL}/?producto=${encodeURIComponent(id)}&preview=1#productos`;

        const title = `${nombre} | Re Orgánico`;
        const html = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(descripcion)}">
    <link rel="canonical" href="${escapeHtml(productoUrl)}">

    <meta property="og:type" content="product">
    <meta property="og:site_name" content="Re Orgánico">
    <meta property="og:title" content="${escapeHtml(title)}">
    <meta property="og:description" content="${escapeHtml(descripcion)}">
    <meta property="og:url" content="${escapeHtml(productoUrl)}">
    <meta property="og:image" content="${escapeHtml(imagen)}">
    <meta property="og:image:alt" content="${escapeHtml(nombre)}">

    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${escapeHtml(title)}">
    <meta name="twitter:description" content="${escapeHtml(descripcion)}">
    <meta name="twitter:image" content="${escapeHtml(imagen)}">

    <meta http-equiv="refresh" content="0;url=${escapeHtml(destino)}">
</head>
<body>
    <main>
        <h1>${escapeHtml(nombre)}</h1>
        <p>${escapeHtml(descripcion)}</p>
        <p><a href="${escapeHtml(destino)}">Ver producto en Re Orgánico</a></p>
    </main>
</body>
</html>`;

        res.statusCode = 200;
        res.setHeader("Content-Type", "text/html; charset=utf-8");
        res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0");
        res.setHeader("CDN-Cache-Control", "no-store");
        res.setHeader("Vercel-CDN-Cache-Control", "no-store");
        res.setHeader("Pragma", "no-cache");
        res.setHeader("X-Robots-Tag", "index, follow");
        res.end(html);
    } catch (error) {
        console.error("Error generando vista previa de producto:", error);
        res.statusCode = 500;
        res.setHeader("Content-Type", "text/html; charset=utf-8");
        res.end("<h1>No se pudo cargar el producto</h1>");
    }
};
