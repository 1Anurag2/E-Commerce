import React, { useState } from "react";
import "../componentStyles/Navbar.css";
import { Link, useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import CloseIcon from "@mui/icons-material/Close";
import MenuIcon from "@mui/icons-material/Menu";
import "../pageStyles/Search.css";
import { useSelector } from "react-redux";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const toggleSearch = () => setIsSearchOpen(!isSearchOpen);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const {isAuthenticated} = useSelector((state) => state.user);

  const navigate = useNavigate();
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?keyword=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate(`/products `);
    }
    setSearchQuery("");
  };
  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <div className="navbar-logo">
          <Link to="/" onClick={() => setIsMenuOpen(false)}>
            Zupp
          </Link>
        </div>

        {/* Links */}
        <div className={`navbar-links ${isMenuOpen ? "active" : ""}`}>
          <ul>
            <li>
              <Link to="/" onClick={() => setIsMenuOpen(false)}>
                Home
              </Link>
            </li>
            <li>
              <Link to="/products">Products</Link>
            </li>
            <li>
              <Link to="/about-us">About Us</Link>
            </li>
            <li>
              <Link to="/contact-us">Contact Us</Link>
            </li>
          </ul>
        </div>

        {/* Icons */}
        <div className="navbar-icons">
          {/* Search */}
          <div className="search-container">
            <form
              className={`search-form ${isSearchOpen ? "active" : ""}`}
              onSubmit={handleSearchSubmit}
            >
              <input
                className="search-input"
                type="text"
                placeholder="Search products"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                type="button"
                className="search-icon"
                onClick={toggleSearch}
              >
                <SearchIcon focusable="false" />
              </button>
            </form>
          </div>

          {/* Cart */}
          <div className="cart-container">
            <Link to="/cart">
              <ShoppingCartIcon className="icon" />
            </Link>
          </div>

          {/* Register */}
          {!isAuthenticated && (
            <Link to="/register" className="register-link">
              <PersonAddIcon className="icon" />
            </Link>
          )}

          {/* Hamburger */}
          <div className="navbar-hamburger" onClick={toggleMenu}>
            {isMenuOpen ? (
              <CloseIcon className="icon" />
            ) : (
              <MenuIcon className="icon" />
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
