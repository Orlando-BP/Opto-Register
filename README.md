# Opto-Register

Proyecto modular para el registro y gestión de clientes (work in progress). Este repositorio contiene dos partes principales:

- backend: API REST en Node.js que gestiona la lógica del negocio y la conexión a la base de datos MySQL.
- frontend: SPA React + Vite que consume la API y ofrece la interfaz administrativa y pública.

Este README explica cómo poner el proyecto en marcha localmente, la estructura principal y notas útiles.

Resumen de contenido

- `backend/` — código del servidor (API). Incluye `server`, `src`, archivos SQL de esquema y respaldos.
- `frontend/` — aplicación web (Vite + React). Contiene hooks, componentes y configuración de build.

Formato de respuestas esperado por los hooks

Los hooks del frontend (`usePost`, `useFetch`) deben recibir respuestas JSON con esta forma:

```json
{
    "status": "200",
    "message": "Login successful",
    "data": {
        "user": { "id": 3, "username": "Ci" }
    }
}
```

Los hooks normalizan `status` (string → número) y exponen `ok` cuando `status === 200`.

Requisitos

- Node.js (recomendado >= 18)
- npm o pnpm
- MySQL / phpMyAdmin para la base de datos local

---

## Backend

Ubicación: `backend/`

Contenido clave:

- `server/` — punto de entrada del servidor (ej. `index.js`).
- `src/` — controladores, rutas y modelos.
- `Base de datos/` — esquemas y respaldos SQL (`Esquema optica_barba_bd .sql`, `Respaldo 13-8-25 optica_barba_bd.sql`).

Instalación y ejecución (local)

1. Abrir terminal en `backend/`:

```bash
cd backend
npm install
```

2. Configurar variables de entorno (si aplica)

- Revisa `src/config.js` o `server/index.js` para saber qué variables necesita la app (puerto, host/usuario/contraseña de MySQL). Crea un archivo `.env` con esas variables si lo requiere.

3. Levantar servidor:

```bash
npm run dev
# o
npm start
```

Notas sobre la base de datos

- Importa el SQL desde phpMyAdmin o usando la CLI de MySQL para restaurar `Esquema optica_barba_bd .sql`.
- Los archivos SQL están en `backend/Base de datos/`.

---

## Frontend

Ubicación: `frontend/`

Stack principal: React, Vite, Tailwind, React Router, React Query.

Instalación y ejecución (local)

1. Abrir terminal en `frontend/`:

```bash
cd frontend
npm install
```

2. Configurar la URL de la API

- Revisa `frontend/src/api/config.ts` para la constante `API_URL`. Ajusta ese valor o crea un mecanismo de entorno para apuntar al backend local (por ejemplo `http://localhost:3000`).

3. Ejecutar en modo desarrollo:

```bash
npm run dev
```

4. Build de producción:

```bash
npm run build
npm run preview
```

Notas de integración

- El frontend usa `fetchApi` como wrapper de `fetch`. Los hooks `usePost` y `useFetch` normalizan la respuesta de la API y devuelven `status`, `message`, `data` y `ok`.
- Para que las notificaciones (toasts) funcionen, monta el componente `Toaster` (ej. en `App.tsx`).

---

## Desarrollo y depuración

- Revisa la consola del navegador y la terminal del servidor para ver peticiones y respuestas.
- Si la API devuelve `status` como string (por ejemplo "200"), los hooks convierten ese valor a número automáticamente.

---

## Archivos importantes

- Backend:
    - `backend/server/index.js` — punto de entrada del servidor.
    - `backend/src/controllers/*` — lógica de endpoints.
    - `backend/Base de datos/` — esquemas y respaldos SQL.

- Frontend:
    - `frontend/src/api/fetchApi.ts` — wrapper de `fetch` usado por los hooks.
    - `frontend/src/hooks/usePost.tsx` — helper para llamadas POST.
    - `frontend/src/hooks/useFetch.tsx` — wrapper sobre React Query (se puede usar como fetch simple).
    - `frontend/src/components/ui/toast.tsx` — primitives de UI para toasts.
    - `frontend/src/components/ui/toaster.tsx` — componente `Toaster` que debe montarse en `App.tsx`.

---

## Siguientes pasos sugeridos

- Añadir un `.env.example` con las variables necesarias para backend y frontend.
- Documentar endpoints principales (login, clientes, productos) extrayéndolos de los controladores.

Si quieres, hago esos ajustes ahora (añadir `.env.example` o documentar endpoints).
