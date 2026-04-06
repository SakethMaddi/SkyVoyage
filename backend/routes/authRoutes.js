import { Router } from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

const router = Router();

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name?.trim() || !email?.trim() || !password) {
      return res.status(400).json({ error: "Missing fields" });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }
    const existing = await User.findOne({ email: email.trim().toLowerCase() });
    if (existing) {
      return res.status(409).json({ error: "Account already exists with this email" });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      passwordHash,
    });
    req.session.userId = user._id.toString();
    return res.status(201).json({
      user: { id: user._id.toString(), name: user.name, email: user.email },
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Registration failed" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email?.trim() || !password) {
      return res.status(400).json({ error: "Missing email or password" });
    }
    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    req.session.userId = user._id.toString();
    return res.json({
      user: { id: user._id.toString(), name: user.name, email: user.email },
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Login failed" });
  }
});

router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: "Logout failed" });
    }
    res.clearCookie("skyvoyage.sid", { path: "/" });
    return res.json({ ok: true });
  });
});

router.get("/me", async (req, res) => {
  try {
    if (!req.session?.userId) {
      return res.json({ user: null });
    }
    const user = await User.findById(req.session.userId).lean();
    if (!user) {
      req.session.destroy(() => {});
      return res.json({ user: null });
    }
    return res.json({
      user: { id: user._id.toString(), name: user.name, email: user.email },
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Failed to load user" });
  }
});

export default router;
