import React, { useEffect, useState } from 'react';
import '../assets/styles/Navigation.css';
import { FaBars, FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [userid, setUserid] = useState("");

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const storedUser = JSON.parse(sessionStorage.getItem("userData")) || {};
    const user = Array.isArray(storedUser) ? storedUser[0] : storedUser;
    setUserid(user.uid || "");
    }, []);

const handleLogout = () => {
        sessionStorage.removeItem("userData");
        navigate("/login");
    };

  return (
    <nav className="nav-container">
      <div className="nav-content">
        {/* Left side: Logo/Title */}
        <div className="nav-logo">
          <Link to="/" className="nav-logo-link">
            <img src="/K.png" alt="KryVervoer" className="nav-logo-icon" style={{ width: '50px', height: '50px' }} />
            <span className="nav-logo-text">KryVervoer</span>
          </Link>
        </div>

        {/* Right side: Links */}
        <button
          className="nav-toggle"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </button>

        <div className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
            {
                !userid?<div>          
                    <Link to="/login" className="nav-link">Login</Link>
                    <Link to="/signup" className="nav-link">Signup</Link>
                </div>:
                <div></div>
            }

          <Link to="/finddriver" className="nav-link">Find a Driver</Link>
          <Link to="/profile" className="nav-link">Profile</Link>
          <Link to="/chats" className="nav-link">Chats</Link>
          <Link to="/about" className="nav-link">About</Link>
          <Link to="/privacy" className="nav-link">Privacy</Link>
          {
            
            userid?<div>
              <button onClick={handleLogout} className="nav-link">Logout</button>
            </div>:<div></div>
          }
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
