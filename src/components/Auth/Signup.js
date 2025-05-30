// src/components/Auth/Signup.js
import React, { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "../../firebase";
import { doc, setDoc } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../Images/GWLogo.png";

function Signup() {
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName });
      await setDoc(doc(db, "users", userCredential.user.uid), {
        email,
        displayName,
        photoURL: "",
      });
      navigate("/profile");
    } catch (err) {
      setError("Signup failed. " + err.message);
    }
  };

  return (
    <div className="app-background">
      <div className="profile-container">
        <img src={logo} alt="Glow Wizard Logo" className="logo" />
        <h2>Create Your Glow Wizard Account</h2>
        <form onSubmit={handleSignup} style={{ width: "100%" }}>
          <label htmlFor="displayName">Name</label>
          <input
            id="displayName"
            type="text"
            autoComplete="name"
            value={displayName}
            onChange={e => setDisplayName(e.target.value)}
            required
          />
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <label htmlFor="confirm">Confirm Password</label>
          <input
            id="confirm"
            type="password"
            autoComplete="new-password"
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            required
          />
          {error && <div style={{ color: "var(--dusty-rose)", marginBottom: "1rem" }}>{error}</div>}
          <button className="button" type="submit">
            Sign Up
          </button>
        </form>
        <div style={{ marginTop: "1rem", width: "100%", textAlign: "center" }}>
          <span>Already have an account? </span>
          <Link to="/login" className="link-button">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Signup;
