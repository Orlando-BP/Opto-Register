# Frontend

Rápido:

1. Instalar dependencias:

```bash
cd frontend
npm install
```

1. Ejecutar en desarrollo:

```bash
npm run dev
```

1. Abrir en el navegador: `http://localhost:5173`

Notas importantes:

- El formulario hace `POST` a `http://localhost:3000/v1/admins/login`.
- Asegúrate de levantar tu backend (`npm run dev` en la raíz) y habilitar CORS si accedes desde otro origen. Ejemplo en `src/index.js`:

```js
import cors from "cors";
app.use(cors());
```

Si quieres, puedo añadir control de rutas (Dashboard) y manejo de sesión/token (JWT).
