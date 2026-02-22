import React, { useEffect, useState } from 'react';
import '../assets/styles/Navigation.css';
import { FaBars, FaTimes } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getCurrentUser } from "../utils/sessionUser.js";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userid, setUserid] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const user = getCurrentUser();
    setUserid(user?.uid || "");
  }, [location.pathname]);

  const handleLogout = () => {
    sessionStorage.removeItem("userData");
    setUserid("");
    setIsMenuOpen(false);
    navigate("/login", { replace: true });
  };

  return (
    <nav className="nav-container">
      <div className="nav-content">
        <div className="nav-logo">
          <Link to="/" className="nav-logo-link">
            <img src="/K.png" alt="KryVervoer" className="nav-logo-icon" style={{ width: '50px', height: '50px' }} />
            <span className="nav-logo-text">KryVervoer</span>
          </Link>
        </div>

        <button className="nav-toggle" onClick={toggleMenu} aria-label="Toggle menu">
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </button>

        <div className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
          {!userid ? (
            <div>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/signup" className="nav-link">Signup</Link>
            </div>
          ) : <div />}

          <Link to="/finddriver" className="nav-link">Find a Driver</Link>
          <Link to="/profile" className="nav-link">Profile</Link>
          <Link to="/chats" className="nav-link">Chats</Link>
          <Link to="/about" className="nav-link">About</Link>
          <Link to="/privacy" className="nav-link">Privacy</Link>
          {userid ? (
            <div>
              <div onClick={handleLogout} className="nav-link">Logout</div>
            </div>
          ) : <div />}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
