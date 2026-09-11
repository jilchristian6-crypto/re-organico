"use strict";
(() => {
    const BUCKET = "productos";
    const TIPOS_FOTO = new Set(["image/jpeg", "image/png", "image/webp"]);
    const TIPOS_CONTENIDO = new Set([
        "image/jpeg",
        "image/png",
        "image/webp",
        "video/mp4",
        "video/webm"
    ]);
    const MAX_FOTO = 10 * 1024 * 1024;
    const MAX_CONTENIDO = 100 * 1024 * 1024;
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
        configurarFormularioContenido();

        const lista = document.getElementById("lista-admin");
        if (lista) {
            new MutationObserver(() => {
                agregarBotones();
            }).observe(lista, { childList: true, subtree: true });

            lista.addEventListener("click", (evento) => {
                const boton = evento.target.closest("[data-agregar-fotos-producto]");
                if (!boton || ocupado) return;
                evento.preventDefault();
                evento.stopPropagation();
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

    function configurarFormularioContenido() {
        const formulario = document.getElementById("formulario-galeria");
        const destino = document.getElementById("galeria-destino");
        const archivo = document.getElementById("galeria-archivo");
        if (!formulario || !destino || !archivo || formulario.dataset.multimediaConectado) return;

        formulario.dataset.multimediaConectado = "1";
        formulario.addEventListener("submit", async (evento) => {
            if (destino.value === "carrusel") {
                evento.preventDefault();
                evento.stopImmediatePropagation();
                await subirContenidoMultiple("carrusel");
                return;
            }

            if (destino.value === "blog") {
                evento.preventDefault();
                evento.stopImmediatePropagation();
                await subirContenidoMultiple("blog");
            }
        }, true);

        destino.addEventListener("change", actualizarModoContenido);
        actualizarModoContenido();
    }

    function actualizarModoContenido() {
        const destino = document.getElementById("galeria-destino");
        const archivo = document.getElementById("galeria-archivo");
        if (!destino || !archivo) return;

        if (destino.value === "carrusel") {
            archivo.accept = "image/jpeg,image/png,image/webp";
            archivo.multiple = true;
            return;
        }

        if (destino.value === "blog") {
            archivo.accept = "image/jpeg,image/png,image/webp,video/mp4,video/webm";
            archivo.multiple = true;
        }
    }

    async function subirContenidoMultiple(destino) {
        const archivo = document.getElementById("galeria-archivo");
        const titulo = document.getElementById("galeria-titulo")?.value.trim() || "";
        const descripcion = document.getElementById("galeria-descripcion")?.value.trim() || "";
        const boton = document.getElementById("guardar-contenido");
        const mensaje = document.getElementById("mensaje-galeria");
        const archivos = Array.from(archivo?.files || []);

        if (!archivos.length) {
            mostrarMensajeContenido(mensaje, "Selecciona al menos una foto o video.", false);
            return;
        }

        if (destino === "blog" && !titulo) {
            mostrarMensajeContenido(mensaje, "Escribe el título de la publicación.", false);
            return;
        }

        if (destino === "blog" && !descripcion) {
            mostrarMensajeContenido(mensaje, "Escribe la descripción de la publicación.", false);
            return;
        }

        const validos = archivos.filter((item) => {
            const tipos = destino === "blog" ? TIPOS_CONTENIDO : TIPOS_FOTO;
            const maximo = destino === "blog" ? MAX_CONTENIDO : MAX_FOTO;
            return tipos.has(item.type) && item.size <= maximo;
        });

        if (!validos.length) {
            mostrarMensajeContenido(
                mensaje,
                destino === "blog"
                    ? "Los archivos deben ser JPG, PNG, WEBP, MP4 o WEBM y pesar máximo 100 MB cada uno."
                    : "Selecciona fotos JPG, PNG o WEBP de máximo 10 MB cada una.",
                false
            );
            return;
        }

        if (boton) {
            boton.disabled = true;
            boton.textContent = `Publicando ${validos.length} archivo${validos.length === 1 ? "" : "s"}...`;
        }

        try {
            const { data: ultimo, error: errorOrden } = await cliente
                .from("contenido_galeria")
                .select("orden")
                .eq("destino", destino)
                .order("orden", { ascending: false })
                .limit(1)
                .maybeSingle();

            if (errorOrden) throw errorOrden;

            let orden = Number(ultimo?.orden);
            if (!Number.isFinite(orden)) orden = 0;

            let subidas = 0;

            for (const archivoActual of validos) {
                const extension = obtenerExtension(archivoActual);
                const aleatorio = crypto.randomUUID
                    ? crypto.randomUUID()
                    : Math.random().toString(36).slice(2);
                const ruta = `fotos/${Date.now()}-${aleatorio}.${extension}`;

                const { error: errorSubida } = await cliente.storage
                    .from("galeria")
                    .upload(ruta, archivoActual, {
                        cacheControl: "31536000",
                        upsert: false,
                        contentType: archivoActual.type
                    });

                if (errorSubida) {
                    console.error("No se pudo subir contenido multimedia:", errorSubida);
                    continue;
                }

                orden += 1;
                const tipo = archivoActual.type.startsWith("video/") ? "video" : "foto";
                const registro = {
                    tipo,
                    titulo: destino === "blog" ? titulo : `Foto carrusel ${orden}`,
                    descripcion: destino === "blog" ? descripcion : null,
                    archivo_path: ruta,
                    activo: true,
                    orden,
                    destino
                };

                const { error: errorRegistro } = await cliente
                    .from("contenido_galeria")
                    .insert(registro);

                if (errorRegistro) {
                    console.error("No se pudo registrar contenido multimedia:", errorRegistro);
                    await cliente.storage.from("galeria").remove([ruta]);
                    continue;
                }

                subidas += 1;
            }

            if (subidas > 0) {
                mostrarMensajeContenido(
                    mensaje,
                    `${subidas} archivo${subidas === 1 ? "" : "s"} publicado${subidas === 1 ? "" : "s"} correctamente en ${destino === "blog" ? "Nuestro Blog" : "el carrusel"}.`,
                    true
                );

                archivo.value = "";
                document.getElementById("actualizar-galeria")?.click();
            } else {
                mostrarMensajeContenido(mensaje, "No se pudo publicar ningún archivo. Revisa la sesión y los permisos.", false);
            }
        } catch (error) {
            console.error("Error publicando contenido multimedia:", error);
            mostrarMensajeContenido(mensaje, error?.message || "No se pudo publicar el contenido.", false);
        } finally {
            if (boton) {
                boton.disabled = false;
                boton.textContent = destino === "blog" ? "📝 Publicar contenido" : "📸 Subir fotos";
            }
        }
    }

    function obtenerExtension(archivo) {
        if (archivo.type === "image/jpeg") return "jpg";
        if (archivo.type === "image/png") return "png";
        if (archivo.type === "image/webp") return "webp";
        if (archivo.type === "video/mp4") return "mp4";
        if (archivo.type === "video/webm") return "webm";
        return "bin";
    }

    function mostrarMensajeContenido(elemento, texto, exito) {
        if (!elemento) return;
        elemento.textContent = texto;
        elemento.classList.toggle("exito", Boolean(exito));
    }

    async function subirFotos(archivos, id) {
        if (!cliente || !id || ocupado || !archivos.length) return;

        const validos = archivos.filter((archivo) =>
            TIPOS_FOTO.has(archivo.type) && archivo.size <= MAX_FOTO
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
            const extension = archivo.type === "image/jpeg" ? "jpg" : archivo.type.split("/")[1];
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