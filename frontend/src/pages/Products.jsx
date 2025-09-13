import React, { useState, useEffect } from "react";
import "../pageStyles/Products.css";
import PageTitle from "../components/PageTitle";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useDispatch, useSelector } from "react-redux";
import Product from "../components/Product";
import { getProduct, removeError } from "../features/products/productSlice";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import { useLocation, useNavigate } from "react-router-dom";
import NoProducts from "../components/NoProducts";
import Pagination from "../components/Pagination";

function Products() {
  const { loading, error, products, resultPerPage, productCount, totalPages } =
    useSelector((state) => state.product);

  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const categories = [
    "Shirt",
    "Laptop",
    "Phone",
    "Camera",
    "Tablet",
    "Washing Machine",
    "Cooler",
    "Refrigerator",
    "Headphones",
    "Microwave",
    "TV",
  ];

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

  const handleCategoryClick = (category) => {
    const newSearchParams = new URLSearchParams(location.search);
    newSearchParams.set("category", category);
    newSearchParams.delete("page");
    navigate(`?${newSearchParams.toString()}`);
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <PageTitle title="All Products" />
          <Navbar />
          <div className="products-layout">
            <div className="filter-section">
              <h3 className="filter-heading">Categories</h3>
              {/* TODO: Render Categories */}
              <ul>
                {categories.map((category) => {
                  return (
                    <li
                      key={category}
                      onClick={() => handleCategoryClick(category)}
                    >
                      {category}
                    </li>
                  );
                })}
              </ul>
            </div>

            {products.length > 0 ? (
              <div className="product-section">
                <div className="products-product-container">
                  {products.map((product) => (
                    <Product key={product._id} product={product} />
                  ))}
                </div>
              </div>
            ) : (
              <NoProducts keyword={keyword} />
            )}
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
          <Footer />
        </>
      )}
    </>
  );
}

export default Products;
