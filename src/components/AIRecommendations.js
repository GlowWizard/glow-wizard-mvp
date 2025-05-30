// src/components/AIRecommendations.js
import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../Images/GWLogo.png";

function AIRecommendations() {
  const navigate = useNavigate();

  return (
    <div className="app-background">
      <div className="profile-container">
        <img src={logo} alt="Glow Wizard Logo" className="logo" />
        <h2 style={{ textAlign: "center" }}>AI Routine Recommendations<br />& Ingredient Analysis</h2>
        <p>
          <strong>This feature is coming soon!</strong><br />
          You’ll get personalized routines and ingredient analysis right here.
        </p>
        <button className="button" onClick={() => navigate("/profile")}>
          Back to Profile
        </button>
      </div>
    </div>
  );
}

export default AIRecommendations;
