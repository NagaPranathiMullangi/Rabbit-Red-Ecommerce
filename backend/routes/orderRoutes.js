const express = require("express");
const Order = require("../models/Order");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

//@route GET /api/orders/myorders
//@desc get logged-in users orders
//@acess proivate

router.get("/my-orders", protect, async (req, res) => {
  try {
    //find orders for the authenticated user
    const orders = await Order.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    //sort by the most recent orders
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "server error" });
  }
});

//@route GET /api/orders/:id
//@desc get order detauls by order id
//acesss private

router.get("/:id", protect, async (req, res) => {
  console.log("backend", req.params.id);
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email"
    );

    console.log(order);
    if (!order) {
      return res.status(404).json({ message: "order not found" });
    }

    //return full order details
    res.json(order);
  } catch {
    console.log(error);
    res.status(500).json({ message: "server error" });
  }
});

module.exports = router;
