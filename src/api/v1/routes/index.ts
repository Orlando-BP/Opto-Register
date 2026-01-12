import { Router } from "express";

import usuariosRoutes from "@/routes/clients.routes.js";

const router = Router();

router.use("/users", usuariosRoutes);

export default router;
