import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import MessageModal from "../modals/MessageModal.jsx";
import { getDocumentsByField, loginUser } from "../firebase/firebase.js";

export default function Login() {
    const [userEmail, setUserEmail] = useState("");
    const [userPassword, setUserPassword] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [message, setMessage] = useState("");

    const navigate = useNavigate();

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        if (userPassword.length < 6) {
            alert("Password must be at least 6 characters.");
            return;
        }

        try {
            const userData = await loginUser(userEmail, userPassword);
            console.log("Firebase Auth successful:", userData.email);
            const realUserData = await getDocumentsByField("users", "email", userData.email);
            
            if (realUserData.length === 0) {
                setMessage("No user data found for this account. Please sign up first.");
                setModalOpen(true);
                return;
            }

            sessionStorage.setItem("userData", JSON.stringify(realUserData));
            setModalOpen(true);
            navigate('/profile');
        } catch (error) {
            console.error("Login failed:", error);
            setMessage("Login failed. Please check your credentials and try again.");
            setModalOpen(true);
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
            border: '1px solid #FFA500',
            borderRadius: '50px',
            outline: 'none',
            transition: 'border-color 0.3s, box-shadow 0.3s',
        },
        taskAddButton: {
            width: '100%',
            padding: '0.75rem',
            fontSize: '1rem',
            backgroundColor: '#FFA500',
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
            textDecoration: 'underline',
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
                message={message}
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
            />

            <Link
                to="/signup"
                style={styles.linkButton}
            >
                Don't have an account? Click here to sign up
            </Link>
        </form>
    );
}
