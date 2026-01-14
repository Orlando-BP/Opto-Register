import { Router } from "express";

import clientsRoutes from "@/routes/clients.routes.js";
import salesNotesRoutes from "@/routes/salesNotes.routes.js";
import calibrationsRoutes from "@/routes/calibrations.routes.js";
import productsRoutes from "@/routes/products.routes.js";

const router = Router();

router.use("/clients", clientsRoutes);
router.use("/salesnotes", salesNotesRoutes);
router.use("/calibrations", calibrationsRoutes);
router.use("/products", productsRoutes);

export default router;
