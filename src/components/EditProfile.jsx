import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import '../assets/styles/App.css';
import '../assets/styles/EditProfile.css';
import { updateDocument } from '../firebase/firebase.js';

export default function EditProfile() {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUserData = sessionStorage.getItem("userData");
        if (storedUserData) {
            try {
                const parsedData = JSON.parse(storedUserData);
                const userData = Array.isArray(parsedData) ? parsedData[0] : parsedData;
                setUserData(userData);
            } catch (error) {
                console.error("Error parsing user data:", error);
                navigate("/login");
            }
        } else {
            navigate("/login");
        }
        setLoading(false);
    }, [navigate]);

    const handleProfilePicChange = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = async (e) => {
            const file = e.target.files[0];
            if (file) {
                if (file.size > 5 * 1024 * 1024) {
                    alert('File size must be less than 5MB');
                    return;
                }
                
                try {
                    const base64 = await convertToBase64(file);
                    const updatedUserData = { ...userData, image64: base64 };
                    setUserData(updatedUserData);
                    sessionStorage.setItem("userData", JSON.stringify([updatedUserData]));
                    await updateDocument("user-data", userData.id, { image64: base64 });
                    alert('Profile picture updated successfully!');
                } catch (error) {
                    console.error('Error updating profile picture:', error);
                    alert('Failed to update profile picture. Please try again.');
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

    const handleSave = async () => {
        // Validate required fields
        if (!userData.firstName || !userData.lastName) {
            alert("Please fill in both first name and last name.");
            return;
        }

        setSaving(true);
        try {
            console.log("Saving profile changes...");
            
            // Update Firebase database
            await updateDocument("user-data", userData.id, {
                firstName: userData.firstName,
                lastName: userData.lastName
            });
            
            // Update session storage
            sessionStorage.setItem("userData", JSON.stringify([userData]));
            
            console.log("Profile updated successfully");
            alert("Profile updated successfully!");
            navigate("/profile");
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("Failed to update profile. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        navigate("/profile");
    };

    if (loading) {
        return (
            <div className="editProfileContainer">
                <div className="loadingMessage">Loading...</div>
            </div>
        );
    }

    if (!userData) {
        return null;
    }

    return (
        <div className="editProfileContainer">
            <div className="editProfileCard">
                <div className="editProfileHeader">
                    <h1 className="editProfileTitle">Edit Profile</h1>
                </div>
                
                <div className="editProfileContent">
                    {/* Profile Picture Section */}
                    <div className="profilePictureSection">
                        <div className="profilePictureContainer">
                            <img 
                                src={userData.image64 || "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDE1MCAxNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxNTAiIGhlaWdodD0iMTUwIiBmaWxsPSIjRjVGNUY1Ii8+CjxjaXJjbGUgY3g9Ijc1IiBjeT0iNjAiIHI9IjIwIiBmaWxsPSIjQ0NDQ0NDIi8+CjxwYXRoIGQ9Ik00MCAxMTBDNDAgMTAwIDQ4IDEwMCA1OCAxMDBIOTJDMTEyIDEwMCAxMjAgMTAwIDEyMCAxMTBWMTEwSDQwWiIgZmlsbD0iI0NDQ0NDQyIvPgo8dGV4dCB4PSI3NSIgeT0iMTMwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOTk5IiBmb250LXNpemU9IjEyIj5Qcm9maWxlPC90ZXh0Pgo8L3N2Zz4K"} 
                                alt="Profile" 
                                className="profilePicturePreview"
                            />
                        </div>
                        <button 
                            onClick={handleProfilePicChange}
                            className="uploadButton"
                        >
                            Upload Profile Picture
                        </button>
                    </div>
                    
                    <div className="formSection">
                        <div className="formField">
                            <label className="formLabel">First Name:</label>
                            <input 
                                type="text" 
                                value={userData.firstName || ''} 
                                onChange={(e) => setUserData({...userData, firstName: e.target.value})}
                                className="formInput"
                            />
                        </div>

                        <div className="formField">
                            <label className="formLabel">Last Name:</label>
                            <input 
                                type="text" 
                                value={userData.lastName || ''} 
                                onChange={(e) => setUserData({...userData, lastName: e.target.value})}
                                className="formInput"
                            />
                        </div>

                        <div className="formField">
                            <label className="formLabel">Email:</label>
                            <input 
                                type="email" 
                                value={userData.emailAddress || ''} 
                                disabled
                                className="formInput"
                            />
                            <div className="formHelpText">Email cannot be changed</div>
                        </div>

                        <div className="formField">
                            <label className="formLabel">Role:</label>
                            <input 
                                type="text" 
                                value={userData.role || ''} 
                                disabled
                                className="formInput"
                            />
                            <div className="formHelpText">Role cannot be changed</div>
                        </div>
                    </div>

                    <div className="buttonSection">
                        <button 
                            onClick={handleCancel}
                            className="cancelButton"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={handleSave}
                            disabled={saving}
                            className="saveButton"
                        >
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
