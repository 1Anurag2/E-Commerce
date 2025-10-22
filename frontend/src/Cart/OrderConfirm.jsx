import React, { useMemo } from "react";
import "../CartStyles/OrderConfirm.css";
import PageTitle from "../components/PageTitle";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useSelector } from "react-redux";
import CheckoutPath from "./CheckoutPath";
import { useNavigate } from "react-router-dom";
function OrderConfirm() {
  const { shippingInfo, cartItems } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  console.log(shippingInfo, cartItems, user);

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

  const proceedToPayment = () => {
    const data = {
      subtotal,
      tax,
      shipping,
      total,
    };
    sessionStorage.setItem("orderItem", JSON.stringify(data));
    navigate("/process/payment");
  };
  return (
    <>
      <PageTitle title="Order Confirm" />
      <Navbar />
      <CheckoutPath activePath={1} />
      <div className="confirm-container">
        <h1 className="confirm-header">Order Confirmation</h1>
        <div className="confirm-table-container">
          <table className="confirm-table">
            <caption>Shipping Details</caption>
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Address</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{user.name}</td>
                <td>{shippingInfo.phoneNo}</td>
                <td>
                  {shippingInfo.address},{shippingInfo.state},
                  {shippingInfo.city}-{shippingInfo.pinCode}
                </td>
              </tr>
            </tbody>
          </table>

          <table className="confirm-table cart-table">
            <caption>Cart Items</caption>
            <thead>
              <tr>
                <th>Image</th>
                <th>Product Name</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>TotalPrice</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((items) => (
                <tr key={items.product}>
                  <td>
                    <img
                      src={items.image}
                      alt={items.name}
                      className="order-product-image"
                    />
                  </td>
                  <td>{items.name}</td>
                  <td>{items.price}/-</td>
                  <td>{items.quantity}</td>
                  <td>{items.quantity * items.price}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <table className="confirm-table">
            <caption>Order Summary</caption>
            <thead>
              <tr>
                <th>Subtotal</th>
                <th>Shipping Charges</th>
                <th>GST</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{subtotal}</td>
                <td>{shipping}</td>
                <td>{tax}</td>
                <td>{total}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <button className="proceed-button" onClick={proceedToPayment}>
          Proceed to Payment
        </button>
      </div>
      <Footer />
    </>
  );
}

export default OrderConfirm;
