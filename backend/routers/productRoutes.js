import productController from "../controllers/productController.js";
import express from "express";
import {verifyUserAuth} from "../middleware/userAuth.js"

const router = express.Router();

router.route("/products").get(verifyUserAuth,productController.getAllProducts).post(productController.createSingleProduct);
router.route("/product/:id").get(verifyUserAuth,productController.getSingleProduct).put(productController.updateProduct).delete(productController.deleteProduct);



export default router;