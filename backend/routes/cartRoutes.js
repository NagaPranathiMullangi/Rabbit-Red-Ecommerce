const express = require("express");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

//helper function to get a cart by user id or guest id

const getCart = async (userId, guestId) => {
  console.log("userid", userId);
  console.log("guestId", guestId);
  if (userId) {
    const userCart = await Cart.findOne({ user: userId });
    if (userCart) return userCart;
  }

  if (guestId) {
    return await Cart.findOne({ guestId: guestId });
  }

  return null;
};

//@route post /api/cart
//@desc add a product to the cart  for a guest or logged in user
//@access public

router.post("/", async (req, res) => {
  const { productId, quantity, size, color, guestId, userId } = req.body;

  try {
    const product = await Product.findById(productId);

    if (!product) return res.status(404).json({ message: "product not found" });

    //determine if the user is logged in or guest
    let cart = await getCart(userId, guestId);

    //if the cart exists,update it
    if (cart) {
      const productIndex = cart.products.findIndex(
        (p) =>
          p.productId.toString() === productId &&
          p.size === size &&
          p.color === color
      );

      if (productIndex > -1) {
        // if the product already exists , update the quantity
        cart.products[productIndex].quantity += quantity;
      } else {
        // add new product
        cart.products.push({
          productId,
          name: product.name,
          image: product.images[0].url,
          price: product.price,
          size,
          color,
          quantity,
        });
      }

      //  recalculate the total price
      cart.totalPrice = cart.products.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );

      await cart.save();
      return res.status(200).json(cart);
    } else {
      // create new cart for the guest or user

      const newCart = await Cart.create({
        user: userId ? userId : undefined,
        guestId: guestId ? guestId : "guest_" + new Date().getTime(),
        products: [
          {
            productId,
            name: product.name,
            image: product.images[0].url,
            price: product.price,
            size,
            color,
            quantity,
          },
        ],

        totalPrice: product.price * quantity,
      });
      return res.status(201).json(newCart);
    }
  } catch (error) {
    console.error(error), res.status(500).json({ message: "server error" });
  }
});

// @route put /api/cart
// @desc update product quantity in the cart for a guest or logged in user
//@acess public

router.put("/", async (req, res) => {
  console.log("inside cart put ", req.body);
  const { productId, quantity, size, color, guestId, userId } = req.body;

  try {
    let cart = await getCart(userId, guestId);
    if (!cart) return res.status(404).json({ message: "cart not found" });

    const productIndex = cart.products.findIndex(
      (p) =>
        p.productId.toString() === productId &&
        p.size === size &&
        p.color === color
    );

    if (productIndex > -1) {
      // Update or remove product
      if (quantity > 0) {
        cart.products[productIndex].quantity = quantity;
      } else {
        cart.products.splice(productIndex, 1);
      }

      // Recalculate total
      cart.totalPrice = cart.products.reduce((acc, item) => {
        const price = item.price || 0;
        return acc + price * item.quantity;
      }, 0);

      await cart.save();

      // Always return full updated cart
      const updatedCart = await getCart(userId, guestId);
      console.log(updatedCart);
      return res.status(200).json(updatedCart);
    } else {
      return res.status(404).json({ message: "product not found in cart" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "server error" });
  }
});

//@route delete a product from the cart
//@desc remove a product from the cart
//@acess public

router.delete("/", async (req, res) => {
  const { productId, size, color, guestId, userId } = req.body;
  try {
    let cart = await getCart(userId, guestId);
    if (!cart) return res.status(404).json({ message: "cart not found" });

    const productIndex = cart.products.findIndex(
      (p) =>
        p.productId.toString() === productId &&
        p.size === size &&
        p.color === color
    );
    if (productIndex > -1) {
      cart.products.splice(productIndex, 1);

      cart.totalPrice = cart.products.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );

      await cart.save();
      return res.status(200).json(cart);
    } else {
      return res
        .status(404)
        .json({ meassage: "prodyuct not found in the cart" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "server error" });
  }
});

//@route get /api/cart
//@desc get logged-in users or guest users cart
//@acess public

router.get("/", async (req, res) => {
  const { userId, guestId } = req.body;

  try {
    const cart = await getCart(userId, guestId);
    if (cart) {
      res.json(cart);
    } else {
      res.status(404).json({ message: "cart not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "server error" });
  }
});

//@route  post  /api/cart/merge
//desc merge guest cart into user cart on login
//acess private

router.post("/merge", protect, async (req, res) => {
  const { guestId } = req.body;

  try {
    const guestCart = await Cart.findOne({ guestId });
    const userCart = await Cart.findOne({ user: req.user._id });

    console.log("🔍 Guest Cart:", guestCart ? "Found" : "Not Found");
    console.log("👤 Logged in user ID:", req.user._id);

    if (guestCart) {
      if (guestCart.products.length === 0) {
        return res.status(400).json({ message: "Guest cart is empty" });
      }

      if (userCart) {
        // Merge products
        guestCart.products.forEach((guestItem) => {
          const existingIndex = userCart.products.findIndex(
            (item) =>
              item.productId.toString() === guestItem.productId.toString() &&
              item.size === guestItem.size &&
              item.color === guestItem.color
          );

          if (existingIndex > -1) {
            userCart.products[existingIndex].quantity += guestItem.quantity;
          } else {
            userCart.products.push(guestItem);
          }
        });

        // Recalculate total
        userCart.totalPrice = userCart.products.reduce(
          (acc, item) => acc + item.price * item.quantity,
          0
        );

        await userCart.save();
        await Cart.findOneAndDelete({ guestId });

        return res.status(200).json(userCart);
      } else {
        // No user cart? Assign guest cart to user
        guestCart.user = req.user._id; // ✅ FIXED HERE
        guestCart.guestId = undefined;

        guestCart.totalPrice = guestCart.products.reduce(
          (acc, item) => acc + item.price * item.quantity,
          0
        );

        await guestCart.save();
        return res.status(200).json(guestCart);
      }
    } else {
      if (userCart) {
        return res.status(200).json(userCart);
      }
      return res.status(404).json({ message: "Guest cart not found" });
    }
  } catch (error) {
    console.error("❌ Error merging cart:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
