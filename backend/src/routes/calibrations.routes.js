import { Router } from "express";
import calibrations from "../controllers/calibrations.controller.js";

const router = Router();

router.get("/", calibrations.readAll);
router.get("/:id", calibrations.readOne);
router.post("/", calibrations.create);
router.patch("/:id", calibrations.update);//no hay forma de usar patch
router.post("/:id/condition", calibrations.updateCondition);//Evalua condicion visual y la añade en sus respectivos cambios de la graduacion(calibration)
router.put("/:id", calibrations.replace);
router.delete("/:id", calibrations.delete);

export default router;
