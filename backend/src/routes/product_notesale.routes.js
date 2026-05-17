import { Router } from "express";
import product_notesale from "../controllers/product_notesale.controller.js";

const router = Router();

router.get("/", product_notesale.readAll);
router.get("/:id", product_notesale.readOne);
router.post("/", product_notesale.create);
router.patch("/:id", product_notesale.update);
router.put("/:id", product_notesale.replace);
router.delete("/:id", product_notesale.delete);

export default router;
