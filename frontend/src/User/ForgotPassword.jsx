import React, { useEffect } from "react";
import "../UserStyles/Form.css";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import PageTitle from "../components/PageTitle";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  forgotPassword,
  removeErrors,
  removeSuccess,
} from "../features/user/userSlice";
import { toast } from "react-toastify";
import Loader from "../components/Loader";

function ForgotPassword() {
  const [email, setEmail] = React.useState("");
  const [submitted, setSubmitted] = React.useState(false);


  const { success, loading, error, message } = useSelector(
    (state) => state.user
  );
  const dispatch = useDispatch();
  const handleChange = (e) => {
    setEmail(e.target.value);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const myForm = new FormData();
    myForm.set("email", email);
    dispatch(forgotPassword(myForm));
    setEmail("");
  };
  useEffect(() => {
    if (error) {
      toast.error(error, { position: "top-center", autoClose: 1000 });
      dispatch(removeErrors());
    }
  }, [error, dispatch]);

  useEffect(() => {
    if (success) {
      toast.success(message, {
        position: "top-center",
        autoClose: 1000,
      });
      setSubmitted(true);
      dispatch(removeSuccess());
    }
  }, [dispatch, success]);

  return (
    <>
    {!submitted ? (<>
    {(loading?(<Loader/>):<>
      <PageTitle title="Forgot Password" />
      <Navbar />
      <div className="form-container container">
        <div className="form-content">
          <form className="form" onSubmit={handleSubmit}>
            <h2>Forgot Password</h2>
            <p className="forgot-password-description">
              Enter your email address and we'll send you the link to reset your
              password
            </p>
            <div className="input-group">
              <input
                type="email"
                placeholder="Enter your Email"
                name="email"
                value={email}
                onChange={handleChange}
              />
            </div>
            <button className="authBtn">Send</button>
            <p className="form-links">
              <Link to="/login">Back to Login</Link>
            </p>
          </form>
        </div>
      </div>
      <Footer />
    </>)}
    </>):(
      <>
      <PageTitle title="Forgot Password" />
      <Navbar />
      <div className="form-container container">
        <div className="form-content">
          <form className="form" onSubmit={handleSubmit}>
            <h2>Forgot Password</h2>
            <p className="forgot-passoword-description">
              Reset Password Link is sent to your registered Email Id
            </p>
            <p className="form-links">
              <Link to="/login">Back to Login</Link>
            </p>
          </form>
        </div>
      </div>
      <Footer />
    </>
    )}
    
    </>
  );
}

export default ForgotPassword;
