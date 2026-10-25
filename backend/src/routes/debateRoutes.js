import { Router } from "express";
import { protect, adminOnly, userOnly } from "../middleware/auth.js";
import { createDebate, getCurrentDebate, getAllDebates } from "../controllers/debateController.js";
import { getComments, addComment } from "../controllers/commentController.js";

const router = Router();
router.get("/current", protect, getCurrentDebate);
router.get("/", protect, adminOnly, getAllDebates);
router.post("/", protect, adminOnly, createDebate);
router.get("/:debateId/comments", protect, getComments);
router.post("/:debateId/comments", protect, userOnly, addComment);

export default router;