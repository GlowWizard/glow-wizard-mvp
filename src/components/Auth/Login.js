// src/components/Auth/Login.js
import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../Images/GWLogo.png";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/profile");
    } catch (err) {
      setError("Invalid login. Please check your credentials.");
    }
  };

  return (
    <div className="app-background">
      <div className="profile-container">
        <img src={logo} alt="Glow Wizard Logo" className="logo" />
        <h2>Login to Glow Wizard</h2>
        <form onSubmit={handleLogin} style={{ width: "100%" }}>
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
            autoComplete="current-password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          {error && <div style={{ color: "var(--dusty-rose)", marginBottom: "1rem" }}>{error}</div>}
          <button className="button" type="submit">
            Login
          </button>
        </form>
        <div style={{ marginTop: "1rem", width: "100%", textAlign: "center" }}>
          <Link to="/forgot-password" className="link-button">
            Forgot password?
          </Link>
        </div>
        <div style={{ marginTop: "0.5rem", width: "100%", textAlign: "center" }}>
          <span>Don't have an account? </span>
          <Link to="/signup" className="link-button">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
