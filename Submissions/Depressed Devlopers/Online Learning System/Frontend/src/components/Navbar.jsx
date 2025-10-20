import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          Skill-Bridge
        </Link>

        <div className="nav-links">
          <Link to="/" className="nav-link">
            Home
          </Link>
          <Link to="/courses" className="nav-link">
            Courses
          </Link>
          <Link to="/login" className="nav-link">
            Login
          </Link>
          <Link to="/register" className="nav-link">
            Register
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
