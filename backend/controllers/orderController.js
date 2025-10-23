import Order from '../models/orderModel.js';
import Product from '../models/productModel.js';
import User from '../models/userModel.js';
import handleError from '../utils/handleError.js';
import handleAsyncError from '../middleware/handleAsyncError.js';

// Create New Order
export const createOrder = handleAsyncError(async (req, res, next) => {
    const { shippingInfo, orderItems, paymentInfo, itemsPrice, taxPrice, shippingPrice, totalPrice } = req.body;
    const order = await Order.create({
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paidAt: Date.now(),
        user: req.user._id
    });
    res.status(201).json({
        success: true,
        order
    });
});

// Get Single Order
export const getSingleOrder = handleAsyncError(async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate("user", "name email");
    if (!order) {
        return next(new handleError("Order not found", 404));
    }
    res.status(200).json({
        success: true,
        order
    });
});

// All my orders
export const allMyOrders = handleAsyncError(async (req, res, next) => {
    const orders = await Order.find({ user: req.user._id });
    console.log("User from verifyUserAuth:", req.user);

    if (!orders) {
        return next(new handleError("Orders not found", 404));
    }
    res.status(200).json({
        success: true,
        orders
    });
});

// Getting all orders -- Admin
export const getAllOrders = handleAsyncError(async (req, res, next) => {
    const orders = await Order.find();
    if (!orders) {
        return next(new handleError("Orders not found", 404));
    }
    let totalAmount = 0;
    orders.forEach(order => {
        totalAmount += order.totalPrice;
    });
    res.status(200).json({
        success: true,
        orders,
        totalAmount
    });
});

// Update Order Status -- Admin
export const updateOrder = handleAsyncError(async (req, res, next) => {
    const order = await Order.findById(req.params.id);
    if (!order) {
        return next(new handleError("Order not found", 404));
    }
    if (order.orderStatus === "Delivered") {
        return next(new handleError("This order is already delivered", 400));
    }
    await Promise.all(order.orderItems.map( item => updateQuantity(item.product, item.quantity) ));
    
    order.orderStatus = req.body.status;
    if (req.body.status === "Delivered") {
        order.deliveredAt = Date.now();
    }
    await order.save({ validateBeforeSave: false });
    res.status(200).json({
        success: true,
        order
    });
});
async function updateQuantity(id, quantity) {
    const product = await Product.findById(id);
    if (!product) {
        return new handleError("Product not found", 404);
    }
    product.stock -= quantity;
    await product.save({ validateBeforeSave: false });
}


// Delete Order -- Admin
export const deleteOrder = handleAsyncError(async (req, res, next) => {
    const order = await Order.findById(req.params.id);
    if (!order) {
        return next(new handleError("Order not found", 404));
    }
    if(order.orderStatus !== "Delivered") {
        return next(new handleError("This order is under Processing and can not be deleted", 400));
    }
    await order.deleteOne({_id: req.params.id});
    res.status(200).json({
        success: true,
        message: "Order deleted successfully"
    });
});

export default {
    createOrder, 
    getSingleOrder,
    allMyOrders,
    getAllOrders,
    updateOrder,
    deleteOrder
}