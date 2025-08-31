import React, { useState} from "react";
import { Link } from "react-router-dom";
import "../componentStyles/Product.css";
import Rating from "./Rating";
function Product({ product }) {
    const [rating, setRating] =useState(0);
    const handleRatingChange = (newRating) => {
      setRating(rating);
      console.log(`Rating changed to: ${newRating}`);
    }

  return (
    <Link to={product.id} className="product_id">
      <div className="product-card">
        <img src={product.image[0]} alt="Product" />
        <div className="product-details">
          <h3 className="product-title">{product.title}</h3>
          <p className="product-price">
            <strong>Price </strong>
            {product.price}/-
          </p>
          <div className="rating_container">
            <Rating value={product.rating} onRatingChange={handleRatingChange} disabled ={true}/>
          </div>
          <div className="productCardSpan">
            {product.numOfReviews} {product.numOfReviews > 1 ? "Reviews" : "Review"}
          </div>
          <button className="add-to-cart">Add to Cart</button>
        </div>
      </div>
    </Link>
  );
}

export default Product;
