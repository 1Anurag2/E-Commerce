import Product from "../models/productModel.js";
import handleError from "../utils/handleError.js";
import handleAsyncError from "../middleware/handleAsyncError.js";

const getAllProducts = handleAsyncError(async (req, res , next) => {
  try {
    const products = await Product.find({});
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const createSingleProduct = handleAsyncError(async (req, res , next) => {
  // const { name, image,category, description, price, stock , numOfReviews ,  } = req.body;
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const getSingleProduct = handleAsyncError(async (req, res , next) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
    if (!product) {
      return next(new handleError("Product not found", 404));
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const updateProduct = handleAsyncError(async (req, res , next) => {
  const productData = await Product.findById(req.params.id);
  if (!productData) {
    return next(new handleError("Product not found", 404));
  }
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!product) {
    return next(new handleError("Product not found", 404));
  }
  res
    .status(200)
    .json({ success: true, message: "Product updated successfully", product });
});

const deleteProduct = handleAsyncError(async (req, res , next) => {
  const { id } = req.params;
  try {
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return next(new handleError("Product not found", 404));
    }
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default {
  getAllProducts,
  getSingleProduct,
  createSingleProduct,
  updateProduct,
  deleteProduct,
};
