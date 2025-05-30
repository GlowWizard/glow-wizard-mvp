// src/components/Auth/ForgotPassword.js
import React, { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../firebase";
import { Link } from "react-router-dom";
import logo from "../../Images/GWLogo.png";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Password reset email sent. Please check your inbox.");
    } catch (err) {
      setError("Failed to send reset email. " + err.message);
    }
  };

  return (
    <div className="app-background">
      <div className="profile-container">
        <img src={logo} alt="Glow Wizard Logo" className="logo" />
        <h2>Reset Your Password</h2>
        <form onSubmit={handleReset} style={{ width: "100%" }}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          {error && <div style={{ color: "var(--dusty-rose)", marginBottom: "1rem" }}>{error}</div>}
          {message && <div style={{ color: "var(--lavender)", marginBottom: "1rem" }}>{message}</div>}
          <button className="button" type="submit">
            Send Reset Email
          </button>
        </form>
        <div style={{ marginTop: "1rem", width: "100%", textAlign: "center" }}>
          <Link to="/login" className="link-button">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
