import React, { useEffect } from "react";
import "../OrderStyles/OrderDetails.css";
import PageTitle from "../Components/PageTitle";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getOrderDetails, removeErrors } from "../features/order/orderSlice";
import { toast } from "react-toastify";
import Loader from "../Components/Loader"; // ✅ optional, if you have a Loader component

function OrderDetails() {
  const { orderId } = useParams();
  const dispatch = useDispatch();

  const { order, loading, error } = useSelector((state) => state.order);
  console.log(order);

  useEffect(() => {
    dispatch(getOrderDetails(orderId));

    if (error) {
      toast.error(error.message || "Failed to load order details", {
        position: "top-center",
        autoClose: 2000,
      });
      dispatch(removeErrors());
    }
  }, [dispatch, error, orderId]);

  if (loading) {
    return <Loader />;
  }

  if (!order || Object.keys(order).length === 0) {
    return (
      <>
        <Navbar />
        <PageTitle title="Order Not Found" />
        <div className="no-orders-message">
          Order not found. Please try again.
        </div>
        <Footer />
      </>
    );
  }

  const {
    orderItems = [],
    shippingInfo = {},
    paymentInfo = {},
    orderStatus,
    totalPrice,
    taxPrice,
    shippingPrice,
    itemsPrice,
    paidAt,
  } = order;

  return (
    <>
      <PageTitle title={`Order #${orderId}`} />
      <Navbar />
      {loading ? (
        <Loader />
      ) : (
        <div className="order-box">
          {/* ================== Order Items ================== */}
          <div className="table-block">
            <h2 className="table-title">Order Items</h2>
            <table className="table-main">
              <thead>
                <tr>
                  <th className="head-cell">Image</th>
                  <th className="head-cell">Name</th>
                  <th className="head-cell">Quantity</th>
                  <th className="head-cell">Price</th>
                </tr>
              </thead>
              <tbody>
                {orderItems.length > 0 ? (
                  orderItems.map((item) => (
                    <tr key={item._id}>
                      <td className="table-cell">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="item-img"
                        />
                      </td>
                      <td className="table-cell">{item.name}</td>
                      <td className="table-cell">{item.quantity}</td>
                      <td className="table-cell">₹{item.price}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="no-items">
                      No items found in this order.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* ================== Shipping Info ================== */}
          <div className="table-block">
            <h2 className="table-title">Shipping Info</h2>
            <table className="table-main">
              <tbody>
                <tr className="table-row">
                  <th className="table-cell">Address</th>
                  <td className="table-cell">
                    {shippingInfo.address}, {shippingInfo.city},{" "}
                    {shippingInfo.state}, {shippingInfo.country} -{" "}
                    {shippingInfo.pinCode}
                  </td>
                </tr>
                <tr className="table-row">
                  <th className="table-cell">Phone</th>
                  <td className="table-cell">{shippingInfo.phoneNo}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* ================== Order Summary ================== */}
          <div className="table-block">
            <h2 className="table-title">Order Summary</h2>
            <table className="table-main">
              <tbody>
                <tr className="table-row">
                  <th className="table-cell">Order Status</th>
                  <td className="table-cell">
                    <span
                      className={`status-tag ${
                        orderStatus === "Delivered"
                          ? "delivered"
                          : orderStatus === "Cancelled"
                          ? "cancelled"
                          : "processing"
                      }`}
                    >
                      {orderStatus}
                    </span>
                  </td>
                </tr>

                <tr className="table-row">
                  <th className="table-cell">Payment Status</th>
                  <td className="table-cell">
                    <span
                      className={`pay-tag ${
                        paymentInfo.status === "succeeded" ? "paid" : "not-paid"
                      }`}
                    >
                      {paymentInfo.status === "succeeded" ? "Paid" : "Not-Paid"}
                    </span>
                  </td>
                </tr>

                <tr className="table-row">
                  <th className="table-cell">Paid At</th>
                  <td className="table-cell">
                    {paidAt ? new Date(paidAt).toLocaleString("en-GB") : "N/A"}
                  </td>
                </tr>

                <tr className="table-row">
                  <th className="table-cell">Item Price</th>
                  <td className="table-cell">₹{itemsPrice}</td>
                </tr>

                <tr className="table-row">
                  <th className="table-cell">Tax Price</th>
                  <td className="table-cell">₹{taxPrice}</td>
                </tr>

                <tr className="table-row">
                  <th className="table-cell">Shipping Price</th>
                  <td className="table-cell">₹{shippingPrice}</td>
                </tr>

                <tr className="table-row">
                  <th className="table-cell">Total Price</th>
                  <td className="table-cell total-price">₹{totalPrice}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}

export default OrderDetails;
