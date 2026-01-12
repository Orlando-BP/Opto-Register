import { Router } from "express";
import clientes from "../controllers/clients.controller.js";

const router = Router();

router.get("/clients", clientes.readAll);
router.get("/clients/:id", clientes.readOne);
router.post("/clients", clientes.create);
router.patch("/clients/:id", clientes.update);
router.put("/clients/:id", clientes.replace);
router.delete("/clients/:id", clientes.delete);

export default router;