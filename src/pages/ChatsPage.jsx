import { useNavigate } from "react-router-dom";

export default function ChatsPage() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h2>Chats</h2>
      <p>Select a driver from the map to start a conversation.</p>
      <button
        type="button"
        onClick={() => navigate("/finddriver")}
        style={{
          padding: "0.75rem 1rem",
          borderRadius: 8,
          border: "none",
          backgroundColor: "#000",
          color: "#fff",
          cursor: "pointer",
        }}
      >
        Go to Find Driver
      </button>
    </div>
  );
}
