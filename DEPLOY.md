# Desplegar Medio Menor en Hostinger (Web Apps con Git)

Arquitectura real usada en Hostinger: **dos "Web Apps" separadas**, ambas conectadas al mismo
repo de GitHub (`https://github.com/wisepy/medio-menor-app.git`, rama `main`) con auto-deploy —
cada `git push` a `main` las reconstruye solas, sin tocar SSH ni terminal.

- **Frontend** (`mediomenor.idweb.cl`): Root directory `./`, detecta Vite, sirve `dist/`.
- **Backend** (`api.idweb.cl` u otro subdominio): Root directory `server`, detecta Node/Express,
  corre `server/index.js` como proceso.

El backend se auto-configura solo la primera vez que arranca (crea las tablas y tu cuenta de
educadora) usando variables de entorno — no hace falta correr ningún comando manual.

## 1. Base de datos MySQL

En hPanel: **Bases de datos → Administrar MySQL**, crea la base y su usuario (o usa la que ya
tengas: `u362750072_mediomenor` / `u362750072_mediomenoruser`). No hace falta importar
`schema.sql` a mano — el backend lo crea solo al arrancar.

## 2. App del backend (Web App con Root directory = `server`)

1. Crea el subdominio para la API (ej. `api.idweb.cl`) en **Dominios → Subdominios**.
2. En **Websites → Crear Web App**, conecta el mismo repo de GitHub, rama `main`, y en
   **Root directory pon `server`** (no `./`). Debería detectarlo como app Node.js/Express, no
   como sitio estático.
3. En **Environment variables** de esta app, agrega:
   ```
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=u362750072_mediomenoruser
   DB_PASSWORD=Mediomenor2026
   DB_NAME=u362750072_mediomenor
   JWT_SECRET=a254e209a3d62923e7c1ccf558e244f2e2dc4fad1f68f04163f1f07116c00c29e690f65bc65050dfe3c39f2c353fc2fd
   CORS_ORIGIN=https://mediomenor.idweb.cl
   EDUCADORA_NAME=Juan Aceituno
   EDUCADORA_EMAIL=jaceituno89@gmail.com
   EDUCADORA_PASSWORD=xyc8F55fdWCGfy
   ```
   Las tres variables `EDUCADORA_*` solo importan la **primera vez** que arranca: si no existe
   todavía ninguna cuenta de educadora, el backend crea una con esos datos. En arranques
   posteriores no hace nada (no duplica ni resetea la cuenta).
4. Despliega/reinicia. Verifica `https://api.idweb.cl/api/health` → `{"ok":true}`.

## 3. App del frontend (la que ya tienes en `mediomenor.idweb.cl`)

1. En **Environment variables** de esa app, agrega o edita:
   ```
   VITE_API_URL=https://api.idweb.cl
   ```
2. **Redeploy** desde la pestaña Deployments (el valor se hornea en el build, necesita
   reconstruir para tomarlo).

## 4. Ya funcional

Entra a `https://mediomenor.idweb.cl`, inicia sesión con la cuenta de educadora del paso 2, y
desde **Más → Panel Educadora**:
- **Familias → Agregar familia**: crea una cuenta real por cada apoderado (nombre, correo,
  contraseña inicial, nombre del niño/a).
- **Subir foto del día**, **Crear comunicado**, **Crear evento**, **Votaciones**, **Asignar
  directiva**: todo desde ahí, sin datos de ejemplo de por medio.

## Actualizar el código

Solo `git push` a `main`. Ambas Web Apps (frontend y backend) se reconstruyen y reinician solas.

## Verificación

- Login real funciona y las páginas cargan datos desde `/api/...` (ver pestaña Network,
  llamadas a `https://api.idweb.cl/api/...` con status 200).
- Subir una foto o documento y confirmar que el archivo queda accesible en
  `https://api.idweb.cl/uploads/...`.
- `manifest.webmanifest` del frontend carga los íconos (`/icons/icon-192.png`,
  `/icons/icon-512.png`) sin error 404.

## Notas

- Si tu plan de Hostinger reinicia el sistema de archivos del backend entre despliegues,
  `server/uploads/` (fotos y documentos subidos) se perdería — considera moverlo a un volumen
  persistente si eso te pasa.
- `server/seed.js` (datos de demo con familias falsas) y `server/bootstrap.js` (variante manual
  del auto-bootstrap) siguen disponibles para desarrollo local, pero no se usan en este flujo de
  despliegue.

## Alternativa: un solo dominio

Si más adelante tu plan de Hostinger permite un "Node.js App" clásico (proceso persistente con
acceso SSH, no solo Web App con Git), se puede volver a servir todo desde un solo dominio: el
mismo backend Express puede servir también el frontend compilado (`dist/`) si lo encuentra junto
a `server/` — el código ya lo soporta, solo cambiaría dónde y cómo se despliega.
