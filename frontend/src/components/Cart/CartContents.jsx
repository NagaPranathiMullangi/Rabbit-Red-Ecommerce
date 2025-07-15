import React, { useState, useEffect } from "react";
import { RiDeleteBin3Line } from "react-icons/ri";
import { useDispatch } from "react-redux";
import {
  removeFromCart,
  updateCartItemQuantity,
} from "../../../redux/slices/cartSlice";

function CartContents({ cart, userId, guestId }) {
  const dispatch = useDispatch();

  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    // Initialize quantities from cart
    if (cart?.products?.length > 0) {
      const initialQuantities = {};
      cart.products.forEach((item, index) => {
        const key = `${item.productId}-${item.size}-${item.color}`;
        initialQuantities[key] = item.quantity;
      });
      setQuantities(initialQuantities);
    }
  }, [cart]);

  const updateQty = (productId, delta, size, color) => {
    const key = `${productId}-${size}-${color}`;
    const currentQty = quantities[key] || 1;
    const newQty = currentQty + delta;
    if (newQty >= 1) {
      setQuantities((prev) => ({ ...prev, [key]: newQty }));
      dispatch(
        updateCartItemQuantity({
          productId,
          quantity: newQty,
          guestId,
          userId,
          size,
          color,
        })
      );
    }
  };

  const handleRemoveFromCart = (productId, size, color) => {
    dispatch(removeFromCart({ productId, guestId, userId, size, color }));
  };

  if (!cart || !Array.isArray(cart.products) || cart.products.length === 0) {
    return <p>Your cart is empty.</p>;
  }

  return (
    <div>
      {cart.products.map((item, index) => {
        const { productId, name, image, price, size, color } = item;
        const key = `${productId}-${size}-${color}`;
        const quantity = quantities[key] || 1;

        return (
          <div
            key={key}
            className="flex items-start justify-between py-4 border-b">
            <div className="flex items-start">
              <img
                src={image}
                alt={name}
                className="h-24 w-20 object-cover mr-4 rounded"
              />
              <div>
                <h3 className="font-medium">{name}</h3>
                <p className="text-sm text-gray-500">
                  Size: {size} | Color: {color}
                </p>

                {/* Quantity Controls */}
                <div className="flex items-center mt-2">
                  <button
                    className="border rounded px-2 py-1 text-xl font-medium"
                    onClick={() => updateQty(productId, -1, size, color)}>
                    -
                  </button>
                  <span className="mx-4">{quantity}</span>
                  <button
                    className="border rounded px-2 py-1 text-xl font-medium"
                    onClick={() => updateQty(productId, 1, size, color)}>
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Price + Remove */}
            <div>
              <p className="font-semibold">₹ {price}</p>
              <button
                onClick={() => handleRemoveFromCart(productId, size, color)}>
                <RiDeleteBin3Line className="h-5 w-6 mt-2 text-red-800" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default CartContents;
