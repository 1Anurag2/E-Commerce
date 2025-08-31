import React from "react";
import "../pageStyles/Home.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ImageSlider from "../components/ImageSlider";
import Product from "../components/Product";

const products = [
  {
    id: 1,
    title: "Laptop",
    price: 49560,
    image: ["https://m.media-amazon.com/images/I/71YpUx0XFdL._AC_SL1500_.jpg"],
    rating: 5,
    numOfReviews: 25,
  },

  {
    id: 2,
    title: "Sony TV",
    price: 29999,
    image: ["https://m.media-amazon.com/images/I/71O52HAQvUL.jpg"],
    rating: 3,
    numOfReviews: 5,
  },
  {
    id: 3,
    title: "Camera",
    price: 35000,
    image: [
      "https://tse3.mm.bing.net/th/id/OIP.woHIMcrWnNWpCwV4alxyngHaE8?pid=Api&P=0&h=180",
    ],
    rating: 2,
    numOfReviews: 1,
  },
];
function Home() {
  return (
    <>
      <Navbar />
      <ImageSlider />
      <div className="home-container">
        <h2 className="home-heading">Trending Products</h2>
        <div className="home-product-container">
          {products.map((product, index) => (
            <Product product={product} key={index} />
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Home;
