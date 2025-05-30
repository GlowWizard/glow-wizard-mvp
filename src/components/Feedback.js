// src/components/Feedback.js
import React, { useState } from "react";
import logo from "../Images/GWLogo.png";
import { useNavigate } from "react-router-dom";

function Feedback() {
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Submit feedback logic here (to Firestore, etc)
    alert("Thank you for your feedback!");
    setFeedback("");
    navigate("/profile");
  };

  return (
    <div className="app-background">
      <div className="profile-container">
        <img src={logo} alt="Glow Wizard Logo" className="logo" />
        <h2>Give Us Your Feedback</h2>
        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          <label htmlFor="feedback">We’d love to hear your thoughts!</label>
          <textarea
            id="feedback"
            value={feedback}
            onChange={e => setFeedback(e.target.value)}
            rows={4}
            placeholder="Type your feedback here…"
            required
          />
          <button className="button" type="submit">
            Submit Feedback
          </button>
        </form>
        <button className="button outline" onClick={() => navigate("/profile")}>
          Back to Profile
        </button>
      </div>
    </div>
  );
}

export default Feedback;
