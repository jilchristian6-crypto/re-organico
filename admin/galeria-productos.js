"use strict";
(() => {
    const BUCKET = "productos";
    const TIPOS = new Set(["image/jpeg", "image/png", "image/webp"]);
    const MAX_FOTO = 10 * 1024 * 1024;
    let supabase = null;
    let productoId = "";
    let fotos = [];
    let ocupada = false;

    function iniciar() {
        if (!window.supabase || !window.REORGANICO_SUPABASE) return;
        supabase = window.supabase.createClient(
            window.REORGANICO_SUPABASE.url,
            window.REORGANICO_SUPABASE.anonKey,
            { auth: { storage: sessionStorage, storageKey: "reorganico-admin-auth-v1", persistSession: true, autoRefreshToken: true, detectSessionInUrl: true, flowType: "pkce" } }
        );
        crearEstilos();
        crearGestor();
        cargarSelector();
        conectarBotonesProductos();
        ajustarFormularioBlog();
    }

    function ajustarFormularioBlog() {
        const destino = document.getElementById("galeria-destino");
        const titulo = document.getElementById("galeria-titulo");
        const descripcion = document.getElementById("galeria-descripcion");
        if (!titulo || !descripcion) return;

        const campoTitulo = titulo.closest(".campo");
        const campoDescripcion = descripcion.closest(".campo");
        const campoDestino = destino?.closest(".campo");
        const esBlog = destino?.value === "blog";

        if (campoTitulo) {
            campoTitulo.style.display = esBlog ? "block" : "none";
            titulo.required = esBlog;
            titulo.placeholder = esBlog ? "Ej: Cómo hacer compost en casa" : "Título del contenido";
        }

        if (campoDescripcion) {
            campoDescripcion.style.display = esBlog ? "block" : "none";
            descripcion.required = esBlog;
            descripcion.placeholder = esBlog ? "Escribe una descripción para la publicación del blog" : "Una descripción corta del contenido";
        }

        if (campoDestino) campoDestino.style.display = "none";
    }

    function crearEstilos() {
        if (document.getElementById("gpa-styles")) return;
        const style = document.createElement("style");
        style.id = "gpa-styles";
        style.textContent = `
            .gpa-manager{margin:28px 0;padding:28px;border:1px solid #d9e4dd;border-radius:24px;background:#fff;box-shadow:0 10px 30px rgba(31,77,58,.07)}
            .gpa-head{display:flex;justify-content:space-between;gap:20px;align-items:flex-start;margin-bottom:20px}.gpa-head b{font-size:12px;letter-spacing:1.4px;color:#2b6650}.gpa-head h2{margin:5px 0 7px;color:#174b3a}.gpa-head p{margin:0;color:#617169}.gpa-head span{background:#dfeae3;padding:9px 14px;border-radius:999px;font-weight:800;color:#1f4d3a;white-space:nowrap}
            .gpa-select-wrap label{display:flex;flex-direction:column;gap:7px;font-weight:700;color:#174b3a}.gpa-select-wrap select{width:100%;padding:13px 15px;border:1px solid #ccd9d2;border-radius:12px;background:#fff;font-size:16px;cursor:pointer}
            .gpa-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(170px,1fr));gap:16px;margin-top:22px}.gpa-card{border:1px solid #dbe5df;border-radius:16px;overflow:hidden;background:#f8faf9}.gpa-card.principal{border:2px solid #6f9482}.gpa-card img{display:block;width:100%;height:170px;object-fit:cover}.gpa-card>div{padding:10px;display:flex;flex-wrap:wrap;gap:7px}.gpa-card button{border:0;border-radius:9px;padding:8px 10px;background:#e7eee9;color:#174b3a;font-weight:700;cursor:pointer}.gpa-card button:last-child{background:#f3e2df;color:#8a352d}.gpa-principal{display:block;width:100%;color:#1f6a4d;font-size:12px;font-weight:800}
            .gpa-empty{margin-top:22px;padding:28px;border:1px dashed #a9c5b4;border-radius:16px;background:#f7faf8;text-align:center;color:#537064}.gpa-empty small{display:block;margin-top:6px}.gpa-actions{display:flex;align-items:center;gap:12px;margin-top:20px;flex-wrap:wrap}.gpa-actions button{border:0;border-radius:12px;padding:13px 18px;font-weight:800;cursor:pointer}.gpa-add{background:#6f9482;color:#fff}.gpa-add:disabled{opacity:.5;cursor:not-allowed}.gpa-msg{font-weight:700;color:#426457}.gpa-hint{margin-top:10px;color:#718078;font-size:13px}
            @media(max-width:700px){.gpa-head{flex-direction:column}.gpa-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.gpa-card img{height:135px}}
        `;
        document.head.appendChild(style);
    }

    function crearGestor() {
        const seccion = document.getElementById("seccion-productos");
        const carga = document.getElementById("zona-carga-fotos")?.closest(".carga-fotos-productos");
        if (!seccion || !carga || document.getElementById("gpa-manager")) return;

        const gestor = document.createElement("section");
        gestor.id = "gpa-manager";
        gestor.className = "gpa-manager";
        gestor.innerHTML = `
            <div class="gpa-head"><div><b>GESTIÓN DE FOTOS</b><h2>Fotos del catálogo</h2><p>Selecciona un producto y administra sus fotos.</p></div><span id="gpa-c">0 fotos</span></div>
            <div class="gpa-select-wrap"><label for="gpa-producto">Producto<select id="gpa-producto"><option value="">Selecciona un producto...</option></select></label></div>
            <div id="gpa-grid" class="gpa-grid"></div>
            <div id="gpa-empty" class="gpa-empty"><strong>📷 Selecciona un producto</strong><small>Aquí aparecerán sus fotos.</small></div>
            <div class="gpa-actions"><input id="gpa-in" type="file" accept="image/jpeg,image/png,image/webp" multiple hidden><button class="gpa-add" id="gpa-add" type="button" disabled>📸 Agregar fotos</button><span class="gpa-msg" id="gpa-msg" role="status"></span></div>
            <p class="gpa-hint">JPG, PNG o WEBP · máximo 10 MB por foto · puedes seleccionar varias.</p>`;
        carga.insertAdjacentElement("afterend", gestor);

        document.getElementById("gpa-producto").addEventListener("change", (e) => {
            productoId = e.target.value;
            cargarFotos(productoId);
        });
        document.getElementById("gpa-add").addEventListener("click", () => {
            if (productoId) document.getElementById("gpa-in").click();
        });
        document.getElementById("gpa-in").addEventListener("change", (e) => {
            subir(Array.from(e.target.files || []));
            e.target.value = "";
        });
        document.getElementById("gpa-grid").addEventListener("click", (e) => {
            const boton = e.target.closest("button[data-foto-accion]");
            if (!boton) return;
            if (boton.dataset.fotoAccion === "principal") hacerPrincipal(boton.dataset.path);
            if (boton.dataset.fotoAccion === "eliminar") eliminarFoto(boton.dataset.path);
        });
    }

    async function cargarSelector() {
        const select = document.getElementById("gpa-producto");
        if (!select) return;
        const { data, error } = await supabase.from("productos").select("id,nombre").order("orden", { ascending: true });
        if (error) return;
        select.innerHTML = '<option value="">Selecciona un producto...</option>' + (data || []).map(p => `<option value="${esc(p.id)}">${esc(p.nombre)}</option>`).join("");
    }

    function conectarBotonesProductos() {
        const lista = document.getElementById("lista-admin");
        if (!lista || lista.dataset.gpaConectado === "1") return;
        lista.dataset.gpaConectado = "1";
        lista.addEventListener("click", (e) => {
            const boton = e.target.closest('[data-accion="galeria"][data-id], [data-accion="foto"][data-id]');
            if (!boton) return;
            e.preventDefault();
            e.stopPropagation();
            const id = boton.dataset.id;
            const select = document.getElementById("gpa-producto");
            const gestor = document.getElementById("gpa-manager");
            if (!id || !select || !gestor) return;
            productoId = id;
            select.value = id;
            cargarFotos(id);
            gestor.scrollIntoView({ behavior: "smooth", block: "center" });
        });
    }

    function actualizarBotones() {
        document.querySelectorAll('#lista-admin [data-accion="foto"][data-id]').forEach((boton) => {
            boton.dataset.accion = "galeria";
            boton.textContent = "📸 Gestionar fotos";
        });
    }

    async function cargarFotos(id) {
        if (!id) { fotos = []; renderizar(); return; }
        const { data, error } = await supabase.storage.from(BUCKET).list(id, { limit: 100, sortBy: { column: "name", order: "asc" } });
        if (error) { mensaje("No se pudieron cargar las fotos."); return; }
        const { data: producto } = await supabase.from("productos").select("imagen_admin_path").eq("id", id).maybeSingle();
        const principal = producto?.imagen_admin_path || "";
        fotos = (data || []).filter(x => x.name).map(x => ({ name: x.name, path: `${id}/${x.name}` }));
        fotos.sort((a,b) => a.path === principal ? -1 : b.path === principal ? 1 : a.name.localeCompare(b.name));
        renderizar(principal);
    }

    function renderizar(principal = "") {
        const grid = document.getElementById("gpa-grid");
        const empty = document.getElementById("gpa-empty");
        const count = document.getElementById("gpa-c");
        const add = document.getElementById("gpa-add");
        if (!grid || !empty || !count || !add) return;
        count.textContent = `${fotos.length} foto${fotos.length === 1 ? "" : "s"}`;
        add.disabled = !productoId || ocupada;
        empty.hidden = fotos.length > 0;
        if (!fotos.length) empty.innerHTML = productoId ? '<strong>📷 Este producto todavía no tiene fotos</strong><small>Usa “Agregar fotos” para subir una o varias.</small>' : '<strong>📷 Selecciona un producto</strong><small>Aquí aparecerán sus fotos.</small>';
        grid.innerHTML = fotos.map(f => {
            const url = supabase.storage.from(BUCKET).getPublicUrl(f.path).data.publicUrl;
            const esPrincipal = f.path === principal;
            return `<article class="gpa-card${esPrincipal ? " principal" : ""}"><img src="${esc(url)}" alt="Foto del producto" loading="lazy"><div>${esPrincipal ? '<span class="gpa-principal">★ Foto principal</span>' : `<button type="button" data-foto-accion="principal" data-path="${esc(f.path)}">Usar como principal</button>`}<button type="button" data-foto-accion="eliminar" data-path="${esc(f.path)}">Eliminar</button></div></article>`;
        }).join("");
    }

    async function subir(archivos) {
        if (!productoId || ocupada || !archivos.length) return;
        const validos = archivos.filter(a => TIPOS.has(a.type) && a.size <= MAX_FOTO);
        if (!validos.length) return mensaje("Usa JPG, PNG o WEBP de máximo 10 MB por foto.");
        ocupada = true;
        mensaje(`Subiendo ${validos.length} foto${validos.length === 1 ? "" : "s"}...`);
        let subidas = 0;
        for (const archivo of validos) {
            const ext = archivo.type === "image/jpeg" ? "jpg" : archivo.type.split("/")[1];
            const idArchivo = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2);
            const ruta = `${productoId}/${Date.now()}-${idArchivo}.${ext}`;
            const { error } = await supabase.storage.from(BUCKET).upload(ruta, archivo, { upsert: false, contentType: archivo.type, cacheControl: "31536000" });
            if (!error) subidas++;
        }
        const { data: producto } = await supabase.from("productos").select("imagen_admin_path").eq("id", productoId).maybeSingle();
        if (subidas && !producto?.imagen_admin_path) {
            const { data } = await supabase.storage.from(BUCKET).list(productoId, { limit: 100 });
            const primera = (data || []).filter(x => x.name).sort((a,b) => a.name.localeCompare(b.name))[0];
            if (primera) await supabase.from("productos").update({ imagen_admin_path: `${productoId}/${primera.name}` }).eq("id", productoId);
        }
        await cargarFotos(productoId);
        ocupada = false;
        mensaje(`${subidas} foto${subidas === 1 ? " subida" : "s subidas"}.`);
    }

    async function hacerPrincipal(path) {
        if (!path || ocupada || !productoId) return;
        ocupada = true;
        const { error } = await supabase.from("productos").update({ imagen_admin_path: path }).eq("id", productoId);
        await cargarFotos(productoId);
        ocupada = false;
        mensaje(error ? "No se pudo cambiar la foto principal." : "Foto principal actualizada.");
    }

    async function eliminarFoto(path) {
        if (!path || ocupada || !productoId || !confirm("¿Eliminar esta foto del producto?")) return;
        ocupada = true;
        const { data: producto } = await supabase.from("productos").select("imagen_admin_path").eq("id", productoId).maybeSingle();
        const eraPrincipal = producto?.imagen_admin_path === path;
        const { error } = await supabase.storage.from(BUCKET).remove([path]);
        if (!error && eraPrincipal) {
            const siguiente = fotos.find(x => x.path !== path);
            await supabase.from("productos").update({ imagen_admin_path: siguiente?.path || null }).eq("id", productoId);
        }
        await cargarFotos(productoId);
        ocupada = false;
        mensaje(error ? "No se pudo eliminar la foto." : "Foto eliminada.");
    }

    function mensaje(texto) {
        const el = document.getElementById("gpa-msg");
        if (el) el.textContent = texto;
    }

    function esc(texto) {
        return String(texto || "").replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }

    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", iniciar, { once: true });
    else iniciar();

    setInterval(() => {
        actualizarBotones();
        conectarBotonesProductos();
        ajustarFormularioBlog();
    }, 500);
})();
