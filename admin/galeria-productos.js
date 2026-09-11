"use strict";
(() => {
    const BUCKET = "productos";
    const TIPOS = new Set(["image/jpeg", "image/png", "image/webp"]);
    let supabase = null;
    let productoId = "";
    let fotos = [];
    let ocupada = false;

    function iniciar() {
        if (!window.supabase || !window.REORGANICO_SUPABASE) return;
        supabase = window.supabase.createClient(window.REORGANICO_SUPABASE.url, window.REORGANICO_SUPABASE.anonKey, {
            auth: { storage: sessionStorage, storageKey: "reorganico-admin-auth-v1", persistSession: true, autoRefreshToken: true, detectSessionInUrl: true, flowType: "pkce" }
        });
        crearPanel();
        prepararBotonesListado();
        observarPanel();
        sincronizarProducto();
        setInterval(sincronizarProducto, 700);
    }

    function crearPanel() {
        if (document.getElementById("gpa")) return;
        const acciones = document.getElementById("guardar-producto")?.closest(".acciones-formulario");
        if (!acciones) return;

        const panel = document.createElement("section");
        panel.id = "gpa";
        panel.className = "gpa";
        panel.innerHTML = `
            <div class="gpa-head">
                <div><b>FOTOS DEL PRODUCTO</b><h3>Agregar y editar fotos</h3><p>Sube varias fotos, elimina las que no quieras y elige cuál será la principal del panel.</p></div>
                <span id="gpa-c">0 fotos</span>
            </div>
            <div id="gpa-grid" class="gpa-grid"></div>
            <div id="gpa-empty" class="gpa-empty"><strong>📷 Aún no hay fotos administradas</strong><small>Guarda el producto y luego agrega todas las imágenes que necesites.</small></div>
            <div class="gpa-actions">
                <input id="gpa-in" type="file" accept="image/jpeg,image/png,image/webp" multiple hidden>
                <button class="boton-principal" id="gpa-add" type="button">📸 Agregar nuevas fotos</button>
                <span id="gpa-msg" role="status"></span>
            </div>`;
        acciones.parentElement.insertBefore(panel, acciones);

        const boton = document.createElement("button");
        boton.id = "boton-gestionar-fotos";
        boton.type = "button";
        boton.className = "boton-fotos-admin";
        boton.textContent = "📸 Gestionar fotos del producto";
        boton.title = "Abrir el selector para agregar fotos al producto";
        boton.addEventListener("click", () => {
            sincronizarProducto();
            if (!productoId) {
                mensaje("Primero guarda el producto para poder agregar fotos.");
                document.getElementById("gpa")?.scrollIntoView({ behavior: "smooth", block: "center" });
                return;
            }
            cargarFotos(productoId);
            document.getElementById("gpa")?.scrollIntoView({ behavior: "smooth", block: "center" });
            setTimeout(() => {
                if (!ocupada) document.getElementById("gpa-in")?.click();
            }, 300);
        });
        acciones.insertBefore(boton, acciones.firstChild);

        document.getElementById("gpa-add")?.addEventListener("click", () => {
            sincronizarProducto();
            if (!productoId) return mensaje("Primero guarda el producto.");
            document.getElementById("gpa-in")?.click();
        });
        document.getElementById("gpa-in")?.addEventListener("change", (e) => {
            subir(Array.from(e.target.files || []));
            e.target.value = "";
        });
        document.getElementById("gpa-grid")?.addEventListener("click", (e) => {
            const b = e.target.closest("button[data-foto-accion]");
            if (!b) return;
            if (b.dataset.fotoAccion === "principal") hacerPrincipal(b.dataset.path);
            if (b.dataset.fotoAccion === "eliminar") eliminarFoto(b.dataset.path);
        });
    }

    function prepararBotonesListado() {
        document.querySelectorAll('#lista-admin [data-accion="foto"][data-id]').forEach((b) => {
            b.dataset.accion = "galeria";
            b.textContent = "📸 Gestionar fotos";
            b.title = "Agregar, editar, eliminar o cambiar la foto principal";
            b.classList.add("boton-fotos-admin-listado");
        });
    }

    function observarPanel() {
        const panel = document.getElementById("vista-panel");
        if (panel) new MutationObserver(() => { prepararBotonesListado(); crearPanel(); }).observe(panel, { childList: true, subtree: true });
        document.getElementById("lista-admin")?.addEventListener("click", (e) => {
            const b = e.target.closest('[data-accion="galeria"][data-id]');
            if (!b) return;
            e.preventDefault();
            const editar = document.querySelector(`[data-accion="editar"][data-id="${CSS.escape(b.dataset.id)}"]`);
            if (editar) editar.click();
            setTimeout(() => {
                productoId = b.dataset.id;
                cargarFotos(productoId);
                document.getElementById("gpa")?.scrollIntoView({ behavior: "smooth", block: "center" });
            }, 350);
        });
    }

    function sincronizarProducto() {
        const id = document.getElementById("producto-id")?.value?.trim() || "";
        if (id === productoId) return;
        productoId = id;
        cargarFotos(id);
    }

    async function producto(id) {
        const { data } = await supabase.from("productos").select("imagen_path,imagen_admin_path").eq("id", id).maybeSingle();
        return data || null;
    }

    async function cargarFotos(id) {
        if (!id || !supabase) { fotos = []; renderizar(); return; }
        const { data, error } = await supabase.storage.from(BUCKET).list(id, { limit: 100, sortBy: { column: "name", order: "asc" } });
        if (error) return mensaje("No se pudieron cargar las fotos.");
        const p = await producto(id);
        const principal = p?.imagen_admin_path || "";
        fotos = (data || []).filter((x) => x.name).map((x) => ({ name: x.name, path: `${id}/${x.name}` }));
        fotos.sort((a, b) => a.path === principal ? -1 : b.path === principal ? 1 : a.name.localeCompare(b.name));
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
        grid.innerHTML = fotos.map((f) => {
            const url = supabase.storage.from(BUCKET).getPublicUrl(f.path).data.publicUrl;
            const esPrincipal = f.path === principal;
            return `<article class="gpa-card${esPrincipal ? " principal" : ""}"><img src="${esc(url)}" alt="Foto del producto" loading="lazy"><div>${esPrincipal ? "<strong>★ Foto principal</strong>" : `<button type="button" data-foto-accion="principal" data-path="${esc(f.path)}">Usar como principal</button>`} <button type="button" data-foto-accion="eliminar" data-path="${esc(f.path)}">Eliminar</button></div></article>`;
        }).join("");
    }

    async function subir(archivos) {
        if (!productoId || ocupada || !archivos.length) return;
        ocupada = true;
        mensaje(`Subiendo ${archivos.length} foto${archivos.length === 1 ? "" : "s"}...`);
        let subidas = 0;
        for (const archivo of archivos) {
            if (!TIPOS.has(archivo.type) || archivo.size > 10 * 1024 * 1024) continue;
            const ext = archivo.type === "image/jpeg" ? "jpg" : archivo.type.split("/")[1];
            const uuid = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2);
            const ruta = `${productoId}/${Date.now()}-${uuid}.${ext}`;
            const { error } = await supabase.storage.from(BUCKET).upload(ruta, archivo, { upsert: false, contentType: archivo.type, cacheControl: "31536000" });
            if (!error) subidas++;
        }
        const p = await producto(productoId);
        if (subidas > 0 && !p?.imagen_admin_path) {
            const { data } = await supabase.storage.from(BUCKET).list(productoId, { limit: 100 });
            const primera = data?.filter((x) => x.name)?.sort((a, b) => a.name.localeCompare(b.name))[0];
            if (primera) await supabase.from("productos").update({ imagen_admin_path: `${productoId}/${primera.name}` }).eq("id", productoId);
        }
        await cargarFotos(productoId);
        ocupada = false;
        mensaje(`${subidas} foto${subidas === 1 ? " subida" : "s subidas"}.`);
        document.getElementById("actualizar-listado")?.click();
    }

    async function hacerPrincipal(path) {
        if (!path || ocupada || !productoId) return;
        ocupada = true;
        await supabase.from("productos").update({ imagen_admin_path: path }).eq("id", productoId);
        await cargarFotos(productoId);
        ocupada = false;
        mensaje("Foto principal actualizada.");
        document.getElementById("actualizar-listado")?.click();
    }

    async function eliminarFoto(path) {
        if (!path || ocupada || !productoId || !confirm("¿Eliminar esta foto del producto?")) return;
        ocupada = true;
        const p = await producto(productoId);
        const eraPrincipal = p?.imagen_admin_path === path;
        const { error } = await supabase.storage.from(BUCKET).remove([path]);
        if (!error && eraPrincipal) {
            const siguiente = fotos.find((x) => x.path !== path);
            await supabase.from("productos").update({ imagen_admin_path: siguiente?.path || null }).eq("id", productoId);
        }
        await cargarFotos(productoId);
        ocupada = false;
        mensaje(error ? "No se pudo eliminar la foto." : "Foto eliminada.");
        document.getElementById("actualizar-listado")?.click();
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
})();
