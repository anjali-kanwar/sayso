import Debate from "../models/Debate.js";
import Comment from "../models/Comment.js";

// Admin: post a new debate (older ones become history)
export const createDebate = async (req, res) => {
  try {
    const { title, description } = req.body;
    if (typeof title !== "string" || !title.trim()) {
      return res.status(400).json({ message: "Title is required" });
    }
    if (description !== undefined && typeof description !== "string") {
      return res.status(400).json({ message: "Description must be text" });
    }

    await Debate.updateMany({ isActive: true }, { isActive: false });
    const debate = await Debate.create({ title: title.trim(), description: description?.trim() ?? "" });
    res.status(201).json(debate);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

// Everyone logged in: the current debate
export const getCurrentDebate = async (req, res) => {
  try {
    const debate = await Debate.findOne({ isActive: true }).sort({ createdAt: -1 });
    res.json(debate); // null if none
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

// Admin: all debates with comment counts
export const getAllDebates = async (req, res) => {
  try {
    const debates = await Debate.find().sort({ createdAt: -1 }).lean();
    const result = await Promise.all(
      debates.map(async (d) => ({
        ...d,
        commentCount: await Comment.countDocuments({ debate: d._id }),
      }))
    );
    res.json(result);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};