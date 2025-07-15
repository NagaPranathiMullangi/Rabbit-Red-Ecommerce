const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();
console.log("✅ userRoutes file loaded");

// Register Route
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already registered" });
    }

    user = new User({ name, email, password });
    await user.save();

    const payload = { id: user._id }; // ✅ simpler payload

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "100h" },
      (err, token) => {
        if (err) throw err;
        res.status(201).json({
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
          token,
        });
      }
    );
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Login Route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  console.log("got email", email);
  console.log("got password", password);

  try {
    let user = await User.findOne({ email });
    console.log(user);
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    console.log("✅ Email received:", `"${email}"`);
    console.log("✅ Password received:", `"${password}"`);
    console.log("✅ DB password:", user.password);

    const isMatch = await user.matchPassword(password);
    console.log("ismatch", isMatch);
    if (!isMatch) {
      console.log(1);
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const payload = { id: user._id };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "1000h" },
      (err, token) => {
        if (err) throw err;
        res.json({
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
          token,
        });
      }
    );
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Protected Route
router.get("/profile", protect, async (req, res) => {
  res.json(req.user);
});

module.exports = router;
