import React, { useState } from "react";
import "../UserStyles/UserDashboard.css";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { logout, removeSuccess } from "../features/user/userSlice";

function UserDashboard({ user }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [menuVisible, setMenuVisible] = useState(false);
  const {cartItems} = useSelector((state) => state.cart);

  function toggleMenu() {
    setMenuVisible(!menuVisible);
  }

  function orders() {
    navigate("/orders/user");
  }

  function profile() {
    navigate("/profile");
  }

  function logoutUser() {
    dispatch(logout())
      .unwrap()
      .then(() => {
        toast.success("Logged out successfully", {
          position: "top-center",
          autoClose: 2000,
        });
        dispatch(removeSuccess());
        navigate("/login");
      })
      .catch((error) => {
        toast.error(error.message || "Logout Failed", {
          position: "top-center",
          autoClose: 2000,
        });
      });
  }

  function dashboard() {
    navigate("/admin/dashboard");
  }

  const options = [
    { name: "Orders", funcName: orders },
    { name: "Account", funcName: profile },
    { name: `Cart (${cartItems.length})`, funcName: () => navigate("/cart") , isCart:true}, 
    { name: "Logout", funcName: logoutUser },
  ];

  if (user.role === "admin") {
    options.unshift({ name: "Admin Dashboard", funcName: dashboard });
  }

  return (
    <>
      <div
        className={`overlay ${menuVisible ? "show" : ""}`}
        onClick={toggleMenu}
      ></div>
      <div className="dashboard-container">
        <div className="profile-header" onClick={toggleMenu}>
          <img
            src={user?.avatar?.url ? user.avatar.url : "./images/profile.jpg"}
            alt="profile"
            className="profile-avatar"
          />
          <span className="profile-name">{user?.name || "User"}</span>
        </div>
        {menuVisible && (
          <div className="menu-options">
            {options.map((item) => (
              <button
                key={item.name}
                className={`menu-option-btn ${item.isCart ?(cartItems.length>0 ? 'cart-not-empty' : '') : ''}`}
                onClick={item.funcName}
              >
                {item.name}
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default UserDashboard;
