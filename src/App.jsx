import { Route, Routes, useNavigate } from "react-router-dom";
import "./App.css";
import SignIn from "./component/pages/SignIn/SignIn";
import NotFoundPage from "./component/pages/NotFound/NotFoundPage";
import AdminDashboard from "./component/pages/AdminDashboard/AdminDashboard";
import VoterDashboard from "./component/pages/VoterDashboard/VoterDashboard";
import RegisterVoters from "./component/pages/RegisterVoters/RegisterVoters";
import ProtectedRoute from "../src/component/Routes/ProtectedRoute";
import { ToastContainer } from "react-toastify";
import { ThemeProvider } from "./context/ThemeContext";
import ManageUsers from "./component/pages/ManageUsers/ManageUsers";
import { useCallback, useEffect, useRef, useState } from "react";
import Profile from "./component/pages/Profile/Profile";
import ErrorBoundary from "./component/ErrorBoundary/ErrorBoundary"; // ✅ CRITICAL FIX: Import error boundary
// 🔒 SECURITY: Import secure logout service
import {
  secureLogout,
  setupTokenExpiration,
  setupAutoTokenRefresh,
} from "./component/Services/secureLogout";

function App() {
  // ✅ FIXED: Initialize state from sessionStorage to avoid setState in effect
  const [isLoggedIn] = useState(() => {
    return JSON.parse(sessionStorage.getItem("isLoggedIn")) || false;
  });
  const INACTIVITY_TIME = 20 * 60 * 1000; // 20 minutes
  const inactivityTimerRef = useRef(null);
  const tokenExpirationRef = useRef(null); // 🔒 Track token expiration timer
  const autoRefreshTokenRef = useRef(null); // 🔒 Track auto token refresh timer

  const navigate = useNavigate();

  // ✅ FIXED: Separated logout logic - now with secure backend logout
  const logoutHandler = useCallback(async () => {
    // 🔒 SECURITY: Call secure logout that invalidates token on backend
    await secureLogout();

    navigate("/");

    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
      inactivityTimerRef.current = null;
    }

    if (tokenExpirationRef.current) {
      clearTimeout(tokenExpirationRef.current);
      tokenExpirationRef.current = null;
    }

    if (autoRefreshTokenRef.current) {
      clearTimeout(autoRefreshTokenRef.current);
      autoRefreshTokenRef.current = null;
    }
  }, [navigate]);

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

  // 🔒 SECURITY: Setup automatic token refresh and logout on expiration
  useEffect(() => {
    if (!isLoggedIn) return;

    // Setup automatic token refresh (refreshes 2 minutes before expiration)
    autoRefreshTokenRef.current = setupAutoTokenRefresh(() => {
      console.warn("⚠️ Token refresh failed, logging out...");
      logoutHandler();
    });

    // Setup automatic logout as fallback (on actual token expiration)
    tokenExpirationRef.current = setupTokenExpiration(() => {
      logoutHandler();
    });

    return () => {
      if (autoRefreshTokenRef.current) {
        clearTimeout(autoRefreshTokenRef.current);
        autoRefreshTokenRef.current = null;
      }
      if (tokenExpirationRef.current) {
        clearTimeout(tokenExpirationRef.current);
        tokenExpirationRef.current = null;
      }
    };
  }, [isLoggedIn, logoutHandler]);
  ///////////////////////////////////////////////

  ///////////////////////////////////////
  //Disabling right click and keyboard shortcuts
  ///////////////////////////////////////
  // useEffect(() => {
  //   const handleContextMenu = (e) => {
  //     e.preventDefault();
  //   };

  //   document.addEventListener("contextmenu", handleContextMenu);

  //   const disableShortcuts = (e) => {
  //     if (
  //       (e.ctrlKey && e.shiftKey && e.key === "I") ||
  //       (e.ctrlKey && e.shiftKey && e.key === "J") ||
  //       (e.ctrlKey && e.key === "U") ||
  //       e.key === "F12"
  //     ) {
  //       e.preventDefault();
  //     }
  //   };

  //   document.addEventListener("keydown", disableShortcuts);

  //   return () => {
  //     document.removeEventListener("contextmenu", handleContextMenu);
  //     document.removeEventListener("keydown", disableShortcuts);
  //   };
  // }, []);
  //////////////////////////////////////////////

  return (
    <ErrorBoundary>
      <ThemeProvider>
        {/* Toast notifications */}
        <ToastContainer />

        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route path="/not-found" element={<NotFoundPage />} />

          {/* Protected Admin Routes */}
          <Route element={<ProtectedRoute allowedRoles={["Admin"]} />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/register" element={<RegisterVoters />} />
            <Route path="/admin/manage_users" element={<ManageUsers />} />
          </Route>

          {/* Protected Voter Routes */}
          <Route element={<ProtectedRoute allowedRoles={["Voter"]} />}>
            <Route path="/voter/dashboard" element={<VoterDashboard />} />
            <Route path="/voter/profile" element={<Profile />} />
          </Route>

          {/* Catch all */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
