import { Router } from "express";
import messages from "../controllers/messages.controller.js";

const router = Router();

router.get("/", messages.readAll);
router.get("/:id", messages.readOne);
router.post("/", messages.create);
router.patch("/:id", messages.update);
router.put("/:id", messages.replace);
router.delete("/:id", messages.delete);

export default router;
