import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../componentStyles/Product.css";
import Rating from "./Rating";
function Product({ product }) {
  const [rating, setRating] = useState(0);
  const handleRatingChange = (newRating) => {
    setRating(rating);
    console.log(`Rating changed to: ${newRating}`);
  };

  return (
    <Link to={`/product/${product._id}`} className="product_id">
      <div className="product-card">
        <img
          src={
            product.images && product.images.length > 0
              ? product.images[0].url
              : "/placeholder.png"
          }
          alt={product.name}
          className="product-image-card"
        />{" "}
        <div className="product-details">
          <h3 className="product-title">{product.name}</h3>
          <p className="product-price">
            <strong>Price </strong>
            {product.price}/-
          </p>
          <div className="rating_container">
            <Rating
              value={product.ratings}
              onRatingChange={handleRatingChange}
              disabled={true}
            />
          </div>
          <div className="productCardSpan">
            {product.numOfReviews}{" "}
            {product.numOfReviews > 1 ? "Reviews" : "Review"}
          </div>
          <button className="add-to-cart">View Details</button>
        </div>
      </div>
    </Link>
  );
}

export default Product;
