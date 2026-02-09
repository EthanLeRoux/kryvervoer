import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import MessageModal from "../modals/MessageModal.jsx";
import { signUpUser, saveDoc } from "../firebase/firebase.js";

export default function SignUp() {
    const [emailAddress, setEmailAddress] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [role, setRole] = useState("Parent");
    const [modalOpen, setModalOpen] = useState(false);
    const navigate = useNavigate();
    const [message,setMessage] = useState("");

    const handleFormSubmit = async (event) => {
        event.preventDefault();

        if (!role) return alert("Please select Parent or Driver.");
        if (password.length < 6) return alert("Password must be at least 6 characters.");
        if (password !== confirmPassword) return alert("Passwords do not match.");

        try {
            await signUpUser(emailAddress, password,role,firstName,lastName);

            setEmailAddress("");
            setFirstName("");
            setLastName("");
            setPassword("");
            setConfirmPassword("");
            setRole("Parent");

            setMessage("Signup successful!");
            setModalOpen(true);
        } catch (error) {
            console.error("Signup failed:", error);
            setMessage("Error signing up. Please try again.");
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
            border: '1px solid #ccc',
            borderRadius: '50px',
            outline: 'none',
            transition: 'border-color 0.3s, box-shadow 0.3s',
        },
        inputFocus: {
            borderColor: '#000000ff',
            boxShadow: '0 0 5px rgba(0, 122, 204, 0.3)',
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
        radioGroup: {
            display: 'flex',
            justifyContent: 'center',
            gap: '20px',
            margin: '0.5rem 0'
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
            <h1 style={styles.heading}>Sign Up</h1>

            <MessageModal
                isOpen={modalOpen}
                onClose={() => {
                    setModalOpen(false);
                    navigate('/login');
                }}
                message={message}
            />

            <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First Name"
                required
                style={styles.inputText}
            />

            <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last Name"
                required
                style={styles.inputText}
            />

            <input
                type="email"
                value={emailAddress}
                onChange={(e) => setEmailAddress(e.target.value)}
                placeholder="Email Address"
                required
                style={styles.inputText}
            />

            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                style={styles.inputText}
            />

            <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm Password"
                required
                style={styles.inputText}
            />

            <div style={styles.radioGroup}>
                <label>
                    <input
                        type="radio"
                        name="role"
                        value="Parent"
                        checked={role === "Parent"}
                        onChange={(e) => setRole(e.target.value)}
                    />
                    Parent
                </label>

                <label>
                    <input
                        type="radio"
                        name="role"
                        value="Driver"
                        checked={role === "Driver"}
                        onChange={(e) => setRole(e.target.value)}
                    />
                    Driver
                </label>
            </div>

            <input
                type="submit"
                value="Sign Up"
                style={styles.taskAddButton}
            />

            <Link
                to="/login"
                style={styles.linkButton}
            >
                Already have an account? Login
            </Link>
        </form>
    );
}
