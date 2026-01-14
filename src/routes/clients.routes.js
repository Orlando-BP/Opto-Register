import { Router } from "express";
import clients from "../controllers/clients.controller.js";

const router = Router();

router.get("/", clients.readAll);
router.get("/:id", clients.readOne);
router.post("/", clients.create);
router.patch("/:id", clients.update);
router.put("/:id", clients.replace);
router.delete("/:id", clients.delete);
export default router;