import { Router } from "express";
import calibrations from "../controllers/calibrations.controller.js";

const router = Router();

router.get("/", calibrations.readAll);
router.get("/:id", calibrations.readOne);
router.post("/", calibrations.create);
router.patch("/:id", calibrations.update);
router.put("/:id", calibrations.replace);
router.delete("/:id", calibrations.delete);

export default router;
