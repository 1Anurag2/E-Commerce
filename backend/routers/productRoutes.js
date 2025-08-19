import productController from "../controllers/productController.js";
import express from "express";
const router = express.Router();

router.route("/products").get(productController.getAllProducts).post(productController.createSingleProduct);
router.route("/product/:id").get(productController.getSingleProduct).put(productController.updateProduct).delete(productController.deleteProduct);



export default router;