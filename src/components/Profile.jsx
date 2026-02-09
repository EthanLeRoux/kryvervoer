import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import '../assets/styles/App.css';
import '../assets/styles/Profile.css';
import { updateDocument } from '../firebase/firebase.js';
import MessageModal from "../modals/MessageModal.jsx";

export default function Profile() {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [message, setMessage] = useState("");
    const [showIncompleteProfileModal, setShowIncompleteProfileModal] = useState(false);

    useEffect(() => {
        const storedUserData = sessionStorage.getItem("userData");
        
        if (storedUserData) {
            try {
                const parsedData = JSON.parse(storedUserData);
                
                const userData = parsedData[0];
                
                if (!userData) {
                    console.error("No user data found at index 0");
                    navigate("/login");
                    return;
                }

                setUserData(userData);
                
                // Check if profile is incomplete
                if (userData.locationSet === false || userData.pfpSet === false) {
                    setMessage('Please complete your profile by uploading an image of yourself and providing a rough estimation of where you live. This will be used to show drivers nearby.');
                    setShowIncompleteProfileModal(true);
                   // navigate("/location");
                }
            } catch (error) {
                console.error("Error parsing user data:", error);
                navigate("/login");
            }
        } else {
            console.log("No user data in session storage");
            navigate("/login");
        }
        setLoading(false);
    }, [navigate]);

    const handleLogout = () => {
        sessionStorage.removeItem("userData");
        navigate("/login");
    };

    const handleProfilePicChange = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = async (e) => {
            const file = e.target.files[0];
            if (file) {
                // Validate file size (5MB max)
                if (file.size > 5 * 1024 * 1024) {
                    setMessage('File size must be less than 5MB');
                    setShowIncompleteProfileModal(true);
                    return;
                }
                
                try {
                    // Convert to base64
                    const base64 = await convertToBase64(file);
                    
                    // Update userData with new profile picture
                    const updatedUserData = { ...userData, image64: base64 };
                    setUserData(updatedUserData);
                    
                    // Update session storage
                    sessionStorage.setItem("userData", JSON.stringify([updatedUserData]));
                    
                    // Update Firebase database
                    await updateDocument("users", userData.id, { image64: base64, pfpSet: true });
                    
                    console.log('Profile picture updated successfully');
                    setMessage('Profile picture updated successfully!');
                    setShowIncompleteProfileModal(true);
                } catch (error) {
                    console.error('Error updating profile picture:', error);
                    setMessage('Failed to update profile picture. Please try again.');
                    setShowIncompleteProfileModal(true);
                }
            }
        };
        input.click();
    };

    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    };

    const handleEditProfile = () => {
        navigate("/edit-profile");
    };

    const handleEditLocation = () => {
        navigate("/location");
    };

    const handleDeleteAccount = () => {
        // TODO: Implement delete account functionality
        if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
            console.log("Delete account clicked");
        }
    };

    const handleGoToSubmitTicket = () => {
        navigate("/tickets");
    };
    const handleGoToMyTickets = () => {
        navigate("/tickets/view");
    };

    if (loading) {
        return (
            <div className="profileContainer">
                <div className="profileCard">
                    <h2>Loading...</h2>
                </div>
            </div>
        );
    }

    if (!userData) {
        return null;
    }

    return (
        <>
            <MessageModal 
                isOpen={showIncompleteProfileModal}
                onClose={() => setShowIncompleteProfileModal(false)}
                message={message}
            />
            <div className="profileContainer">
            <div className="profileCard">
                <div className="profileHeader">
                    <div className="profileImage">
                        <img 
                            src={userData.image64 || "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDE1MCAxNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxNTAiIGhlaWdodD0iMTUwIiBmaWxsPSIjRjVGNUY1Ii8+CjxjaXJjbGUgY3g9Ijc1IiBjeT0iNjAiIHI9IjIwIiBmaWxsPSIjQ0NDQ0NDIi8+CjxwYXRoIGQ9Ik00MCAxMTBDNDAgMTAwIDQ4IDEwMCA1OCAxMDBIOTJDMTEyIDEwMCAxMjAgMTAwIDEyMCAxMTBWMTEwSDQwWiIgZmlsbD0iI0NDQ0NDQyIvPgo8dGV4dCB4PSI3NSIgeT0iMTMwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOTk5IiBmb250LXNpemU9IjEyIj5Qcm9maWxlPC90ZXh0Pgo8L3N2Zz4K"} 
                            alt="Profile" 
                            className="profilePic"
                        />
                    </div>
                    <h1 className="profileName">
                        {userData.firstName} {userData.lastName}
                    </h1>
                    <p className="profileRole">{userData.role}</p>
                </div>

                <div className="profileInfo">
                    <div className="infoSection">
                        <h3>Personal Information</h3>
                        <div className="infoItem">
                            <span className="infoLabel">Email:</span>
                            <span className="infoValue">{userData.email || userData.emailAddress || 'Not provided'}</span>
                        </div>
                        <div className="infoItem">
                            <span className="infoLabel">First Name:</span>
                            <span className="infoValue">{userData.firstName || "Not provided"}</span>
                        </div>
                        <div className="infoItem">
                            <span className="infoLabel">Last Name:</span>
                            <span className="infoValue">{userData.lastName || "Not provided"}</span>
                        </div>
                        <div className="infoItem">
                            <span className="infoLabel">Role:</span>
                            <span className="infoValue">{userData.role}</span>
                        </div>
                        <div className="infoItem">
                            <span className="infoLabel">Location:</span>
                            <span className="infoValue">
                                {userData.locationAddress || (userData.latitude && userData.longitude ? `${userData.latitude.toFixed ? userData.latitude.toFixed(4) : userData.latitude}, ${userData.longitude.toFixed ? userData.longitude.toFixed(4) : userData.longitude}` : 'Not provided')}
                            </span>
                        </div>
                    </div>

                </div>

                <div className="profileActions" style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px'}}>
                    <button 
                        onClick={handleEditProfile} 
                        className="profileButton editButton"
                    >
                        Edit Profile
                    </button>
                    <button onClick={handleProfilePicChange} className="profileButton editButton">
                            Change Profile Picture
                        </button>
                    <button 
                        onClick={handleEditLocation} 
                        className="profileButton editButton"
                    >
                        Edit Location
                    </button>
                    <button 
                        onClick={handleLogout} 
                        className="profileButton logoutButton"
                    >
                        Logout
                    </button>
                    <button 
                        onClick={handleDeleteAccount} 
                        className="profileButton deleteButton"
                    >
                        Delete Account
                    </button>
                    <button 
                        onClick={handleGoToSubmitTicket} 
                        className="profileButton logoutButton"
                    >
                        Submit a Ticket
                    </button>
                    <button 
                        onClick={handleGoToMyTickets} 
                        className="profileButton editButton"
                    >
                        My Tickets
                    </button>
                </div>
            </div>
        </div>
        </>
    );

}
