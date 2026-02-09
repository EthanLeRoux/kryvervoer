import React, { useState, useEffect } from "react";
import { saveDoc } from "../firebase/firebase.js";
import { useNavigate } from "react-router-dom";

const FileTicket = () => {
  const storedUser = JSON.parse(sessionStorage.getItem("userData")) || {};
  const navigate = useNavigate();

  const [form, setForm] = useState({
    subject: "",
    description: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [firstName, setFirstName] = useState(storedUser.firstName || "");
  const [lastName, setLastName] = useState(storedUser.lastName || "");
  const [useremail, setUseremail] = useState(storedUser.emailAddress || "");
  const [userId, setUserId] = useState(storedUser.id || "");

  useEffect(() => {
    const userData = JSON.parse(sessionStorage.getItem("userData"));
    if (userData) {
      setFirstName(userData.firstName || "");
      setLastName(userData.lastName || "");
      setUseremail(userData.emailAddress || "");
      setUserId(userData.id || "");
    }
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = JSON.parse(sessionStorage.getItem("userData"));
    if (!userData) {
      alert("User data not found. Please log in again.");
      return;
    }

    const user = Array.isArray(userData) ? userData[0] : userData;

    const ticketData = {
      ...form,
      fname: user.firstName,
      lname: user.lastName,
      email: user.emailAddress,
      uid: user.id,
      status: "open",
      dateCreated: new Date().toISOString(),
    };

    console.log("Ticket submitted:", ticketData);

    try {
      await saveDoc(ticketData, "tickets");
      alert("Ticket submitted successfully!");
      setSubmitted(true);
      navigate("/finddriver");
    } catch (error) {
      console.error("Error submitting ticket:", error);
      alert("Failed to submit ticket. Please try again.");
    }
  };

  //styles
  const styles = {
    page: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      backgroundColor: "#f7f9fc",
      fontFamily: "'Inter', sans-serif",
    },
    card: {
      backgroundColor: "#fff",
      borderRadius: "16px",
      boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
      padding: "2rem",
      width: "100%",
      maxWidth: "500px",
      transition: "all 0.3s ease-in-out",
    },
    heading: {
      textAlign: "center",
      marginBottom: "1.5rem",
      color: "#1a1a1a",
      fontSize: "1.75rem",
      fontWeight: "600",
    },
    label: {
      display: "block",
      marginBottom: "0.5rem",
      fontWeight: "500",
      color: "#333",
    },
    input: {
      width: "100%",
      padding: "10px 12px",
      borderRadius: "8px",
      border: "1px solid #ccc",
      outline: "none",
      fontSize: "1rem",
      backgroundColor: "#fdfdfd",
      transition: "border 0.2s ease-in-out",
    },
    textarea: {
      width: "100%",
      padding: "10px 12px",
      borderRadius: "8px",
      border: "1px solid #ccc",
      outline: "none",
      fontSize: "1rem",
      minHeight: "120px",
      resize: "vertical",
      backgroundColor: "#fdfdfd",
      transition: "border 0.2s ease-in-out",
    },
    inputFocus: {
      border: "1px solid #007bff",
    },
    button: {
      width: "100%",
      backgroundColor: "#000000ff",
      color: "#fff",
      padding: "12px 16px",
      border: "none",
      borderRadius: "8px",
      fontSize: "1rem",
      fontWeight: "600",
      cursor: "pointer",
      marginTop: "1rem",
      transition: "background-color 0.2s ease-in-out",
    },
    buttonHover: {
      backgroundColor: "#0056b3",
    },
    submittedCard: {
      textAlign: "center",
      backgroundColor: "#fff",
      borderRadius: "16px",
      boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
      padding: "2rem",
      width: "90%",
      maxWidth: "400px",
    },
  };

  if (submitted) {
    return (
      <div style={styles.page}>
        <div style={styles.submittedCard}>
          <h2 style={styles.heading}>✅ Ticket Submitted</h2>
          <p style={{ color: "#333" }}>
            Thank you for filing your ticket. Our team will get back to you
            shortly.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <form onSubmit={handleSubmit} style={styles.card}>
        <h2 style={styles.heading}>File a Ticket</h2>

        <div style={{ marginBottom: "1rem" }}>
          <label style={styles.label}>Subject</label>
          <input
            type="text"
            name="subject"
            value={form.subject}
            onChange={handleChange}
            required
            style={styles.input}
            placeholder="Enter subject"
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label style={styles.label}>Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            required
            style={styles.textarea}
            placeholder="Describe your issue..."
          />
        </div>

        <button type="submit" style={styles.button}>
          Submit Ticket
        </button>
      </form>
    </div>
  );
};

export default FileTicket;
