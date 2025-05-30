// src/components/UserProfile.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import GWLogo from "../Images/GWLogo.png";
import "../App.css";

const UserProfile = ({ user }) => {
  const navigate = useNavigate();

  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [photoURL, setPhotoURL] = useState("");

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || "No Name");
      setEmail(user.email || "No Email");
      setPhotoURL(user.photoURL || "");
    }
  }, [user]);

  const handleEdit = () => {
    navigate("/edit-profile");
  };

  const handleQuiz = () => {
    navigate("/glow-quiz");
  };

  if (!user) {
    return <div className="loading">Loading user...</div>;
  }

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
