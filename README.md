# Medio Menor

App para el curso "Medio Menor" de My Little World: comunicados, agenda, fotos, tesorería,
votaciones, marketplace, documentos y gestión de familias/directiva.

- **Frontend**: React 19 + Vite + React Router, PWA instalable (`vite-plugin-pwa`).
- **Backend**: Node.js + Express (`server/`), autenticación JWT.
- **Base de datos**: MySQL/MariaDB.

## Desarrollo local

### 1. Base de datos + backend

```bash
cd server
npm install
cp .env.example .env      # ajusta DB_HOST/DB_USER/DB_PASSWORD/DB_NAME/JWT_SECRET
npm run seed               # crea las tablas y carga datos de demo (solo la primera vez)
npm run dev                 # http://localhost:4000
```

El seed crea dos cuentas de prueba:

| Rol        | Correo                        | Contraseña |
|------------|-------------------------------|------------|
| Educadora  | educadora@mylittleworld.cl    | educa1234  |
| Apoderado  | apoderado@email.com           | demo1234   |

### 2. Frontend

```bash
npm install
cp .env.example .env       # VITE_API_URL apuntando al backend (http://localhost:4000 por defecto)
npm run dev                  # http://localhost:5173
```

## Estructura del backend

- `server/schema.sql` — DDL completo (ejecutar una sola vez, o dejar que `npm run seed` lo haga).
- `server/seed.js` — crea la base si no existe, aplica el esquema y carga datos de demo.
- `server/routes/*.js` — un router por dominio (auth, announcements, events, photos, treasury,
  votes, marketplace, documents, community, families, children, directiva, notifications).
- `server/uploads/` — archivos subidos (fotos, documentos), servidos en `/uploads/...`.

## Despliegue en Hostinger (Cloud Professional)

Ver [`DEPLOY.md`](DEPLOY.md) para el checklist paso a paso: creación de la base MySQL en hPanel,
importación del esquema, configuración de la app Node.js del backend y publicación del frontend.
