"use strict";
(() => {
    const BUCKET = "productos";
    const TIPOS = new Set(["image/jpeg", "image/png", "image/webp"]);
    const MAX_FOTO = 10 * 1024 * 1024;
    let cliente = null;
    let input = null;
    let productoIdActual = "";
    let ocupado = false;

    function iniciar() {
        if (!window.supabase || !window.REORGANICO_SUPABASE) return;

        cliente = window.supabase.createClient(
            window.REORGANICO_SUPABASE.url,
            window.REORGANICO_SUPABASE.anonKey,
            {
                auth: {
                    storage: window.sessionStorage,
                    storageKey: "reorganico-admin-auth-v1",
                    persistSession: true,
                    autoRefreshToken: true,
                    detectSessionInUrl: true,
                    flowType: "pkce"
                }
            }
        );

        crearInput();
        agregarBotones();

        const lista = document.getElementById("lista-admin");
        if (lista) {
            new MutationObserver(agregarBotones).observe(lista, {
                childList: true,
                subtree: true
            });

            lista.addEventListener("click", (evento) => {
                const boton = evento.target.closest("[data-agregar-fotos-producto]");
                if (!boton) return;
                evento.preventDefault();
                evento.stopPropagation();
                if (ocupado) return;
                productoIdActual = boton.dataset.agregarFotosProducto || "";
                if (productoIdActual) input.click();
            });
        }

        input.addEventListener("change", () => {
            const archivos = Array.from(input.files || []);
            input.value = "";
            subirFotos(archivos, productoIdActual);
        });
    }

    function crearInput() {
        input = document.createElement("input");
        input.type = "file";
        input.accept = "image/jpeg,image/png,image/webp";
        input.multiple = true;
        input.hidden = true;
        input.id = "fotos-directas-producto";
        document.body.appendChild(input);
    }

    function agregarBotones() {
        const lista = document.getElementById("lista-admin");
        if (!lista) return;

        lista.querySelectorAll(".producto-admin").forEach((tarjeta) => {
            const acciones = tarjeta.querySelector(".producto-admin-acciones");
            if (!acciones || acciones.querySelector("[data-agregar-fotos-producto]")) return;

            const editar = acciones.querySelector('[data-accion="editar"][data-id]');
            const id = editar?.dataset.id || "";
            if (!id) return;

            const boton = document.createElement("button");
            boton.type = "button";
            boton.dataset.agregarFotosProducto = id;
            boton.textContent = "📸 Agregar fotos";
            boton.title = "Agregar varias fotos a este producto";
            boton.className = "boton-agregar-fotos-directo";
            acciones.insertBefore(boton, editar);
        });
    }

    async function subirFotos(archivos, id) {
        if (!cliente || !id || ocupado || !archivos.length) return;

        const validos = archivos.filter((archivo) =>
            TIPOS.has(archivo.type) && archivo.size <= MAX_FOTO
        );

        if (!validos.length) {
            alert("Selecciona imágenes JPG, PNG o WEBP de máximo 10 MB por foto.");
            return;
        }

        ocupado = true;
        const boton = document.querySelector(`[data-agregar-fotos-producto="${cssEscape(id)}"]`);
        const textoOriginal = boton?.textContent || "📸 Agregar fotos";
        if (boton) {
            boton.disabled = true;
            boton.textContent = `Subiendo ${validos.length} foto${validos.length === 1 ? "" : "s"}...`;
        }

        let subidas = 0;
        for (const archivo of validos) {
            const extension = archivo.type === "image/jpeg"
                ? "jpg"
                : archivo.type.split("/")[1];
            const nombre = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${extension}`;
            const ruta = `${id}/${nombre}`;

            const { error } = await cliente.storage
                .from(BUCKET)
                .upload(ruta, archivo, {
                    cacheControl: "31536000",
                    upsert: false,
                    contentType: archivo.type
                });

            if (!error) subidas += 1;
            else console.error("No se pudo subir la foto:", error);
        }

        if (subidas > 0) {
            const { data: producto } = await cliente
                .from("productos")
                .select("imagen_admin_path")
                .eq("id", id)
                .maybeSingle();

            if (!producto?.imagen_admin_path) {
                const { data: fotos } = await cliente.storage
                    .from(BUCKET)
                    .list(id, { limit: 100, sortBy: { column: "name", order: "asc" } });

                const primera = (fotos || []).find((foto) => foto.name);
                if (primera) {
                    await cliente
                        .from("productos")
                        .update({ imagen_admin_path: `${id}/${primera.name}` })
                        .eq("id", id);
                }
            }
        }

        ocupado = false;
        if (boton) {
            boton.disabled = false;
            boton.textContent = textoOriginal;
        }

        if (subidas === validos.length) {
            alert(`${subidas} foto${subidas === 1 ? " agregada" : "s agregadas"} correctamente al producto.`);
        } else {
            alert(`${subidas} foto${subidas === 1 ? " agregada" : "s agregadas"}. ${validos.length - subidas} no se pudo subir.`);
        }

        document.getElementById("actualizar-listado")?.click();
    }

    function cssEscape(valor) {
        if (window.CSS?.escape) return window.CSS.escape(String(valor));
        return String(valor).replace(/[^a-zA-Z0-9_-]/g, "\\$&");
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", iniciar, { once: true });
    } else {
        iniciar();
    }
})();
