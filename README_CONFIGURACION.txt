RE ORGÁNICO — PANEL ADMINISTRATIVO SEGURO
==========================================

ESTRUCTURA
----------
index.html                 Página pública
style.css                  Diseño de la página pública
script.js                  Catálogo, carrito y WhatsApp
supabase-config.js         Conexión pública y segura con Supabase
setup-supabase.sql         Tablas y reglas de seguridad
admin/index.html           Inicio de sesión y panel privado
admin/admin.css            Diseño del panel
admin/admin.js             Autenticación y administración del catálogo

QUÉ CAMBIÓ
----------
- El botón Administrar fue eliminado de la página pública.
- El panel quedó en /admin/.
- El administrador debe iniciar sesión con correo y contraseña.
- Los permisos se validan en la base de datos, no solo en JavaScript.
- Los clientes pueden leer el catálogo, pero no agregar, editar ni eliminar productos.
- Los cambios del administrador se guardan en Supabase y aparecen en la página pública.

CONFIGURACIÓN PASO A PASO
-------------------------
1. Crea un proyecto en https://supabase.com

2. Abre Supabase > SQL Editor.
   Copia y ejecuta todo el contenido de setup-supabase.sql.

3. Abre Authentication > Users > Add user.
   Crea el correo y la contraseña del administrador.
   No agregues un formulario de registro público a la página.

4. Vuelve al final de setup-supabase.sql.
   Cambia TU_CORREO_ADMIN@EJEMPLO.COM por el correo creado.
   Ejecuta únicamente el INSERT indicado para autorizarlo.

5. Abre Project Settings > API.
   Copia Project URL y anon public key.

6. Abre supabase-config.js y reemplaza:
   PEGA_AQUI_TU_SUPABASE_URL
   PEGA_AQUI_TU_SUPABASE_ANON_KEY

7. Nunca uses la clave service_role dentro de HTML o JavaScript.

8. Abre la página usando Live Server en Visual Studio Code.
   La tienda pública estará en index.html.
   El panel privado estará en admin/index.html.

PRUEBA DE SEGURIDAD
-------------------
- Sin iniciar sesión: se puede ver el catálogo, pero no modificarlo.
- Con una cuenta que no está en admin_users: el panel rechaza el acceso.
- Con la cuenta registrada en admin_users: se pueden administrar los productos.

PUBLICACIÓN
-----------
Cuando subas la carpeta completa a Netlify, Vercel u otro hosting estático:
- Página pública: https://tudominio.cl/
- Panel privado: https://tudominio.cl/admin/

Aunque una persona descubra la dirección /admin/, no podrá modificar productos sin:
1. Un usuario válido de Supabase.
2. Una contraseña correcta.
3. Su ID registrado en la tabla admin_users.
