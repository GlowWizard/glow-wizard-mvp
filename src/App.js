import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";

// Auth screens
import Login from "./components/Auth/Login";
import Signup from "./components/Auth/Signup";
import ForgotPassword from "./components/Auth/ForgotPassword";

// Main app pages
import UserProfile from "./components/UserProfile";
import EditProfile from "./components/EditProfile";
import GlowQuiz from "./components/GlowQuiz";
import Feedback from "./components/Feedback";
import AIRecommendations from "./components/AIRecommendations";

// Route guard for authenticated pages
function PrivateRoute({ children }) {
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <div className="app-background">
        <div className="profile-container">
          <div>Loading...</div>
        </div>
      </div>
    );
  }

  return user ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <div className="app-background">
      <Router>
        <Routes>
          {/* Public Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Private Authenticated Routes */}
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <UserProfile />
              </PrivateRoute>
            }
          />
          <Route
            path="/edit-profile"
            element={
              <PrivateRoute>
                <EditProfile />
              </PrivateRoute>
            }
          />
          <Route
            path="/glow-quiz"
            element={
              <PrivateRoute>
                <GlowQuiz />
              </PrivateRoute>
            }
          />
          <Route
            path="/feedback"
            element={
              <PrivateRoute>
                <Feedback />
              </PrivateRoute>
            }
          />
          <Route
            path="/ai-recommendations"
            element={
              <PrivateRoute>
                <AIRecommendations />
              </PrivateRoute>
            }
          />

          {/* Default route: redirect to profile if logged in */}
          <Route path="/" element={<Navigate to="/profile" />} />
          {/* Catch-all: if route doesn't exist, go to profile */}
          <Route path="*" element={<Navigate to="/profile" />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
