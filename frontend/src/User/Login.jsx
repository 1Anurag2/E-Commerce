import React, { useEffect, useState } from "react";
import "../UserStyles/Form.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { login, removeErrors, removeSuccess } from "../features/user/userSlice";

function Login() {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const { email, password } = credentials;
  const { success, loading, error, isAuthenticated } = useSelector(
    (state) => state.user
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const redirect = new URLSearchParams(location.search).get("redirect")||'/';

  // handle input
  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  // handle submit
  const loginSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter email and password", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    dispatch(login({ email, password }));
  };

  // handle error
  useEffect(() => {
    if (error) {
      toast.error(error, { position: "top-center", autoClose: 3000 });
      dispatch(removeErrors());
    }
  }, [dispatch, error]);

  // handle success
  useEffect(() => {
    if (success && isAuthenticated) {
      toast.success("Login Successful", {
        position: "top-center",
        autoClose: 3000,
      });
      dispatch(removeSuccess());
      navigate(redirect); // redirect to homepage/dashboard
    }
  }, [dispatch, success, isAuthenticated, navigate]);

  return (
    <div className="form-container container">
      <div className="form-content">
        <form className="form" onSubmit={loginSubmit}>
          <h2>Sign In</h2>
          <div className="input-group">
            <input
              type="email"
              placeholder="Email"
              name="email"
              value={email}
              onChange={handleChange}
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              placeholder="Password"
              name="password"
              value={password}
              onChange={handleChange}
            />
          </div>
          <p className="form-link">
            <Link to="/password/forgot">Forgot Password?</Link>
          </p>
          <button className="authBtn" disabled={loading}>
            {loading ? "Login..." : "Sign In"}
          </button>
          <p className="form-links">
            Don’t have an account? <Link to="/register">Sign Up</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
