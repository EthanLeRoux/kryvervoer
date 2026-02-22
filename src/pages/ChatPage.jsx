import React, { useEffect, useState } from "react";
import { db } from "../firebase/firebase";
import { useLocation, useParams } from "react-router-dom";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import "../assets/styles/Chat.css";
import { getCurrentUser } from "../utils/sessionUser";

const ChatPage = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const { driverId, parentId } = useParams();
  const location = useLocation();
  const user = getCurrentUser();

  const currentUserId = location.state?.userId || user?.uid || "";
  const isParent = currentUserId === parentId;
  const chatPartnerId = isParent ? driverId : parentId;
  const chatId = [driverId, parentId].sort().join("_");
  const chatHeader = isParent ? "Parent Chat" : "Driver Chat";

  useEffect(() => {
    const q = query(
      collection(db, "chats", chatId, "messages"),
      orderBy("timestamp", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map((doc) => doc.data()));
    });

    return () => unsubscribe();
  }, [chatId]);

  const sendMessage = async () => {
    if (!message.trim() || !currentUserId) return;

    const newMessage = {
      text: message,
      senderId: currentUserId,
      receiverId: chatPartnerId,
      timestamp: new Date(),
    };

    setMessage("");

    await addDoc(collection(db, "chats", chatId, "messages"), {
      ...newMessage,
      timestamp: serverTimestamp(),
    });
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const date = timestamp.toDate ? timestamp.toDate() : timestamp;
    return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
  };

  const viewMessages = messages.map((msg) => ({
    ...msg,
    type: msg.senderId === currentUserId ? "sent" : "received",
  }));

  return (
    <div className="chat-wrapper">
      <div className="chat-container">
        <div className="chat-header">{chatHeader}</div>
        <div className="chat-box">
          {viewMessages.map((msg, index) => (
            <div key={index} className={`chat-message-wrapper ${msg.type}`}>
              <div className={`chat-message ${msg.type}`}>{msg.text}</div>
              <span className="timestamp">{formatTime(msg.timestamp)}</span>
            </div>
          ))}
        </div>

        <div className="chat-input">
          <input
            type="text"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button type="button" onClick={sendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
