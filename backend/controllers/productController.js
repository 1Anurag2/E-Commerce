import Product from "../models/productModel.js";
import handleError from "../utils/handleError.js";
import handleAsyncError from "../middleware/handleAsyncError.js";
import APIFunctionality from "../utils/apiFunctionality.js";

// Get All Products
const getAllProducts = handleAsyncError(async (req, res, next) => {
  // console.log(req.query);
  const resultPerPage = 10;
  const apiFeatures = new APIFunctionality(Product.find(), req.query)
    .search()
    .filter();
  // console.log(apiFeatures)

  const filteredQuery = apiFeatures.query.clone();
  const productCount = await filteredQuery.countDocuments();

  const totalPages = Math.ceil(productCount / resultPerPage);
  const page = Number(req.query.page) || 1;
  if (page > totalPages && productCount > 0) {
    return next(new handleError("This page doesn't exit", 404));
  }
  // apply pagination
  apiFeatures.pagination(resultPerPage);
  const products = await apiFeatures.query;

  if (!products || products.length == 0) {
    return next(new handleError("No Product Found", 404));
  }
  res.status(200).json({
    success: true,
    products,
    productCount,
    resultPerPage,
    totalPages,
    currentPage: page,
  });
});

// Create Product
const createSingleProduct = handleAsyncError(async (req, res, next) => {
  req.body.user = req.user.id;
  //  console.log(req.user);

  const product = await Product.create(req.body);
  res.status(201).json({
    success: true,
    product,
  });
});

// Get Single Product Details
const getSingleProduct = handleAsyncError(async (req, res, next) => {
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

// Update Product
const updateProduct = handleAsyncError(async (req, res, next) => {
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

//Delete Product
const deleteProduct = handleAsyncError(async (req, res, next) => {
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

//Creating and Updating Product Review
const createReviewForProduct = handleAsyncError(async (req, res, next) => {
  const { rating, comment, productId } = req.body;

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  const product = await Product.findById(productId);

  const isReviewed = product.reviews.find(
    (rev) => rev.user.toString() === req.user.id.toString()
  );

  if (isReviewed) {
    product.reviews.forEach((rev) => {
      if (rev.user.toString() === req.user.id.toString()) {
        (rev.rating = rating), (rev.comment = comment);
      }
    });
  } else {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }

  product.ratings =
    product.reviews.reduce((acc, item) => item.rating + acc, 0) /
    product.reviews.length;

  await product.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
  });
});

//Getting reviews
const getProductReviews = handleAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.query.id);
  if (!product) {
    return next(new handleError("Product not found", 404));
  }
  res.status(200).json({
    success: true,
    reviews: product.reviews,
  });
});

//Deleting Review
const deleteReview = handleAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.query.productId);
  if (!product) {
    return next(new handleError("Product not found", 404));
  }
  const reviews = product.reviews.filter(
    (review) => review._id.toString() !== req.query.id.toString()
  );
  console.log(reviews);
  let sum = 0;
  reviews.forEach((review) => {
    sum += review.rating;
  });
  const ratings = reviews.length > 0 ? sum / reviews.length : 0;
  const numOfReviews = reviews.length;
  await Product.findByIdAndUpdate(
    req.query.productId,
    {
      reviews,
      ratings,
      numOfReviews,
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );
  res.status(200).json({
    success: true,
    message: "Review deleted successfully",
  });
});
// Admin - Getting all products
const getAdminProducts = handleAsyncError(async (req, res, next) => {
  const products = await Product.find();
  res.status(200).json({
    success: true,
    products,
  });
});

export default {
  getAllProducts,
  getSingleProduct,
  createSingleProduct,
  updateProduct,
  deleteProduct,
  getAdminProducts,
  createReviewForProduct,
  getProductReviews,
  deleteReview,
};
