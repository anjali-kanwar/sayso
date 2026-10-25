import { Router } from "express";
import { protect, userOnly } from "../middleware/auth.js";
import { reactToComment } from "../controllers/commentController.js";

const router = Router();
router.post("/:commentId/react", protect, userOnly, reactToComment);

export default router;