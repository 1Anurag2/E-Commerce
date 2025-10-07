import React, { useEffect, useState } from "react";
import "../UserStyles/Form.css";
import PageTitle from "../components/PageTitle";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { removeErrors, removeSuccess, resetPassword } from "../features/user/userSlice";
import { toast } from "react-toastify";
function ResetPassword() {
  const { success, loading, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  console.log(useParams());
  const {token} = useParams();

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      password,
      confirmPassword,
    };
    console.log(data);
    dispatch(resetPassword({token:token , userData : data}))
  };
  useEffect(() => {
      if (error) {
        toast.error(error, { position: "top-center", autoClose: 1000 });
        dispatch(removeErrors());
      }
    }, [error, dispatch]);
    
    useEffect(() => {
        if (success) {
          toast.success("Password Reset Successfully", {
            position: "top-center",
            autoClose: 1000,
          });
          dispatch(removeSuccess());
          navigate("/login");
        }
      }, [dispatch, success]);
  return (
    <>
      <PageTitle title="Reset Password" />
      <div className="form-container container">
        <div className="form-content">
          <form
            className="form"
            onSubmit={handleSubmit}
            encType="multipart/form-data"
            autoComplete="off"
          >
            <h2>Reset Password</h2>
            <div className="input-group">
              <input
                type="password"
                placeholder="New Password"
                name="password"
                required
                onChange={(e) => setPassword(e.target.value)}
                value={password}
              />
            </div>

            <div className="input-group">
              <input
                type="password"
                placeholder="Confirm Password"
                name="confirmpassword"
                required
                onChange={(e) => setConfirmPassword(e.target.value)}
                value={confirmPassword}
              />
            </div>
            <button className="authBtn">Reset Password</button>
          </form>
        </div>
      </div>
    </>
  );
}

export default ResetPassword;
