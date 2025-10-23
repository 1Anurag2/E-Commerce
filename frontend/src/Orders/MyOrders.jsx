import React, { useEffect } from "react";
import "../OrderStyles/MyOrders.css";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import PageTitle from "../Components/PageTitle";
import { LaunchOutlined } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllMyOrders } from "../features/order/orderSlice";
import Loader from "../Components/Loader"; // ✅ make sure this exists

function MyOrders() {
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector((state) => state.order);

  useEffect(() => {
    dispatch(getAllMyOrders());
  }, [dispatch]);

  return (
    <>
      <Navbar />
      <PageTitle title="User Orders" />

      {loading ? (
        <Loader />
      ) : orders && orders.length > 0 ? (
        <div className="my-orders-container">
          <h1>My Orders</h1>

          <div className="table-responsive">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Items Count</th>
                  <th>Status</th>
                  <th>Total Price (₹)</th>
                  <th>View Order</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td>{order._id}</td>
                    <td>{order.orderItems.length}</td>
                    <td>
                      {order.orderStatus}
                    </td>
                    <td>{order.totalPrice}</td>
                    <td>
                      <Link
                        to={`/order/${order._id}`}
                        className="order-link"
                        title="View Details"
                      > 
                        <LaunchOutlined />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="no-orders">
          <p className="no-order-message">No Orders Found</p>
        </div>
      )}

      <Footer />
    </>
  );
}

export default MyOrders;
