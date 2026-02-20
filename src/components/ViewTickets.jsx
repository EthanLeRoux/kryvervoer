import React, { useState, useEffect } from "react";
import { getDocumentsByField, deleteDocument } from "../firebase/firebase.js";
import { getCurrentUser } from "../utils/sessionUser.js";

const UserTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const fetchTickets = async () => {
      const user = getCurrentUser();
      if (!user?.uid) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setUserId(user.uid);
        const docs = await getDocumentsByField("tickets", "uid", user.uid);
        setTickets(docs);
      } catch (error) {
        console.error("Error fetching tickets:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  const styles = {
    page: { minHeight: "100vh", backgroundColor: "#f7f9fc", display: "flex", flexDirection: "column", alignItems: "center", padding: "2rem", fontFamily: "'Inter', sans-serif" },
    container: { backgroundColor: "#fff", borderRadius: "16px", boxShadow: "0 4px 20px rgba(0,0,0,0.1)", width: "100%", maxWidth: "700px", padding: "2rem", transition: "all 0.3s ease-in-out" },
    heading: { textAlign: "center", color: "#1a1a1a", fontSize: "1.75rem", fontWeight: "600", marginBottom: "1.5rem" },
    ticketCard: { backgroundColor: "#f9fafc", border: "1px solid #e5e7eb", borderRadius: "12px", padding: "1rem 1.25rem", marginBottom: "1rem", boxShadow: "0 2px 6px rgba(0,0,0,0.05)", transition: "transform 0.2s ease, box-shadow 0.2s ease", cursor: "pointer" },
    ticketCardHover: { transform: "translateY(-3px)", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" },
    label: { fontWeight: "600", color: "#333" },
    value: { marginBottom: "0.5rem", color: "#444" },
    status: { display: "inline-block", padding: "4px 10px", borderRadius: "6px", fontSize: "0.85rem", fontWeight: "600", color: "#fff", backgroundColor: "#000" },
    emptyState: { textAlign: "center", color: "#555", fontSize: "1rem", marginTop: "1rem" },
    loader: { textAlign: "center", color: "#777", fontSize: "1rem" },
  };

  const handleDelete = (ticket) => {
    if (!window.confirm("Are you sure you want to delete this ticket?")) return;

    if (ticket.uid !== userId) {
      alert("You can only delete your own tickets.");
      return;
    }

    deleteDocument("tickets", ticket.id)
      .then(() => {
        alert("Ticket deleted successfully.");
        setTickets((prevTickets) => prevTickets.filter((t) => t.id !== ticket.id));
      })
      .catch((error) => {
        console.error("Error deleting ticket:", error);
      });
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h2 style={styles.heading}>My Tickets</h2>

        {loading ? (
          <p style={styles.loader}>Loading your tickets...</p>
        ) : tickets.length === 0 ? (
          <p style={styles.emptyState}>No tickets submitted yet.</p>
        ) : (
          tickets.map((ticket) => (
            <div
              key={ticket.id}
              style={styles.ticketCard}
              onMouseEnter={(e) => Object.assign(e.currentTarget.style, styles.ticketCardHover)}
              onMouseLeave={(e) => Object.assign(e.currentTarget.style, styles.ticketCard)}
            >
              <p style={styles.value}><span style={styles.label}>Subject:</span> {ticket.subject}</p>
              <p style={styles.value}><span style={styles.label}>Description:</span> {ticket.description}</p>
              <p><span style={styles.label}>Status:</span> <span style={styles.status}>{ticket.status ? ticket.status.toUpperCase() : "OPEN"}</span></p>
              <button style={styles.status} onClick={() => handleDelete(ticket)}>Delete Ticket</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UserTickets;
