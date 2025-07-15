const express = require("express");
const User = require("../models/User");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

//@route GET /api/admin/users
//@desc Get all users (admin only)
//@acess private/admin

router.get("/", protect, admin, async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "server error" });
  }
});

//@route POST /api/admin/users
//@desc adda a new use (admin only)
//@acess Private /admin
router.post("/", protect, admin, async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ message: "user with that email already exists" });
    }

    user = new User({ name, email, password, role: role || "customer" });

    await user.save();

    res.status(201).json({ message: "user created sucessfully", user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "server error" });
  }
});

//@route PUT /api/admin/users/:id
//@desc update user info (admin only)-name,email and role
//@acess private/admin

router.put("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.role = req.body.role || user.role;
    }
    const updatedUser = await user.save();
    res.json({ message: "user updated sucessfully", user: updatedUser });
  } catch (error) {
    console.log(error);
    res.status(500).json({ messaga: "server errror" });
  }
});

//@route delete /api/admin/users/:id
router.delete("/:id", protect, admin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      await user.deleteOne();
      res.json({ message: "user deleted sucessufly" });
    } else {
      res.status(404).json({ messaga: "user not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "server error" });
  }
});
module.exports = router;
