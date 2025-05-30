import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GWLogo from "../Images/GWLogo.png";

function EditProfile({ user, updateUserProfile }) {
  const navigate = useNavigate();

  // Always check for user before hooks!
  if (!user) {
    return (
      <div className="profile-container wide">
        <img src={GWLogo} className="logo small" alt="Logo" />
        <h2>Loading…</h2>
      </div>
    );
  }

  // Hooks after user is confirmed
  const [displayName, setDisplayName] = useState(user.displayName || "");
  const [photo, setPhoto] = useState(user.photoURL || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    updateUserProfile({ displayName, photoURL: photo });
    navigate("/profile");
  };

  return (
    <div className="profile-container wide">
      <img src={GWLogo} className="logo small" alt="Logo" />
      <h2 className="profile-title">Edit Your Profile</h2>
      <form onSubmit={handleSubmit}>
        <div className="profile-pic-section">
          <img src={photo || "https://via.placeholder.com/80x80/EBEAEB/5C5751?text=+"} alt="Profile" className="profile-pic big" />
        </div>
        <input
          type="text"
          value={displayName}
          onChange={e => setDisplayName(e.target.value)}
          placeholder="Your Name"
          className="input"
        />
        <button className="button" type="submit">Save</button>
        <button className="button outline" type="button" onClick={() => navigate("/profile")}>Cancel</button>
      </form>
    </div>
  );
}

export default EditProfile;
