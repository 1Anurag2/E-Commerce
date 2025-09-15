import handleAsyncError from "../middleware/handleAsyncError.js";
import handleError from "../utils/handleError.js";
import User from "../models/userModel.js";
import { sendToken } from "../utils/jwtToken.js";
import { sendEmail } from "../utils/sendEmail.js";
import crypto from "crypto";
import { v2 as cloudinary } from "cloudinary";

//Register
const registerUser = handleAsyncError(async (req, res, next) => {
  const { name, email, password ,avatar} = req.body;
  const myCloud = await cloudinary.uploader.upload(avatar, {
    folder: "avatars",
    width: 150,
    crop: "scale"
  });
  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
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

//Forgot Password
const resetPassword = handleAsyncError(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return next(new handleError("User not found", 404));
  }
let resetToken;
try {
    resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });
  } catch (error) {
    return next(new handleError("Error generating reset token", 500));
  }
  const resetUrl = `${req.protocol}://${req.get("host")}/api/v1/reset/${resetToken}`;
  console.log(resetUrl);
  const message = `Use the following link to reset your password : ${resetUrl} \n\n This link will expire in 30 minutes.\n\n
  If you didn't request a password reset , please ignore this email.`;
  try {
    //send email
    await sendEmail({
      email: user.email,
      subject: "Password Reset Request",
      message
    })
    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new handleError("Email could not be sent", 500));
  }
});

//Reset Password
const resetPasswordHandler = handleAsyncError(async (req, res, next) => {
  const { token } = req.params;
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });
  if (!user) {
    return next(new handleError("Invalid or expired token", 400));
  }

  const {password , confirmPassword} = req.body;
  if(password !== confirmPassword){
    return next(new handleError("Password and confirm password do not match", 400));
  }
  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();
  sendToken(user, 200, res);
}); 

//get user Details
const getUserDetails = handleAsyncError(async (req,res,next)=>{
  const user = await User.findById(req.user.id);
  // console.log(req.user.id) 
  res.status(200).json({
    success:true,
    user
  })
})

//update password
const updatePassword = handleAsyncError(async (req,res,next)=>{
  const user = await User.findById(req.user.id).select("+password");
  const {oldPassword , newPassword , confirmPassword} = req.body;
  if(!oldPassword || !newPassword || !confirmPassword){
    return next(new handleError("Please enter all fields",400));
  }
  const isPasswordValid = await user.verifyPassword(oldPassword);
  if(!isPasswordValid){
    return next(new handleError("Old password is incorrect",400));
  }
  if(newPassword !== confirmPassword){
    return next(new handleError("New password and confirm password do not match",400));
  }
  user.password = newPassword;
  await user.save();
  sendToken(user,200,res);
})

//updating user profile
const updateProfile = handleAsyncError(async (req, res, next) => {
  const { name, email, avatar } = req.body;

  const updateUserDetail = { name, email };

  if (avatar !== "") {
    const currentUser = await User.findById(req.user.id);
    const imageId = currentUser.avatar.public_id;
    await cloudinary.uploader.destroy(imageId);
    
    // Upload new avatar
    const myCloud = await cloudinary.uploader.upload(avatar, {
      folder: "avatars",
      width: 150,
      crop: "scale",
    });

    updateUserDetail.avatar = {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    };
  }

  const user = await User.findByIdAndUpdate(req.user.id, updateUserDetail, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    message: "Profile Updated Successfully",
    user,
  });
});


// Admin - Getting user information
const getUserList = handleAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({
    success: true,
    user,
  });
});

//Admin - Getting single user information
const getSingleUser = handleAsyncError(async (req, res, next) => { 
  const user = await User.findById(req.params.id);
  if(!user){
    return next(new handleError(`User does not exist with id: ${req.params.id}` , 404));
  }
  res.status(200).json({
    success: true,
    user,
  });
});

//Admin - Changing user role
const updateUserRole = handleAsyncError(async (req, res, next) => {
  const { role } = req.body;
  const updateUserDetail = {
    role,
  };
  const user = await User.findByIdAndUpdate(req.params.id, updateUserDetail, {
    new: true,
    runValidators: true,
  });
  if (!user) {
    return next(new handleError(`User does not exist with id: ${req.params.id}`, 404));
  }
  res.status(200).json({
    success: true,
    message: "User Role Updated Successfully",
    user,
  })
});

//Admin - Deleting user Profile
const deleteUser = handleAsyncError(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    return next(new handleError(`User does not exist with id: ${req.params.id}`, 404));
  }
  res.status(200).json({
    success: true,
    message: "User Deleted Successfully",
  });
});

export default {
  registerUser,
  loginUser,
  logout,
  resetPassword,
  resetPasswordHandler,
  getUserDetails,
  updatePassword,
  updateProfile,
  getUserList,
  getSingleUser,
  updateUserRole,
  deleteUser  
};
