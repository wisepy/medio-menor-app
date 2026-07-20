# Desplegar Medio Menor en Hostinger Cloud Professional

Este checklist asume un plan Hostinger Cloud Professional, que soporta bases de datos MySQL y
apps Node.js desde hPanel. Sigue el orden: **base de datos → backend → frontend**.

## 1. Base de datos MySQL

1. En hPanel, ve a **Bases de datos → Administrar MySQL** y crea una nueva base (ej.
   `u123456789_medio_menor`), con su usuario y contraseña. Guarda esos tres datos.
2. Abre **phpMyAdmin** para esa base y usa la pestaña **Importar** para subir
   `server/schema.sql`. Esto crea todas las tablas.
3. No hace falta correr `seed.js` en producción salvo que quieras los datos de demo — en ese
   caso, ejecuta el contenido de `server/seed.js` manualmente ajustando las credenciales, o
   pide que se cree un usuario educadora real desde el primer arranque (ver paso 4).

## 2. Backend (Node.js / Express)

1. Sube la carpeta `server/` completa al servidor (Git, FTP, o el gestor de archivos de hPanel).
2. En hPanel, ve a **Avanzado → Node.js** y crea una nueva aplicación:
   - Directorio de la aplicación: la carpeta donde subiste `server/`.
   - Archivo de inicio (startup file): `index.js`.
   - Versión de Node: 18 o superior.
3. En la sección de variables de entorno de esa app Node.js, agrega las mismas claves de
   `server/.env.example`, con los datos reales:
   - `DB_HOST` (normalmente `localhost` si la BD está en el mismo servidor)
   - `DB_PORT` (3306)
   - `DB_USER`, `DB_PASSWORD`, `DB_NAME` (los del paso 1)
   - `JWT_SECRET` (genera uno largo y aleatorio, no reutilices el de desarrollo)
   - `CORS_ORIGIN` (el dominio final del frontend, ej. `https://app.tudominio.cl`)
4. Antes de arrancar la app por primera vez, entra por SSH (o la terminal de hPanel) y corre
   `npm install` dentro de `server/`. Si quieres precargar datos de demo, corre `node seed.js`
   una sola vez (usa las variables de entorno que configuraste).
5. Inicia/reinicia la app Node.js desde hPanel. Verifica que responde en
   `https://tu-dominio-o-subdominio/api/health` → `{"ok":true}`.

## 3. Frontend (build estático)

1. En tu máquina (o en un pipeline de CI), configura `VITE_API_URL` apuntando a la URL pública
   del backend del paso 2, y corre:
   ```bash
   npm install
   npm run build
   ```
2. Sube el contenido de `dist/` a `public_html` (o al subdominio que uses para el frontend) vía
   el Administrador de Archivos de hPanel o FTP/Git.
3. Como es una SPA con rutas del lado del cliente, agrega un archivo `.htaccess` en la misma
   carpeta que `index.html` para que todas las rutas resuelvan al `index.html`:
   ```apache
   <IfModule mod_rewrite.c>
     RewriteEngine On
     RewriteBase /
     RewriteRule ^index\.html$ - [L]
     RewriteCond %{REQUEST_FILENAME} !-f
     RewriteCond %{REQUEST_FILENAME} !-d
     RewriteRule . /index.html [L]
   </IfModule>
   ```
4. Activa HTTPS gratuito (Let's Encrypt) desde hPanel para el dominio del frontend y del backend.

## 4. Verificación final

- Entra al dominio del frontend, inicia sesión con una cuenta real (o la de demo si sembraste
  datos), y confirma que las páginas cargan datos desde el backend (Network tab → llamadas a
  `/api/...` con status 200).
- Prueba subir una foto o documento y confirma que el archivo queda accesible en
  `https://tu-backend/uploads/...`.
- Si vas a instalar la PWA, confirma que `manifest.webmanifest` carga los íconos
  (`/icons/icon-192.png`, `/icons/icon-512.png`) sin error 404.

## Notas

- Cambia las contraseñas de demo (`educa1234` / `demo1234`) antes de dar acceso real a
  apoderados y educadoras.
- Considera mover `server/uploads/` a un volumen persistente si tu plan de Hostinger reinicia el
  sistema de archivos de la app Node.js entre despliegues.
