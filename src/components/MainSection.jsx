
import React from 'react';
import SchoolBus from '/SchoolBus.png';
import '../assets/styles/Main.css';
import { useNavigate } from "react-router-dom";

export default function MainSection() {
        const navigate = useNavigate();
    return (
        <div className="main-container">
            <div className="main-text">
                <h1>EDUTRANSIT</h1>
                <p>
                    EduTransit helps parents quickly find safe and trusted school transport options for their children, or register their vehicle with ease.
                    We connect parents with reliable drivers to ensure peace of mind during daily school commutes.
                    Whether you're a parent looking for dependable transport or a driver ready to offer services, you're in the right place.
                    Join our growing network and experience a smarter way to manage school transportation.
                </p>
                <div className="main-buttons">
                    <button onClick={() => navigate("/finddriver")}>Find Transport</button>
                </div>
            </div>

            <div className="main-image">
                <img src={SchoolBus} alt="SchoolBus Illustration" />
            </div>
        </div>
    );
}

