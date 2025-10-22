import React, { useEffect } from "react";
import "../CartStyles/PaymentSuccess.css";
import { Link, useSearchParams } from "react-router-dom";
import PageTitle from "../Components/PageTitle";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { createOrder, removeErrors } from "../features/order/orderSlice";
import { removeSuccess } from "../features/order/orderSlice";

function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const reference = searchParams.get("reference");
  const { cartItems, shippingInfo } = useSelector((state) => state.cart);
  const { success, error } = useSelector((state) => state.order);
  const dispatch = useDispatch();

  useEffect(() => {
    const createOrderData = async () => {
      try {
        const orderItem = JSON.parse(sessionStorage.getItem("orderItem"));
        const orderData = {
          shippingInfo: {
            address: shippingInfo.address,
            city: shippingInfo.city,
            state: shippingInfo.state,
            country: shippingInfo.country,
            pinCode: shippingInfo.pinCode,
            phoneNo: shippingInfo.phoneNo,
          },
          orderItems: cartItems.map((item) => ({
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
            product: item.product,
          })),
          paymentInfo: {
            id: reference,
            status: "succeeded",
          },
          itemsPrice: orderItem.subtotal,
          taxPrice: orderItem.tax,
          shippingPrice: orderItem.shipping,
          totalPrice: orderItem.total,
        };
        console.log("Sending Data", orderData);
        dispatch(createOrder(orderData));
        toast.success('Order Placed', { position: "top-center", autoClose: 3000 });
        // sessionStorage.removeItem("orderItem");
      
      } catch (error) {
        console.log("Order Creation Error", error.message);
        toast.error(error.message || "Order Creation Error", {
          position: "top-center",
          theme: "colored",
          autoClose: 2000,
        });
      }
    };
    createOrderData();
  }, [dispatch, reference]);

  useEffect(() => {
    if (success) {
      toast.success("Order Placed ", {
        position: "top-center",
        autoClose: 2000,
      });
      dispatch(removeSuccess());
    }
  }, [dispatch, success]);
  
  useEffect(() => {
    if (error) {
      toast.error(error.message || "Order Creation Error", {
        position: "top-center",
        theme: "colored",
        autoClose: 2000,
      });
      dispatch(removeErrors());
    }
  }, [dispatch, error]);

  return (
    <>
      <PageTitle title="Payment Status" />
      <Navbar />
      <div className="payment-success-container">
        <div className="success-content">
          <div className="success-icon">
            <div className="checkmark"></div>
          </div>
          <h1>Order Confirmed!</h1>
          <p>
            Your Payment was successful . Reference Id{" "}
            <strong>{reference}</strong>
          </p>
          <Link to="/orders/user" className="explore-btn">
            View Orders
          </Link>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default PaymentSuccess;
