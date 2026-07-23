# Desplegar Medio Menor en Hostinger (Web App con Git)

Arquitectura: **una sola Web App** en hPanel, conectada por Git a
`https://github.com/wisepy/medio-menor-app.git` (rama `main`), con auto-deploy en cada
`git push`. Root directory de esa app: **`server`**. Framework preset: **Express**.

El frontend vive en `server/client/` (subcarpeta de `server/`, no un directorio hermano) porque
esta Web App solo tiene acceso a lo que está dentro del Root directory que le indiques — nada
fuera de `server/` existe en ese entorno, ni siquiera durante el build. El `postinstall` de
`server/package.json` instala y compila `server/client/`, y copia el resultado a `server/dist/`;
`server/index.js` sirve ese `dist/` automáticamente si lo encuentra (frontend + API en el mismo
dominio, sin CORS).

## 1. Base de datos MySQL

1. hPanel → Bases de datos → Administrar MySQL → crea la base y su usuario.
2. hPanel → Bases de datos → **MySQL remoto** → agrega acceso remoto ("Cualquier host") para esa
   base. Es necesario: esta Web App corre en un contenedor aparte del servidor de MySQL, no
   comparten "localhost".
3. Anota el **host real** de tu MySQL (en esa misma pantalla de "MySQL remoto"; algo como
   `srv1072.hstgr.io`, **no** `localhost`).
4. No hace falta importar `schema.sql` a mano — el backend lo crea solo al arrancar
   (`autoBootstrap.js`).

## 2. Crear la Web App

1. hPanel → Websites → Crear Web App → conecta el repo de GitHub, rama `main`.
2. **Root directory: `server`**.
3. **Framework preset: Express** (no "Vite" — si aparece así por defecto, cámbialo).
4. **Archivo de entrada: `index.js`** (no `server.js`, que es el valor por defecto).
5. Dominio: el que quieras usar para toda la app (ej. `mediomenor.idweb.cl`).

## 3. Variables de entorno de esa Web App

```
DB_HOST=srv1072.hstgr.io    # el host real del paso 1.3, NO "localhost"
DB_PORT=3306
DB_USER=u362750072_mediomenoruser
DB_PASSWORD=Mediomenor2026
DB_NAME=u362750072_mediomenor
JWT_SECRET=<una cadena larga y aleatoria>
VITE_API_URL=https://mediomenor.idweb.cl   # el mismo dominio del paso 2.5
EDUCADORA_NAME=Nombre real de la educadora
EDUCADORA_EMAIL=correo-real@dominio.cl
EDUCADORA_PASSWORD=una-clave-real
```

- `VITE_API_URL` tiene que ser la URL completa del dominio (no vacía — el panel no permite
  guardar un valor vacío). Al ser el mismo dominio, el resultado es igual a same-origin.
- `EDUCADORA_*` solo importan la **primera vez** que arranca el backend: si no existe ninguna
  cuenta de educadora todavía, crea una con esos datos. Si ya existe, no hace nada — no hace
  falta quitarlas después. La educadora puede cambiar su propio nombre/correo/contraseña más
  tarde desde **Más → Perfil** en la app (no depende de estas variables).

## 4. Desplegar y verificar

1. Dale deploy/redeploy. El build debe mostrar: instalación de `server/` (~7 paquetes), luego el
   `postinstall` instalando y compilando `server/client/` (Vite build), sin errores de `ENOENT`
   ni de módulos faltantes.
2. Revisa **Runtime logs** (con "En tiempo real" activado) — debe aparecer
   `Medio Menor API escuchando en http://localhost:<puerto>` y, la primera vez,
   `Cuenta de educadora creada automáticamente: <correo>`.
3. Verifica `https://tu-dominio/api/health` → `{"ok":true}`.
4. Verifica `https://tu-dominio/login` → carga la pantalla de login de la app (no "Cannot GET").
5. Inicia sesión con la cuenta de educadora del paso 3, y desde **Más → Panel Educadora**:
   - **Familias → Agregar familia** por cada apoderado real.
   - **Subir foto del día**, **Crear comunicado**, **Crear evento**, **Votaciones**, **Asignar
     directiva** — todo desde ahí.

## Actualizar el código

Solo `git push` a `main`. La Web App se reconstruye y reinicia sola.

## Notas / errores que ya nos pasaron (para no repetirlos)

- **`ERR_REQUIRE_ASYNC_MODULE` / 503 con 0 runtime logs**: el lanzador de Node de Hostinger
  (LiteSpeed) carga `index.js` con `require()`, que no soporta `top-level await`. `index.js` no
  debe tener ningún `await` fuera de una función — `autoBootstrap()` corre como promesa en
  segundo plano después de `app.listen()`, no antes ni con `await` a nivel superior.
- **`DB_HOST=localhost` no conecta**: usa el host remoto real de MySQL (paso 1.3), no
  `localhost` — el backend y la base no comparten host en este tipo de despliegue.
- **`npm --prefix ..` falla con ENOENT**: el contenedor de esta Web App solo contiene lo que está
  dentro de `Root directory` (`server/`) — nada fuera de ahí existe, ni en build ni en runtime.
  Por eso el frontend vive en `server/client/`, no en la raíz del repo.
- **Login pide permiso raro del navegador / "Failed to fetch" a `localhost:4000`**: significa
  que `VITE_API_URL` quedó sin definir (o vacío) al compilar, y el cliente cayó al valor de
  desarrollo. Debe ser la URL completa del dominio de producción.
- Si cambias el "Root directory" o el "Framework preset" de una Web App ya creada y sigue sin
  funcionar (0 runtime logs persistentes), prueba eliminar la app y crearla de nuevo desde cero
  con la configuración correcta desde el principio — los cambios en caliente a veces dejan el
  despliegue en un estado inconsistente.
