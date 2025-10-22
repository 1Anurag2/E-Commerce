import { ref } from "process";
import handleAsyncError from "../middleware/handleAsyncError.js";
import { instance } from "../server.js";
import crypto from "crypto";

export const processPayment = handleAsyncError(async (req, res, next) => {
  try {
    const options = {
      amount: Number(req.body.amount * 100),
      currency: "INR",
    };
    const order = await instance.orders.create(options);
    res.status(200).json({ success: true, order });
  } catch (error) {
    next(error);
  }
});

//Send Api Key
export const sendApiKey = handleAsyncError(async (req, res, next) => {
  try {
    res.status(200).json({
    //   success: true,
      key: process.env.RAZORPAY_API_KEY,
    });
  } catch (error) {
    next(error);
  }
});

//Payment Verification
export const paymentVerification = handleAsyncError(
  async (req, res, next) => {
    try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
        req.body;
      const body = razorpay_order_id + "|" + razorpay_payment_id;
      const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_API_SECRET)
        .update(body.toString())
        .digest("hex");
      const isAuthentic = expectedSignature === razorpay_signature;
      if (isAuthentic) {
        return res.status(200).json({
          success: true,
          message: "Payment verified successfully",
          reference: razorpay_payment_id,
        });
      }else{
        return res.status(400).json({
          success: false,
          message: "Payment verification failed",
        });
      }
    } catch (error) {
      next(error);
    }
  }
);