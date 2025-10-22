import React, { useEffect, useState } from "react";
import "../pageStyles/ProductDetails.css";
import PageTitle from "../components/PageTitle";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Rating from "@mui/material/Rating";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  getProductDetails,
  removeError,
} from "../features/products/productSlice";
import { toast } from "react-toastify";
import { addItemsToCart } from "../features/cart/cartSlice";

function ProductDetail() {
  const [userRating, setUserRating] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { loading, error, product } = useSelector((state) => state.product);
  const {loading: cartLoading, error: cartError, message , success ,cartItems} = useSelector((state) => state.cart);  
  const dispatch = useDispatch();
  const { id } = useParams();

  useEffect(() => {
    if (id) dispatch(getProductDetails(id));
    return () => dispatch(removeError());
  }, [dispatch, id]);

  useEffect(() => {
    if (error) {
      toast.error(error.message || error, {
        position: "top-center",
        autoClose: 3000,
      });
      dispatch(removeError());
    }
    if (cartError) {
      toast.error(cartError.message || cartError, {
        position: "top-center",
        autoClose: 3000,
      });
      dispatch(removeError());
    }
  }, [dispatch, error , cartError]);

  useEffect(() => {
    if (success) {
      toast.success(message , {
        position: "top-center",
        autoClose: 3000,
      });
      dispatch(removeError());
    }
    
  }, [dispatch, success , message]);

  if (loading) {
    return (
      <>
        <Navbar />
        <p style={{ textAlign: "center" }}>Loading...</p>
        <Footer />
      </>
    );
  }

  if (error || !product) {
    return (
      <>
        <PageTitle title="Product - Details" />
        <Navbar />
        <h1 style={{ textAlign: "center" }}>Product not found</h1>
        <Footer />
      </>
    );
  }

  const decreaseQuantity = () => {
    if (quantity <= 1) {
      toast.error("Quantity cannot be less than 1", {
        position: "top-center",
        autoClose: 3000,
      });
      dispatch(removeError());
      return;
    }
    setQuantity((qty) => qty - 1);
  };

  const increaseQuantity = () => {
    if (product.stock <= quantity) {
      toast.error("Cannot add more items than available in stock", {
        position: "top-center",
        autoClose: 3000,
      });
      dispatch(removeError());
      return;
    }
    setQuantity((qty) => qty + 1);
  };

  const addToCart = () => {
    if (product.stock < 1) {
      toast.error("Product is out of stock", {
        position: "top-center",
        autoClose: 3000,
      });
      dispatch(removeError());
      return;
    }
    dispatch(addItemsToCart({ id, quantity }));
  };
  return (
    <>
      <PageTitle title={`${product.name} - Details`} />
      <Navbar />

      <div className="product-details-container">
        <div className="product-detail-container">
          <div className="product-image-container">
            <img
              src={product?.images?.[0]?.url || "/placeholder.png"}
              alt={product.name}
              className="product-detail-image"
            />
          </div>

          <div className="product-info">
            <h2>{product.name}</h2>
            <p className="product-description">{product.description}</p>
            <p className="product-price">Price: {product.price} /-</p>

            <div className="product-rating">
              <Rating value={product.ratings} readOnly />
              <span className="productCardSpan">
                ({product.numOfReviews}{" "}
                {product.numOfReviews === 1 ? "Review" : "Reviews"})
              </span>
            </div>

            <div className="stock-status">
              <span className={product.stock > 0 ? "in-stock" : "out-of-stock"}>
                {product.stock > 0
                  ? `In Stock (${product.stock} available)`
                  : "Out of Stock"}
              </span>
            </div>

            {product.stock > 0 && (
              <>
                <div className="quantity-controls">
                  <span className="quantity-label">Quantity</span>
                  <button
                    className="quantity-button"
                    onClick={decreaseQuantity}
                  >
                    -
                  </button>
                  <input
                    type="text"
                    value={quantity}
                    className="quantity-value"
                    readOnly
                  />
                  <button
                    className="quantity-button"
                    onClick={increaseQuantity}
                  >
                    +
                  </button>
                </div>
                <button className="add-to-cart-btn" onClick={addToCart} disabled={cartLoading}>{cartLoading ? "Adding to Cart..." : "Add to Cart"}</button>
              </>
            )}

            <form className="review-form">
              <h3>Write a Review</h3>
              <Rating
                value={userRating}
                onChange={(e, newValue) => setUserRating(newValue)}
              />
              <textarea
                placeholder="Write your review here..."
                className="review-input"
              />
              <button type="submit" className="submit-review-btn">
                Submit Review
              </button>
            </form>
          </div>
        </div>

        <div className="reviews-container">
          <h3>Customer Reviews</h3>
          {product.reviews && product.reviews.length > 0 ? (
            <div className="reviews-section">
              {product.reviews.map((review, index) => (
                <div className="review-item" key={index}>
                  <div className="review-header">
                    <Rating value={review.rating} readOnly />
                  </div>
                  <p className="review-comment">{review.comment}</p>
                  <p className="review-name">By {review.name}</p>
                </div>
              ))}
            </div>
          ) : (
            <p>No reviews yet. Be the first to review this product!</p>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}

export default ProductDetail;
