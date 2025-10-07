import React, { useEffect, useState } from "react";
import "../UserStyles/Form.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PageTitle from "../components/PageTitle";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  removeErrors,
  removeSuccess,
  updatePassword,
} from "../features/user/userSlice";
import { toast } from "react-toastify";
import Loader from "../components/Loader";

function UpdatePassword() {
  const { success, loading, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const updatePasswordSubmit = (e) => {
    e.preventDefault();
    const myForm = new FormData();
    // myForm.set('name field value ', state value)
    myForm.set("oldPassword", oldPassword);
    myForm.set("newPassword", newPassword);
    myForm.set("confirmPassword", confirmPassword);
    for (let pair of myForm.entries()) {
      console.log(pair[0] + "-" + pair[1]);
    }
    dispatch(updatePassword(myForm));
  };

  useEffect(() => {
    if (error) {
      toast.error(error, { position: "top-center", autoClose: 1000 });
      dispatch(removeErrors());
    }
  }, [error, dispatch]);

  useEffect(() => {
    if (success) {
      toast.success("Password Update Successfully", {
        position: "top-center",
        autoClose: 1000,
      });
      dispatch(removeSuccess());
      navigate("/profile");
    }
  }, [dispatch, success]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <Navbar />
          <PageTitle title="Password Update" />
          <div className="container update-container">
            <div className="form-content">
              <form className="form" onSubmit={updatePasswordSubmit}>
                <h2>Update Password</h2>

                <div className="input-group">
                  <input
                    type="password"
                    name="oldPassword"
                    value={oldPassword}
                    placeholder="Old Password"
                    onChange={(e) => setOldPassword(e.target.value)}
                  />
                </div>
                <div className="input-group">
                  <input
                    type="password"
                    name="newPassword"
                    value={newPassword}
                    placeholder="New Password"
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                <div className="input-group">
                  <input
                    type="password"
                    name="confirmPassword"
                    value={confirmPassword}
                    placeholder="Confirm Password"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>

                <button className="authBtn">Update Password</button>
              </form>
            </div>
          </div>
          <Footer />
        </>
      )}
    </>
  );
}

export default UpdatePassword;
