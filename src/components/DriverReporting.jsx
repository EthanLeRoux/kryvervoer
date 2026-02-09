import React, { useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import MessageModal from "./../modals/MessageModal.jsx";
import { saveDoc } from "./../firebase/firebase.js";
import "../assets/styles/DriverReporting.css";

export default function DriverReporting() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  console.log("🚀 DriverReporting Component Loaded!");
  console.log("Params id:", id);
  console.log("Location state:", location.state);

  const driver = location.state?.driver || { 
    id: id || "unknown", 
    name: location.state?.name || "Unknown Driver" 
  };

  // Read logged-in user from sessionStorage
  const storedUser = (() => {
    try {
      return JSON.parse(sessionStorage.getItem("userData")) || {};
    } catch {
      return {};
    }
  })();
  const user = Array.isArray(storedUser) ? storedUser[0] : storedUser;

  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reason) {
      alert("Please select a reason for the report.");
      return;
    }

    setSubmitting(true);

    const report = {
      driverId: driver.id,
      driverName: driver.name,
      reporterId: user?.id || null,
      reporterName: user ? `${user.firstName || ""} ${user.lastName || ""}`.trim() : null,
      reporterEmail: user?.emailAddress || user?.email || null,
      reason,
      details: details || null,
      dateCreated: new Date().toISOString(),
    };

    try {
      await saveDoc(report, "driver-reports");
      setModalOpen(true);
    } catch (err) {
      console.error("Driver report save error:", err);
      alert("Failed to submit report. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="driver-reporting-container">
      <h1 className="driver-reporting-title">
        🚨 Report Driver
      </h1>

      <MessageModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          navigate("/finddriver");
        }}
        message="Thank you. Your report has been submitted."
      />

      <form onSubmit={handleSubmit} className="driver-reporting-form">
        <label className="form-label">
          Driver ID
          <input 
            type="text" 
            value={driver.id || ""} 
            readOnly 
            className="form-input" 
          />
        </label>

        <label className="form-label">
          Driver Name
          <input 
            type="text" 
            value={driver.name || ""} 
            readOnly 
            className="form-input" 
          />
        </label>

        <label className="form-label">
          Reason for Report *
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
            className="form-select"
          >
            <option value="">Select a reason</option>
            <option value="unsafe-driving">Unsafe driving</option>
            <option value="late-arrival">Late arrival / no-show</option>
            <option value="behavior">Inappropriate behavior</option>
            <option value="documentation">Missing documentation / license</option>
            <option value="other">Other</option>
          </select>
        </label>

        <label className="form-label">
          Details (optional)
          <textarea
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            rows={6}
            placeholder="Describe what happened (time, location, witnesses, etc.)"
            className="form-textarea"
          />
        </label>

        <div className="form-buttons">
          <button
            type="submit"
            disabled={submitting}
            className={`submit-button ${submitting ? "submitting" : ""}`}
          >
            {submitting ? "Submitting..." : "Submit Report"}
          </button>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="cancel-button"
          >
            Cancel
          </button>
        </div>
      </form>

      {/* Debug information - you can remove this in production */}
      <div className="debug-info">
        <h3>Debug Information:</h3>
        <p><strong>Driver ID from URL:</strong> {id}</p>
        <p><strong>Driver Name:</strong> {driver.name}</p>
        <p><strong>Has Location State:</strong> {location.state ? "Yes" : "No"}</p>
        <p><strong>User Logged In:</strong> {user?.firstName ? "Yes" : "No"}</p>
      </div>
    </div>
  );
}