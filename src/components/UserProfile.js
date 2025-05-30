// src/components/UserProfile.js
import React from "react";
import { useNavigate } from "react-router-dom";
import GWLogo from "../Images/GWLogo.png";
import "../App.css";

const UserProfile = ({ user }) => {
  const navigate = useNavigate();

  // ✅ Fully guard user before accessing any properties
  if (!user || typeof user !== "object") {
    return (
      <div className="loading">
        <img src={GWLogo} alt="Glow Wizard Logo" className="logo" />
        <p>Loading user profile...</p>
      </div>
    );
  }

  const displayName = user.displayName || "Unnamed User";
  const email = user.email || "No Email";
  const photoURL = user.photoURL || "";

  const handleEdit = () => {
    navigate("/edit-profile");
  };

  const handleQuiz = () => {
    navigate("/glow-quiz");
  };

  return (
    <div className="profile-container">
      <img src={GWLogo} alt="Glow Wizard Logo" className="logo" />
      <h1 className="welcome-text">Welcome, {displayName}!</h1>
      <div className="user-info">
        {photoURL ? (
          <img src={photoURL} alt="User Avatar" className="avatar" />
        ) : (
          <div className="avatar-placeholder">No Image</div>
        )}
        <p>Email: {email}</p>
      </div>
      <div className="button-group">
        <button className="primary-btn" onClick={handleEdit}>
          Edit Profile
        </button>
        <button className="secondary-btn" onClick={handleQuiz}>
          Take the Quiz
        </button>
      </div>
    </div>
  );
};

export default UserProfile;
