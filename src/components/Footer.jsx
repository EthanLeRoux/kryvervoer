import React from 'react';
import '../assets/styles/Footer.css';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-links">
                <Link to="/about">About</Link>
                <Link to="/drivers">Drivers</Link>
                <Link to="/privacy">Privacy Policy</Link>
            </div>
            <p>&copy; {new Date().getFullYear()} EduTransit. All rights reserved.</p>
        </footer>
    );
};

export default Footer;