import { Router } from "express";

import adminsRoutes from "../../../routes/admins.controller.js";
import clientsRoutes from "../../../routes/clients.routes.js";
import salesNotesRoutes from "../../../routes/salesNotes.routes.js";
import calibrationsRoutes from "../../../routes/calibrations.routes.js";
import productsRoutes from "../../../routes/products.routes.js";
import chatsRoutes from "../../../routes/chats.routes.js";
import messagesRoutes from "../../../routes/messages.routes.js";

const router = Router();

router.use("/admins", adminsRoutes);
router.use("/clients", clientsRoutes);
router.use("/salesNotes", salesNotesRoutes);
router.use("/calibrations", calibrationsRoutes);
router.use("/products", productsRoutes);
router.use("/chats", chatsRoutes);
router.use("/messages", messagesRoutes);

export default router;
