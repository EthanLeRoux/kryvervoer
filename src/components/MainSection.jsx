
import React from 'react';
import SchoolBus from '/SchoolBus.png';
import '../assets/styles/Main.css';
import { useNavigate } from "react-router-dom";

export default function MainSection() {
        const navigate = useNavigate();
    return (
        <div className="main-container">
            <div className="main-text">
                <p>
                    KryVervoer makes school transport simple and secure.
                    Find trusted drivers for your child's daily school commute — all in one place.

                    Whether you’re a parent looking for safe, reliable transport or a driver offering school transport services, Kryvervoer connects you with ease.

                    Join a growing network focused on safety, trust, and peace of mind.
                </p>
                <div className="main-buttons">
                    <button onClick={() => navigate("/finddriver")}>Find a driver</button>
                </div>
            </div>

            {/* <div className="main-image">
                <img src={SchoolBus} alt="SchoolBus Illustration" />
            </div> */}
        </div>
    );
}

