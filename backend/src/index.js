import express from "express";
import { PORT } from "./config.js";
import mainRoutes from "./api/v1/routes/index.js";
import morgan from "morgan";

const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use("/v1", mainRoutes);

// app.get('/health', (_, res) => {
// 	res.json({ status: 'OK' });
// });

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
