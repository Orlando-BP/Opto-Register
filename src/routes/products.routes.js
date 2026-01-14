import { Router } from "express";
import products from "../controllers/products.controller.js";

const router = Router();

router.get("/", products.readAll);
router.get("/:id", products.readOne);
router.post("/", products.create);
router.patch("/:id", products.update);
router.put("/:id", products.replace);
router.delete("/:id", products.delete);

export default router;
