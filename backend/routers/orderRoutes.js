import express from "express";
import orderController from "../controllers/orderController.js";
import { roleBasedAccess, verifyUserAuth } from "../middleware/userAuth.js";
import e from "express";
const router = express.Router();

router.route("/order/new").post(verifyUserAuth, orderController.createOrder);
router.route("/orders/user").get(verifyUserAuth, orderController.allMyOrders);


router
    .route("/admin/orders")
    .get(
        verifyUserAuth,
        roleBasedAccess("admin"),
        orderController.getAllOrders
    );

router
    .route("/admin/order/:id")
    .get(
        verifyUserAuth,
        roleBasedAccess("admin"),
        orderController.getSingleOrder
    )
    .put(
        verifyUserAuth,
        roleBasedAccess("admin"),
        orderController.updateOrder
    )
    .delete(
        verifyUserAuth,
        roleBasedAccess("admin"),
        orderController.deleteOrder
    );

export default router;