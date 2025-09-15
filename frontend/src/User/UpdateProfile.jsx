import React, { useEffect, useState } from "react";
import "../UserStyles/Form.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  removeErrors,
  removeSuccess,
  updateProfile,
} from "../features/user/userSlice";
import Loader from "../components/Loader";

function UpdateProfile() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("/images/profile.jpg");

  const { user, error, success, message, loading } = useSelector(
    (state) => state.user
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const profileImageUpdate = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Optional: check file size (1 MB max)
    if (file.size > 1024 * 1024) {
      toast.error("File size must be less than 1MB");
      return;
    }

    const Reader = new FileReader();
    Reader.onload = () => {
      if (Reader.readyState === 2) {
        setAvatarPreview(Reader.result); // Preview
        setAvatar(Reader.result);        // Base64 string
      }
    };
    Reader.onerror = (error) => {
      toast.error("Error reading file: " + error);
    };
    Reader.readAsDataURL(file);
  };

  const updateSubmit = (e) => {
    e.preventDefault();

    const myForm = {
      name,
      email,
      avatar, // base64 string
    };

    dispatch(updateProfile(myForm));
  };

  useEffect(() => {
    if (error) {
      toast.error(error, { position: "top-center", autoClose: 1000 });
      dispatch(removeErrors());
    }
  }, [error, dispatch]);

  useEffect(() => {
    if (success) {
      toast.success(message, { position: "top-center", autoClose: 1000 });
      dispatch(removeSuccess());
      navigate("/profile");
    }
  }, [dispatch, success]);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setAvatarPreview(user.avatar?.url || "/images/profile.jpg");
    }
  }, [user]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <Navbar />
          <div className="container update-container">
            <div className="form-content">
              <form className="form" onSubmit={updateSubmit}>
                <h2>Update Profile</h2>

                <div className="input-group avatar-group">
                  <input
                    type="file"
                    accept="image/*"
                    className="file-input"
                    name="avatar"
                    onChange={profileImageUpdate}
                  />
                  <img
                    src={avatarPreview}
                    alt="User Preview"
                    className="avatar"
                  />
                </div>

                <div className="input-group">
                  <input
                    type="text"
                    value={name}
                    name="name"
                    placeholder="Enter Name"
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="input-group">
                  <input
                    type="email"
                    value={email}
                    name="email"
                    placeholder="Enter Email"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <button className="authBtn">Update</button>
              </form>
            </div>
          </div>
          <Footer />
        </>
      )}
    </>
  );
}

export default UpdateProfile;
