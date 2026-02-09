import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import MessageModal from "../modals/MessageModal.jsx";
import { getDocumentsByField, loginUser } from "../firebase/firebase.js";

export default function Login() {
    const [userEmail, setUserEmail] = useState("");
    const [userPassword, setUserPassword] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const navigate = useNavigate();

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        if (userPassword.length < 6) {
            alert("Password must be at least 6 characters.");
            return;
        }

        try {
            console.log("Step 1: Attempting Firebase Auth login...");
            const userData = await loginUser(userEmail, userPassword);
            console.log("Firebase Auth successful:", userData.email);
            
            console.log("Step 2: Querying Firestore for user data...");
            const realUserData = await getDocumentsByField("user-data", "emailAddress", userData.email);
            console.log("Firestore query result:", realUserData);
            console.log("Result length:", realUserData.length);
            console.log("First user object:", realUserData[0]);
            console.log("User object keys:", realUserData[0] ? Object.keys(realUserData[0]) : "No data");
            
            if (realUserData.length === 0) {
                console.error("No user data found in Firestore!");
                alert("No user data found. Please sign up first or contact support.");
                return;
            }
            
            console.log("Step 3: Storing data in session storage...");
            sessionStorage.setItem("userData", JSON.stringify(realUserData));
            console.log("Data stored in session storage");
            
            console.log("Step 4: Navigating to profile...");
            setModalOpen(true);
            navigate('/profile');
        } catch (error) {
            console.error("Login failed:", error);
            console.error("Error details:", error.message);
            alert("Login failed: " + error.message);
        }
    };

    const styles = {
        formArea: {
            width: '100%',
            maxWidth: 400,
            margin: '5vh auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
        },
        heading: {
            textAlign: 'center',
            fontSize: '2rem',
            fontWeight: 600,
            marginBottom: '0.5rem',
            color: '#000'
        },
        inputText: {
            width: '100%',
            padding: '0.75rem 1rem',
            fontSize: '1rem',
            border: '1px solid #ccc',
            borderRadius: '50px',
            outline: 'none',
            transition: 'border-color 0.3s, box-shadow 0.3s',
        },
        taskAddButton: {
            width: '100%',
            padding: '0.75rem',
            fontSize: '1rem',
            backgroundColor: '#000000ff',
            color: '#fff',
            border: 'none',
            borderRadius: '50px',
            cursor: 'pointer',
            transition: 'background-color 0.3s',
        },
        linkButton: {
            display: 'block',
            marginTop: '0.5rem',
            textAlign: 'center',
            color: '#000000ff',
            fontSize: '0.9rem',
            textDecoration: 'none',
            transition: 'color 0.3s'
        }
    };

    return (
        <form onSubmit={handleFormSubmit} style={styles.formArea}>
            <h1 style={styles.heading}>Login</h1>

            <MessageModal
                isOpen={modalOpen}
                onClose={() => {
                    setModalOpen(false);
                    navigate("/login");
                }}
                message="Login successful"
            />

            <input
                type="email"
                onChange={(e) => setUserEmail(e.target.value)}
                value={userEmail}
                placeholder="Email"
                required
                style={styles.inputText}
            />

            <input
                type="password"
                onChange={(e) => setUserPassword(e.target.value)}
                value={userPassword}
                placeholder="Password"
                required
                style={styles.inputText}
            />

            <input
                type="submit"
                value="Login"
                style={styles.taskAddButton}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#005fa3'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#000000ff'}
            />

            <Link
                to="/signup"
                style={styles.linkButton}
                onMouseOver={(e) => e.currentTarget.style.color = '#005fa3'}
                onMouseOut={(e) => e.currentTarget.style.color = '#000000ff'}
            >
                Don't have an account? Click here to sign up
            </Link>
        </form>
    );
}
