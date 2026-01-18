import { Router } from "express";
import salesNotes from "../controllers/salesNotes.controller.js";

const router = Router();

router.get("/", salesNotes.readAll);
router.get("/:id", salesNotes.readOne);
router.post("/", salesNotes.create);
router.patch("/:id", salesNotes.update);
router.put("/:id", salesNotes.replace);
router.delete("/:id", salesNotes.delete);

export default router;
