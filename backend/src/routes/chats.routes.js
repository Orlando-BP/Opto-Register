import { Router } from "express";
import chats from "../controllers/chats.controller.js";

const router = Router();

router.get("/", chats.readAll);
router.get("/:id", chats.readOne);
router.post("/", chats.create);
router.patch("/:id", chats.update);
router.put("/:id", chats.replace);
router.delete("/:id", chats.delete);

export default router;
