import handleAsyncError from "../middleware/handleAsyncError.js";
import handleError from "../utils/handleError.js";
import User from "../models/userModel.js";
import { sendToken } from "../utils/jwtToken.js";

export const registerUser = handleAsyncError(async (req, res, next) => {
  const { name, email, password } = req.body;

  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: "sample_id",
      url: "sample_url",
    },
  });
  sendToken(user, 201, res);
});

//Login
const loginUser = handleAsyncError(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new handleError("Please enter email and password", 400));
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new handleError("Invalid email or password", 401));
  }
  const isPasswordValid = await user.verifyPassword(password);
  if (!isPasswordValid) {
    return next(new handleError("Invalid Email or Password", 401));
  }
  sendToken(user, 200, res);
});

//Logout
const logout = handleAsyncError(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({
    success: true,
    message: "Successfully Logged out",
  });
});

export default {
  registerUser,
  loginUser,
  logout,
};
