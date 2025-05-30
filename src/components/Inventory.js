import React from "react";
import { useNavigate } from "react-router-dom";

export default function Inventory() {
  const navigate = useNavigate();
  // TODO: Replace with user's inventory from Firestore!
  const products = [
    { name: "Cleanser", brand: "BrandX" },
    { name: "Moisturizer", brand: "BrandY" }
  ];

  return (
    <div style={{ minHeight: "100vh", background: "var(--light-grey)" }}>
      <div className="profile-container" style={{ marginTop: 60 }}>
        <img src="/Images/GWLogo.png" alt="Glow Wizard Logo" className="logo-img" />
        <div className="profile-welcome" style={{ marginBottom: "1.2rem" }}>
          My Skincare Inventory
        </div>
        <div style={{ width: "100%", marginBottom: 22 }}>
          {products.length === 0 ? (
            <div style={{ color: "var(--soft-charcoal)", textAlign: "center" }}>
              No products yet! Add your first product in the next version.
            </div>
          ) : (
            <ul style={{ listStyle: "none", padding: 0, width: "100%" }}>
              {products.map((prod, i) => (
                <li key={i} style={{
                  borderBottom: "1px solid var(--lavender)",
                  padding: "0.75rem 0",
                  fontSize: "1.09rem"
                }}>
                  <b>{prod.name}</b> <span style={{ color: "var(--dusty-rose)" }}>{prod.brand}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <button
          className="gw-btn secondary"
          onClick={() => navigate("/profile")}
        >
          Back to Profile
        </button>
      </div>
    </div>
  );
}
