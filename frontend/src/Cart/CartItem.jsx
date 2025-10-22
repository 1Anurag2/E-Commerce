import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  addItemsToCart,
  removeErrors,
  removeItemsFromCart,
  removeMessage,
} from "../features/cart/cartSlice";
import { useDispatch, useSelector } from "react-redux";

function CartItem({ item }) {
  const { loading, error, message, success, cartItems } = useSelector(
    (state) => state.cart
  );
  const [quantity, setQuantity] = useState(item.quantity);
  const dispatch = useDispatch();
  const decreaseQuantity = () => {
    if (quantity <= 1) {
      toast.error("Quantity cannot be less than 1", {
        position: "top-center",
        autoClose: 1000,
      });
      dispatch(removeErrors());
      return;
    }
    setQuantity((qty) => qty - 1);
  };

  const increaseQuantity = () => {
    if (item.stock <= quantity) {
      toast.error("Cannot add more items than available in stock", {
        position: "top-center",
        autoClose: 1000,
      });
      dispatch(removeErrors());
      return;
    }
    setQuantity((qty) => qty + 1);
  };

  const handleUpdate = () => {
    if (loading) return;
    if (quantity !== item.quantity && quantity > 0) {
      dispatch(addItemsToCart({ id: item.product, quantity: quantity }));
    }
  };
  const handleRemove = () => {
    if (loading) return;
    dispatch(removeItemsFromCart(item.product));
    toast.success("Item removed from cart successfully", {
        position: "top-center",
        autoClose: 1000,
      });
  };

  useEffect(() => {
    if (success) {
      toast.success(message, {
        position: "top-center",
        autoClose: 1000,
        toastId: "cart-update",
      });
      dispatch(removeMessage());
    }
  }, [dispatch, success, message]);

  useEffect(() => {
    if (error) {
      toast.error(error.message || error, {
        position: "top-center",
        autoClose: 1000,
      });
      dispatch(removeErrors());
    }
  }, [dispatch, error]);
  return (
    <div className="cart-item">
      <div className="item-info">
        <img src={item.image} alt={item.name} className="item-image" />
        <div className="item-details">
          <h3 className="item-name">{item.name}</h3>
          <p className="item-price">
            <strong>Price :</strong> ₹{item.price}
          </p>
          <p className="item-quantity">
            <strong>Quantity :</strong> {item.quantity}
          </p>
        </div>
      </div>

      <div className="quantity-controls">
        <button
          className="quantity-button decrease-btn"
          onClick={decreaseQuantity}
          disabled={loading}
        >
          -
        </button>
        <input
          type="number"
          className="quantity-input"
          value={quantity}
          readOnly
          min="1"
        />
        <button
          className="quantity-button increase-btn"
          onClick={increaseQuantity}
          disabled={loading}
        >
          +
        </button>
      </div>

      <div className="item-total">
        <span className="item-total-price">
          ₹{item.price * item.quantity}/-
        </span>
      </div>

      <div className="item-actions">
        <button
          className="update-item-btn"
          onClick={handleUpdate}
          disabled={loading || quantity === item.quantity}
        >
          {loading ? "Updating..." : "Update"}
        </button>
        <button
          className="remove-item-btn"
          onClick={handleRemove}
          disabled={loading}
        >
          Remove
        </button>
      </div>
    </div>
  );
}

export default CartItem;
