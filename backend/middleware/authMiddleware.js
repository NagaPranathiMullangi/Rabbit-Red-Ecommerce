const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      console.log("🔐 Token received:", token);

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("✅ Decoded payload:", decoded);

      req.user = await User.findById(decoded.id).select("-password");
      if (!req.user) {
        console.log("❌ User not found for decoded ID");
        return res.status(401).json({ message: "User not found" });
      }

      next();
    } catch (err) {
      console.error("❌ JWT verify failed:", err.message);
      return res
        .status(401)
        .json({ message: "Token failed", error: err.message });
    }
  } else {
    console.log("❌ No token provided in header");
    return res.status(401).json({ message: "No token provided" });
  }
};

// middleware to check if the user is an admin

const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: " Not authorized as an admin" });
  }
};

module.exports = { protect, admin };
