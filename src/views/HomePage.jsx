import Navigation from "../components/Navigation.jsx";
import MainSection from "../components/MainSection.jsx";
import Footer from "../components/Footer.jsx";
import React from "react";

export default function HomePage(){
    return(
        <>
            <div className="App">
                <MainSection />
                <Footer />
            </div>
        </>
    )
}