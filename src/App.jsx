import React from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import './assets/styles/App.css';
import HomePage from "./views/HomePage.jsx";
import About from './pages/About';
import Drivers from './pages/Drivers';
import PrivacyPolicy from './pages/PrivacyPolicy';
import SignUp from "./components/SignUp.jsx";
import Login from "./components/Login.jsx";
import Navigation from "./components/Navigation.jsx";
import MapWithPoints from "./components/MapWithPoints.jsx";
import Profile from "./components/Profile.jsx";
import EditProfile from "./components/EditProfile.jsx";
import DriverReview from "./components/DriverReview.jsx";
import AllReview from "./components/AllReview.jsx";
import FileTicket from "./components/FileTicket.jsx";
import ViewTickets from "./components/ViewTickets.jsx";
import DriverReporting from "./components/DriverReporting.jsx";
import ChatPage from "./pages/ChatPage.jsx";



function App() {
    return (
        <BrowserRouter>
            <Navigation></Navigation>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/tickets" element={<FileTicket />} />
                <Route path="/tickets/view" element={<ViewTickets />} />
                <Route path="/profile" element={<Profile/>}/>
                <Route path="/edit-profile" element={<EditProfile/>}/>
                <Route path="/about" element={<About/>}/>
                <Route path="/drivers" element={<Drivers/>}/>
                <Route path="/privacy" element={<PrivacyPolicy/>}/>
                <Route path="/signup" element={<SignUp/>}/>
                <Route path="/login" element={<Login />} />
                <Route path="/finddriver" element={<MapWithPoints/>}/>
                <Route path="/reviews/:id" element={<DriverReview />} />
                <Route path="/reviews" element={<AllReview />} />
                {/* Fixed the route path to match your navigation */}
                <Route path="/reportdriver/:id" element={<DriverReporting />} />
               <Route path="/messagedriver/:driverId/:parentId" element={<ChatPage />} />

            </Routes>
        </BrowserRouter>
    );
}

export default App;