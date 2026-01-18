import { Router } from "express";
import admins from "../controllers/admins.controller.js";

const router = Router();

router.get("/", admins.readAll);
router.get("/login", admins.login);
router.post("/", admins.create);
router.get("/:id", admins.readOne);
router.patch("/:id", admins.update);
router.put("/:id", admins.replace);
router.delete("/:id", admins.delete);

export default router;
