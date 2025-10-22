import React, { useEffect, useState } from "react";
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
import Pagination from "../components/Pagination";
import { useLocation, useNavigate } from "react-router-dom";

function Home() {
  const { loading, error, products, productCount,totalPages } = useSelector(
    (state) => state.product
  );
  const location = useLocation();
  const navigate = useNavigate();
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

  const searchParams = new URLSearchParams(location.search);
    const category = searchParams.get("category");
    const keyword = searchParams.get("keyword");
    const pageFromURL = parseInt(searchParams.get("page"), 10) || 1;
  
    const [currentPage, setCurrentPage] = useState(pageFromURL);
  
    // Fetch products whenever keyword or page changes
    useEffect(() => {
      dispatch(getProduct({ keyword, page: currentPage, category }));
    }, [dispatch, keyword, currentPage, category]);
  
    // Handle errors with toast
    useEffect(() => {
      if (error) {
        toast.error(error?.message || error, {
          position: "top-center",
          autoClose: 3000,
        });
        dispatch(removeError());
      }
    }, [dispatch, error]);
  
    // Pagination handler
    const handlePageChange = (page) => {
      if (page !== currentPage) {
        setCurrentPage(page);
        const newSearchParams = new URLSearchParams(location.search);
  
        if (page === 1) {
          newSearchParams.delete("page");
        } else {
          newSearchParams.set("page", page);
        }
  
        navigate(`?${newSearchParams.toString()}`);
      }
    };
  
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
      <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
      <Footer />
    </>)}
    </>
  );
}

export default Home;
