import productController from "../controllers/productController.js";
import express from "express";
import { roleBasedAccess, verifyUserAuth } from "../middleware/userAuth.js";

const router = express.Router();

router.route("/products").get(productController.getAllProducts);

router
  .route("/admin/products")
  .get(
    verifyUserAuth,
    roleBasedAccess("admin"),
    productController.getAdminProducts
  );

router
  .route("/admin/product/create")
  .post(
    verifyUserAuth,
    roleBasedAccess("admin"),
    productController.createSingleProduct
  );

router
  .route("/admin/product/:id")
  .put(
    verifyUserAuth,
    roleBasedAccess("admin"),
    productController.updateProduct
  )
  .delete(
    verifyUserAuth,
    roleBasedAccess("admin"),
    productController.deleteProduct
  );

router
  .route("/product/:id")
  .get(verifyUserAuth, productController.getSingleProduct);

router
  .route("/review")
  .put(verifyUserAuth, productController.createReviewForProduct);

export default router;
