import React, { useMemo } from "react";
import "../CartStyles/Cart.css";
import PageTitle from "../components/PageTitle";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CartItem from "./CartItem";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

function Cart() {
  const { cartItems } = useSelector((state) => state.cart);
  const { user, isAuthenticated } = useSelector((state) => state.user);
  // console.log(user)

  // 🧮 Calculate totals dynamically
  const { subtotal, tax, shipping, total } = useMemo(() => {
    const subtotal = cartItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    const tax = Math.round(subtotal * 0.18); // 18% tax
    const shipping = subtotal > 0 ? 50 : 0;
    const total = subtotal + tax + shipping;
    return { subtotal, tax, shipping, total };
  }, [cartItems]);

    const navigate = useNavigate();
  const checkoutHandler = ()=>{
    if (isAuthenticated && user) {
    navigate("/shipping");
  } else {
    navigate("/login?redirect=/shipping");
  }
  }

  return (
    <>
    
      {cartItems.length === 0 ? (
        <>
        <PageTitle title="Your Cart" />
        <Navbar />
        <div className="empty-cart-container">
          <p className="empty-cart-message">Your cart is empty 😕</p>
          <Link to="/products" className="viewProducts">
            view Products
          </Link>
        </div>
        <Footer />
        </>
      ) : (
        <>
          <PageTitle title="Your Cart" />
          <Navbar />

          <div className="cart-page">
            <div className="cart-items">
              <div className="cart-items-heading">Your Cart</div>

              <div className="cart-table">
                <div className="cart-table-header">
                  <div className="header-product">Product</div>
                  <div className="header-quantity">Quantity</div>
                  <div className="header-total item-total-heading">
                    Item Total
                  </div>
                  <div className="header-action">Actions</div>
                </div>

                {/* ✅ Dynamically render each item */}
                {cartItems && cartItems.length > 0 ? (
                  cartItems.map((item) => (
                    <CartItem key={item.product} item={item} />
                  ))
                ) : (
                  <div className="empty-cart">Your cart is empty 😕</div>
                )}
              </div>
            </div>

            {/* 💰 Price Summary Section */}
            <div className="price-summary">
              <h3 className="price-summary-heading">Price Summary</h3>

              <div className="summary-item">
                <p className="summary-label">Subtotal:</p>
                <p className="summary-value">₹{subtotal.toFixed(2)}</p>
              </div>

              <div className="summary-item">
                <p className="summary-label">Tax (18%):</p>
                <p className="summary-value">₹{tax.toFixed(2)}</p>
              </div>

              <div className="summary-item">
                <p className="summary-label">Shipping:</p>
                <p className="summary-value">₹{shipping.toFixed(2)}</p>
              </div>

              <div className="summary-total">
                <p className="total-label">Total:</p>
                <p className="total-value">₹{total.toFixed(2)}</p>
              </div>

              <button
                className="checkout-btn"
                disabled={cartItems.length === 0}
                onClick={checkoutHandler}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
          <Footer />
        </>
      )}
    </>
  );
}

export default Cart;
