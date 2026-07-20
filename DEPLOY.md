# Desplegar Medio Menor en Hostinger Cloud Professional

Arquitectura elegida: **un solo dominio** (ej. `mediomenor.idweb.cl`) sirviendo todo — el backend
Express corre como la única app Node.js, y esa misma app sirve también los archivos estáticos del
frontend ya compilado (`dist/`). Sin CORS, sin subdominio aparte para la API.

Sigue el orden: **base de datos → build del frontend → app Node.js**.

## 1. Base de datos MySQL

1. En hPanel, ve a **Bases de datos → Administrar MySQL** y crea una nueva base (ej.
   `u123456789_medio_menor`), con su usuario y contraseña. Guarda esos tres datos.
2. Abre **phpMyAdmin** para esa base y usa la pestaña **Importar** para subir
   `server/schema.sql`. Esto crea todas las tablas.
3. No hace falta correr `seed.js` en producción salvo que quieras los datos de demo.

## 2. App Node.js (backend + frontend juntos)

1. En hPanel, ve a **Avanzado → Node.js** y crea una nueva aplicación:
   - Fuente: **Git** → repo `https://github.com/wisepy/medio-menor-app.git`, rama `main`.
   - Directorio de la aplicación: **la raíz del repo** (no `server/`), porque el paso de build
     necesita ver tanto el `package.json` del frontend como el de `server/`.
   - Archivo de inicio (startup file): `server/index.js`.
   - Dominio: `mediomenor.idweb.cl` (el único dominio de la app).
   - Versión de Node: 18 o superior.
2. Variables de entorno de esa app:
   ```
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=u362750072_mediomenoruser
   DB_PASSWORD=Mediomenor2026
   DB_NAME=u362750072_mediomenor
   JWT_SECRET=a254e209a3d62923e7c1ccf558e244f2e2dc4fad1f68f04163f1f07116c00c29e690f65bc65050dfe3c39f2c353fc2fd
   ```
   (`CORS_ORIGIN` y `VITE_API_URL` ya no hacen falta: todo vive en el mismo dominio.)
3. Antes del primer arranque, entra por SSH/terminal de hPanel y corre, **en este orden**:
   ```bash
   # 1. instala y compila el frontend (en la raíz del repo)
   npm install
   npm run build

   # 2. instala las dependencias del backend
   cd server
   npm install

   # 3. crea las tablas + tu cuenta real de educadora (sin datos de demo)
   EDUCADORA_NAME="Tu Nombre" EDUCADORA_EMAIL="tucorreo@tudominio.cl" EDUCADORA_PASSWORD="unaClaveSegura123" node bootstrap.js
   ```
   `bootstrap.js` crea las tablas si no existen y **una sola** cuenta de educadora real con los
   datos que le pases — no inserta familias, comunicados ni fotos de ejemplo. Si vuelves a
   correrlo, detecta que ya existe una educadora y no hace nada (seguro re-ejecutarlo).

   Si en cambio quieres partir viendo la app con datos de ejemplo (útil solo para probar), usa
   `node seed.js` en vez del paso anterior — crea la educadora demo y 3 familias falsas.
4. Inicia/reinicia la app Node.js desde hPanel (startup file `server/index.js`). Verifica:
   - `https://mediomenor.idweb.cl/api/health` → `{"ok":true}`
   - `https://mediomenor.idweb.cl/` → carga la app (React), no un JSON.
5. Inicia sesión con la cuenta de educadora que acabas de crear. Desde **Más → Panel Educadora**:
   - **Familias → Agregar familia**: crea una cuenta real por cada apoderado (nombre, correo,
     contraseña inicial, nombre del niño/a). Cada apoderado inicia sesión con esos datos.
   - **Subir foto del día**: publica la foto/actividad de cada día para las familias.
   - **Crear comunicado**, **Crear evento**, **Votaciones**, **Asignar directiva**: igual, todo
     desde ese panel, ya sin datos de ejemplo de por medio.

## 3. Cuando actualices el código

Cada vez que hagas `git push` a `main`, en el servidor necesitas repetir el build del frontend
(`npm run build` en la raíz) antes de reiniciar la app Node.js — Hostinger hace `git pull` pero no
corre el build automáticamente. Si tu plan permite un "deploy script"/hook en hPanel, agrega ahí
los mismos comandos del paso 2.3.

## 4. Verificación final

- Inicia sesión con una cuenta real (o la de demo si sembraste datos) y confirma que las páginas
  cargan datos desde el backend (Network tab → llamadas a `/api/...` con status 200, mismo origen).
- Prueba subir una foto o documento y confirma que el archivo queda accesible en
  `https://mediomenor.idweb.cl/uploads/...`.
- Confirma que `manifest.webmanifest` carga los íconos (`/icons/icon-192.png`,
  `/icons/icon-512.png`) sin error 404.

## Notas

- Cambia las contraseñas de demo (`educa1234` / `demo1234`) antes de dar acceso real a
  apoderados y educadoras.
- Considera mover `server/uploads/` a un volumen persistente si tu plan de Hostinger reinicia el
  sistema de archivos de la app Node.js entre despliegues.

## Alternativa: dos dominios separados

Si en el futuro prefieres separar frontend y backend (ej. para escalarlos o cachearlos distinto),
se puede volver a esa arquitectura: subdominio propio para la API (`api.idweb.cl`), `CORS_ORIGIN`
apuntando al dominio del frontend, y `VITE_API_URL` en el build del frontend apuntando a ese
subdominio. El código ya soporta ambos modos sin cambios adicionales.
