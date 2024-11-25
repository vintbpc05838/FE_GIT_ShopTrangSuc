import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Dropdown } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";
import carouselImage1 from "../images/carousel-1.webp";
import carouselImage2 from "../images/carousel-2.webp";
import "../css/header.css";
import Cookies from 'js-cookie';

const images = [carouselImage1, carouselImage2];

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeNav, setActiveNav] = useState("home");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("token") !== null
  );
  const [userFullname, setUserFullname] = useState(
    localStorage.getItem("userName") || ""
  );

  const suggestions = [ // Define the suggestions array
    "Luke Skywalker",
    "C-3PO",
    "R2-D2",
    "Darth Vader",
    "Leia Organa",
  ];

  const navigate = useNavigate();
  const location = useLocation();

  const handleScroll = () => {
    setIsScrolled(window.scrollY > 50);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUserFullname = localStorage.getItem("userName");

    if (token && storedUserFullname) {
      setIsLoggedIn(true);
      setUserFullname(storedUserFullname);
    } else {
      setIsLoggedIn(false);
      setUserFullname("");
    }
  }, [isLoggedIn]);

  const handleLogout = () => {
    const token = Cookies.get("token"); // Lấy token từ cookie
    if (!token) {
        console.error("No token found");
        return;
    }
    
    fetch('http://localhost:8080/api/auth/logout', {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}` // Gửi token trong header
        }
    })
    .then(response => {
        if (response.ok) {
            // Xử lý thành công
            navigate('/login');
        } else {
            console.error('Logout failed');
        }
    })
    .catch(error => {
        console.error("Logout error:", error);
    });
};

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setFilteredSuggestions(
      suggestions.filter((suggestion) =>
        suggestion.toLowerCase().includes(value.toLowerCase())
      )
    );
  };

  return (
    <header>
      <nav className={`navbar navbar-expand-lg fixed-top ${isScrolled ? "navbar-scrolled" : "navbar-light"}`}>
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">
            <img alt="Logo" src="https://bizweb.dktcdn.net/100/376/737/themes/894814/assets/logo.png?1676271560514" />
          </Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarExample01">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarExample01">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item me-3">
                <Link className={`nav-link ${activeNav === "home" ? "selected" : ""}`} to="/" onClick={() => setActiveNav("home")}>Trang chủ</Link>
              </li>
              <li className="nav-item me-3">
                <Link className={`nav-link ${activeNav === "about" ? "selected" : ""}`} to="/about" onClick={() => setActiveNav("about")}>Giới Thiệu</Link>
              </li>
              <li className="nav-item me-3">
                <Link className={`nav-link ${activeNav === "products" ? "selected" : ""}`} to="/product" onClick={() => setActiveNav("products")}>Sản phẩm</Link>
              </li>
              <li className="nav-item me-3">
                <Link className={`nav-link ${activeNav === "contact" ? "selected" : ""}`} to="/contact" onClick={() => setActiveNav("contact")}>Liên hệ</Link>
              </li>
              <li className="nav-item me-3">
                <Link className={`nav-link ${activeNav === "news" ? "selected" : ""}`} to="/news" onClick={() => setActiveNav("news")}>Tin tức</Link>
              </li>
            </ul>
            <div className="d-flex align-items-center">
              <div className="position-relative me-2">
                <input type="text" placeholder="Tìm kiếm" value={searchTerm} onChange={handleChange} className="form-search" />
                {searchTerm && filteredSuggestions.length > 0 && (
                  <ul className="list-group position-absolute" style={{ zIndex: 1000 }}>
                    {filteredSuggestions.map((suggestion, index) => (
                      <li className="list-group-item" key={index}>{suggestion}</li>
                    ))}
                  </ul>
                )}
              </div>
              <Dropdown>
                <Dropdown.Toggle className="btn-account" id="dropdown-basic">
                  {isLoggedIn ? userFullname : "Tài khoản"}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {isLoggedIn ? (
                    <>
                      <Dropdown.Item as={Link} to="/personal-information">Thông tin cá nhân</Dropdown.Item>
                      <Dropdown.Item as="button" onClick={handleLogout}>Đăng xuất</Dropdown.Item>
                    </>
                  ) : (
                    <>
                      <Dropdown.Item as={Link} to="/login">Đăng nhập</Dropdown.Item>
                      <Dropdown.Item as={Link} to="/register">Đăng ký</Dropdown.Item>
                    </>
                  )}
                </Dropdown.Menu>
              </Dropdown>
              <Link to="/shoppingcart" className="btn btn-outline-light ms-2">
                <i className="bi bi-cart"></i>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div id="carouselExample" className="carousel slide" data-bs-ride="false">
        <div className="carousel-inner">
          {images.map((image, index) => (
            <div className={`carousel-item ${index === currentIndex ? "active" : ""}`} key={index}>
              <img src={image} className="d-block w-100 carousel-image" alt={`Hình ${index + 1}`} />
            </div>
          ))}
        </div>
        <button className="carousel-control-prev" type="button" data-bs-target="#carouselExample" data-bs-slide="prev" onClick={() => setCurrentIndex((currentIndex - 1 + images.length) % images.length)}>
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#carouselExample" data-bs-slide="next" onClick={() => setCurrentIndex((currentIndex + 1) % images.length)}>
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>
    </header>
  );
};

export default Header;