import React, { useEffect } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import { useNavigate } from "react-router-dom";

function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    signOut(auth).then(() => {
      navigate("/login");
    });
  }, [navigate]);

  return null;
}

export default Logout;
