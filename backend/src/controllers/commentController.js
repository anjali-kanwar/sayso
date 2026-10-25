import Comment from "../models/Comment.js";
import Debate from "../models/Debate.js";

export const getComments = async (req, res) => {
  try {
    const isAdmin = req.user.role === "admin";
    let query = Comment.find({ debate: req.params.debateId })
      .sort({ createdAt: -1 })
      .populate("user", "name username");

    if (isAdmin) {
      query = query.populate("likes", "username").populate("dislikes", "username");
    }
    const comments = await query.lean();
    const uid = String(req.user.id);

    res.json(
      comments.map((c) => ({
        _id: c._id,
        text: c.text,
        createdAt: c.createdAt,
        user: c.user,
        likesCount: c.likes.length,
        dislikesCount: c.dislikes.length,
        myReaction: isAdmin
          ? null
          : c.likes.some((i) => String(i) === uid)
          ? "like"
          : c.dislikes.some((i) => String(i) === uid)
          ? "dislike"
          : null,
        ...(isAdmin && {
          likedBy: c.likes.map((u) => u.username),
          dislikedBy: c.dislikes.map((u) => u.username),
        }),
      }))
    );
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

export const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    if (typeof text !== "string" || !text.trim()) {
      return res.status(400).json({ message: "Comment cannot be empty" });
    }
    if (text.length > 1000) {
      return res.status(400).json({ message: "Comment cannot exceed 1000 characters" });
    }

    const debate = await Debate.findById(req.params.debateId);
    if (!debate || !debate.isActive) {
      return res.status(400).json({ message: "This debate is closed" });
    }

    const comment = await Comment.create({
      debate: debate._id,
      user: req.user.id,
      text,
    });
    res.status(201).json(comment);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

// One reaction per user per comment; clicking again removes it
export const reactToComment = async (req, res) => {
  try {
    const { type } = req.body; // "like" | "dislike"
    if (!["like", "dislike"].includes(type)) {
      return res.status(400).json({ message: "Invalid reaction" });
    }

    const comment = await Comment.findById(req.params.commentId).populate("debate", "isActive");
    if (!comment) return res.status(404).json({ message: "Comment not found" });
    if (!comment.debate?.isActive) {
      return res.status(400).json({ message: "This debate is closed" });
    }

    const uid = String(req.user.id);
    const has = (arr) => arr.some((i) => String(i) === uid);
    const remove = (arr) => arr.filter((i) => String(i) !== uid);

    if (type === "like") {
      const already = has(comment.likes);
      comment.likes = remove(comment.likes);
      comment.dislikes = remove(comment.dislikes);
      if (!already) comment.likes.push(req.user.id);
    } else {
      const already = has(comment.dislikes);
      comment.likes = remove(comment.likes);
      comment.dislikes = remove(comment.dislikes);
      if (!already) comment.dislikes.push(req.user.id);
    }

    await comment.save();
    res.json({ ok: true });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};