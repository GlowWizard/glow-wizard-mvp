import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";
import { useAuth } from "./AuthProvider";

function SmartRedirect() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkProfile = async () => {
      if (!currentUser) {
        navigate("/login");
        return;
      }
      const ref = doc(db, "users", currentUser.uid);
      const snap = await getDoc(ref);
      const data = snap.data();
      if (!data || !data.onboarded) {
        navigate("/onboarding");
      } else {
        navigate("/dashboard");
      }
      setChecking(false);
    };
    checkProfile();
  }, [currentUser, navigate]);

  return checking ? <div>Loading...</div> : null;
}

export default SmartRedirect;
