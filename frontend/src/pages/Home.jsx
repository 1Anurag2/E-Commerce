import React, { useEffect } from "react";
import "../pageStyles/Home.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ImageSlider from "../components/ImageSlider";
import Product from "../components/Product";
import Loader from "../components/Loader";
import PageTitle from "../components/PageTitle";
import { useSelector, useDispatch } from "react-redux";
import { getProduct , removeError} from "../features/products/productSlice"; 
import { toast } from "react-toastify";

function Home() {
  const { loading, error, products, productCount } = useSelector(
    (state) => state.product
  );

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getProduct({keyword:""}));
  }, [dispatch]);

  useEffect(() => {
    if(error){
      toast.error(error.message,{position:"top-center",autoClose:3000})
      dispatch(removeError())
    }
  }, [dispatch,error]);
  return (
    <>
    <Loader/>
    {loading?(<Loader/>) : (<>
      <PageTitle title="Home - E-Commerce" />
      <Navbar />
      <ImageSlider />
      <div className="home-container">
        <h2 className="home-heading">Trending Products</h2>

        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>{error}</p>
        ) : (
          <div className="home-product-container">
            {products &&
              products.map((product, index) => (
                <Product product={product} key={index} />
              ))}
          </div>
        )}
      </div>
      <Footer />
    </>)}
    </>
  );
}

export default Home;
