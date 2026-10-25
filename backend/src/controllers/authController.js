import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Joi from "joi";
import User from "../models/User.js";

const signToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });

const signupSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  username: Joi.string().alphanum().min(3).max(20).required(),
  password: Joi.string().min(6).max(100).required(),
});

export const signup = async (req, res) => {
  try {
    const { error, value } = signupSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const username = value.username.toLowerCase();
    if (username === process.env.ADMIN_USERNAME.toLowerCase()) {
      return res.status(400).json({ message: "This username is not available" });
    }
    if (await User.findOne({ username })) {
      return res.status(400).json({ message: "Username already taken" });
    }

    const hashed = await bcrypt.hash(value.password, 10);
    const user = await User.create({ name: value.name, username, password: hashed });

    const token = signToken({ id: user._id, role: "user" });
    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, username: user.username, role: "user" },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    // Predefined admin from .env
    if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
      const token = signToken({ id: "admin", role: "admin" });
      return res.json({
        token,
        user: { id: "admin", name: "Admin", username: "admin", role: "admin" },
      });
    }

    const user = await User.findOne({ username: username.toLowerCase() });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const token = signToken({ id: user._id, role: "user" });
    res.json({
      token,
      user: { id: user._id, name: user.name, username: user.username, role: "user" },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};