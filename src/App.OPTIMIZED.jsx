import { Route, Routes, useNavigate } from "react-router-dom";
import "./App.css";
import SignIn from "./component/pages/SignIn/SignIn";
import NotFoundPage from "./component/pages/NotFound/NotFoundPage";
import AdminDashboard from "./component/pages/AdminDashboard/AdminDashboard";
import VoterDashboard from "./component/pages/VoterDashboard/VoterDashboard";
import RegisterVoters from "./component/pages/RegisterVoters/RegisterVoters";
//import routesConfig from "../src/component/Routes/routesConfig";
import ProtectedRoute from "../src/component/Routes/ProtectedRoute";
import { ToastContainer } from "react-toastify";
import { ThemeProvider } from "./context/ThemeContext";
import ManageUsers from "./component/pages/ManageUsers/ManageUsers";
import { useCallback, useEffect, useRef, useState } from "react";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const INACTIVITY_TIME = 20 * 60 * 1000; // 20 minutes
  const inactivityTimerRef = useRef(null);

  const navigate = useNavigate();

  // ✅ FIXED: Separated logout logic
  const logoutHandler = useCallback(() => {
    navigate("/");
    sessionStorage.clear();
    localStorage.removeItem("user");

    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
      inactivityTimerRef.current = null;
    }
  }, [navigate]);

  // ✅ FIXED: Separated login state check
  useEffect(() => {
    setIsLoggedIn(JSON.parse(sessionStorage.getItem("isLoggedIn")) || false);
  }, []); // Only runs once on mount

  // ✅ OPTIMIZED: Inactivity timeout effect - separate and minimal dependencies
  useEffect(() => {
    if (!isLoggedIn) return;

    const events = [
      "mousemove",
      "mousedown",
      "keydown",
      "touchstart",
      "scroll",
      "click",
    ];

    const resetInactivity = () => {
      // ✅ FIXED: Clear existing timer before setting new one
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }

      inactivityTimerRef.current = setTimeout(() => {
        logoutHandler();
      }, INACTIVITY_TIME);
    };

    // ✅ Attach listeners once
    events.forEach((ev) => window.addEventListener(ev, resetInactivity));

    // Start initial timer
    resetInactivity();

    // ✅ Proper cleanup
    return () => {
      events.forEach((ev) => window.removeEventListener(ev, resetInactivity));
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
        inactivityTimerRef.current = null;
      }
    };
  }, [isLoggedIn, INACTIVITY_TIME, logoutHandler]); // ✅ Reduced dependency issues

  return (
    <ThemeProvider>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/not-found" element={<NotFoundPage />} />

        {/* Protected routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute requiredRole="Admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/voter/dashboard"
          element={
            <ProtectedRoute requiredRole="Voter">
              <VoterDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/register-voters"
          element={
            <ProtectedRoute requiredRole="Admin">
              <RegisterVoters />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/manage-users"
          element={
            <ProtectedRoute requiredRole="Admin">
              <ManageUsers />
            </ProtectedRoute>
          }
        />

        {/* Catch all */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      {/* Toast notifications */}
      <ToastContainer />
    </ThemeProvider>
  );
}

export default App;
