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
        configurarCarruselSoloFotos();

        const lista = document.getElementById("lista-admin");
        if (lista) {
            new MutationObserver(() => {
                agregarBotones();
                configurarCarruselSoloFotos();
            }).observe(lista, {
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

    function configurarCarruselSoloFotos() {
        const seccion = document.getElementById("seccion-galeria");
        const destino = document.getElementById("galeria-destino");
        const formulario = document.getElementById("formulario-galeria");
        if (!seccion || !destino || !formulario) return;

        const blogActivo = Boolean(document.querySelector('[data-seccion-panel="blog"].activa'));
        const carruselActivo = Boolean(document.querySelector('[data-seccion-panel="carrusel"].activa'));

        if (blogActivo) destino.value = "blog";
        else if (carruselActivo) destino.value = "carrusel";

        const esCarrusel = destino.value === "carrusel" && !blogActivo;
        seccion.classList.toggle("modo-carrusel-solo-fotos", esCarrusel);

        const titulo = document.getElementById("titulo-formulario-galeria");
        const modo = document.getElementById("modo-galeria");
        const ayuda = document.getElementById("ayuda-destino-contenido");
        const boton = document.getElementById("guardar-contenido");
        const archivo = document.getElementById("galeria-archivo");
        const campoTitulo = document.getElementById("galeria-titulo");
        const campoDescripcion = document.getElementById("galeria-descripcion");
        const campoOrden = document.getElementById("galeria-orden");
        const campoActivo = document.getElementById("galeria-activo");

        if (esCarrusel) {
            if (modo) modo.textContent = "Carrusel principal";
            if (titulo) titulo.textContent = "Subir fotos al carrusel";
            if (ayuda) ayuda.textContent = "Selecciona una o varias fotos. Se agregarán directamente al carrusel principal.";
            if (boton) boton.textContent = "📸 Subir fotos";
            if (archivo) {
                archivo.accept = "image/jpeg,image/png,image/webp";
                archivo.multiple = true;
            }

            ocultarCampo("galeria-destino");
            ocultarCampo("galeria-titulo");
            ocultarCampo("galeria-descripcion");
            ocultarCampo("galeria-orden");
            ocultarCampo("galeria-activo");

            if (campoTitulo) campoTitulo.required = false;
            if (campoDescripcion) campoDescripcion.required = false;
            if (campoOrden) campoOrden.required = false;
            if (campoActivo) campoActivo.checked = true;
            return;
        }

        if (blogActivo || destino.value === "blog") {
            if (modo) modo.textContent = "Nuestro Blog";
            if (titulo) titulo.textContent = "Publicar en Nuestro Blog";
            if (ayuda) ayuda.textContent = "Completa el título y la descripción, luego selecciona una foto o video para publicar la entrada.";
            if (boton) boton.textContent = "📝 Publicar contenido";
            if (archivo) {
                archivo.accept = "image/jpeg,image/png,image/webp,video/mp4,video/webm";
                archivo.multiple = false;
            }

            mostrarCampo("galeria-destino");
            mostrarCampo("galeria-titulo");
            mostrarCampo("galeria-descripcion");
            mostrarCampo("galeria-orden");
            mostrarCampo("galeria-activo");

            if (campoTitulo) {
                campoTitulo.required = true;
                campoTitulo.placeholder = "Ej: Cómo hacer compost en casa";
            }
            if (campoDescripcion) {
                campoDescripcion.required = true;
                campoDescripcion.placeholder = "Escribe una descripción para la publicación del blog";
            }
            if (campoOrden) campoOrden.required = false;
            if (campoActivo) campoActivo.checked = true;
        }
    }

    function ocultarCampo(id) {
        const elemento = document.getElementById(id);
        const campo = elemento?.closest(".campo");
        if (campo) campo.hidden = true;
    }

    function mostrarCampo(id) {
        const elemento = document.getElementById(id);
        const campo = elemento?.closest(".campo");
        if (campo) campo.hidden = false;
    }

    async function subirFotosCarrusel(archivos) {
        const validos = archivos.filter((archivo) =>
            TIPOS.has(archivo.type) && archivo.size <= MAX_FOTO
        );

        if (!validos.length) {
            alert("Selecciona una o varias fotos JPG, PNG o WEBP de máximo 10 MB por foto.");
            return;
        }

        const boton = document.getElementById("guardar-contenido");
        const mensaje = document.getElementById("mensaje-galeria");
        if (boton) {
            boton.disabled = true;
            boton.textContent = `Subiendo ${validos.length} foto${validos.length === 1 ? "" : "s"}...`;
        }

        try {
            const { data: ultimo } = await cliente
                .from("contenido_galeria")
                .select("orden")
                .eq("destino", "carrusel")
                .order("orden", { ascending: false })
                .limit(1)
                .maybeSingle();

            let orden = Number(ultimo?.orden);
            if (!Number.isFinite(orden)) orden = 0;

            let subidas = 0;
            for (const archivo of validos) {
                const extension = archivo.type === "image/jpeg"
                    ? "jpg"
                    : archivo.type === "image/png"
                    ? "png"
                    : "webp";
                const aleatorio = crypto.randomUUID
                    ? crypto.randomUUID()
                    : Math.random().toString(36).slice(2);
                const ruta = `fotos/${Date.now()}-${aleatorio}.${extension}`;

                const { error: errorSubida } = await cliente.storage
                    .from("galeria")
                    .upload(ruta, archivo, {
                        cacheControl: "31536000",
                        upsert: false,
                        contentType: archivo.type
                    });

                if (errorSubida) {
                    console.error("No se pudo subir la foto del carrusel:", errorSubida);
                    continue;
                }

                orden += 1;
                const { error: errorRegistro } = await cliente
                    .from("contenido_galeria")
                    .insert({
                        tipo: "foto",
                        titulo: `Foto carrusel ${orden}`,
                        descripcion: null,
                        archivo_path: ruta,
                        activo: true,
                        orden,
                        destino: "carrusel"
                    });

                if (errorRegistro) {
                    console.error("No se pudo registrar la foto del carrusel:", errorRegistro);
                    await cliente.storage.from("galeria").remove([ruta]);
                    continue;
                }

                subidas += 1;
            }

            if (mensaje) {
                mensaje.textContent = subidas === validos.length
                    ? `${subidas} foto${subidas === 1 ? " subida" : "s subidas"} correctamente al carrusel.`
                    : `${subidas} foto${subidas === 1 ? " subida" : "s subidas"}. Revisa los archivos que no se pudieron cargar.`;
                mensaje.classList.toggle("exito", subidas > 0);
            }

            if (subidas > 0) {
                document.getElementById("actualizar-galeria")?.click();
            }
        } finally {
            if (boton) {
                boton.disabled = false;
                boton.textContent = "📸 Subir fotos";
            }
        }
    }

    function interceptarCarrusel() {
        const formulario = document.getElementById("formulario-galeria");
        const destino = document.getElementById("galeria-destino");
        const archivo = document.getElementById("galeria-archivo");
        if (!formulario || !destino || !archivo || formulario.dataset.carruselFotosConectado) return;

        formulario.dataset.carruselFotosConectado = "1";
        formulario.addEventListener("submit", async (evento) => {
            if (destino.value !== "carrusel") return;
            evento.preventDefault();
            evento.stopImmediatePropagation();
            const archivos = Array.from(archivo.files || []);
            await subirFotosCarrusel(archivos);
        }, true);

        destino.addEventListener("change", () => {
            configurarCarruselSoloFotos();
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
        document.addEventListener("DOMContentLoaded", () => {
            iniciar();
            interceptarCarrusel();
        }, { once: true });
    } else {
        iniciar();
        interceptarCarrusel();
    }

    setInterval(() => {
        configurarCarruselSoloFotos();
        interceptarCarrusel();
    }, 500);
})();