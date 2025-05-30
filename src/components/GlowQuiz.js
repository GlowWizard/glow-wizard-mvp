import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SKIN_TYPES = [
  "Normal",
  "Oily",
  "Dry",
  "Combination",
  "Sensitive",
];

export default function GlowQuiz() {
  const [name, setName] = useState("");
  const [skinType, setSkinType] = useState("");
  const [concerns, setConcerns] = useState("");
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaving(true);
    // TODO: Save quiz data to Firestore
    setTimeout(() => {
      setSaving(false);
      navigate("/profile");
    }, 1000);
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--light-grey)" }}>
      <div className="profile-container" style={{ marginTop: 60 }}>
        <img src="/Images/GWLogo.png" alt="Glow Wizard Logo" className="logo-img" />
        <div className="profile-welcome" style={{ marginBottom: "1.2rem" }}>
          Glow Quiz
        </div>
        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          <input
            className="gw-input"
            placeholder="Your Name"
            value={name}
            style={{ marginBottom: 14 }}
            onChange={e => setName(e.target.value)}
            required
          />
          <select
            className="gw-input"
            value={skinType}
            onChange={e => setSkinType(e.target.value)}
            style={{ marginBottom: 14 }}
            required
          >
            <option value="">Skin Type</option>
            {SKIN_TYPES.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          <input
            className="gw-input"
            placeholder="Skin Concerns (e.g., aging, acne, redness)"
            value={concerns}
            style={{ marginBottom: 22 }}
            onChange={e => setConcerns(e.target.value)}
            required
          />
          <button className="gw-btn" type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save & Return to Profile"}
          </button>
          <button
            type="button"
            className="gw-btn secondary"
            style={{ marginTop: 14 }}
            onClick={() => navigate("/profile")}
          >
            Back to Profile
          </button>
        </form>
      </div>
    </div>
  );
}
