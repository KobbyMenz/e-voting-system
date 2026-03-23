import { Route, Routes, useNavigate } from "react-router-dom";
import "./App.css";
import SignIn from "./component/pages/SignIn/SignIn";
import NotFoundPage from "./component/pages/NotFound/NotFoundPage";
import AdminDashboard from "./component/pages/AdminDashboard/AdminDashboard";
import VoterDashboard from "./component/pages/VoterDashboard/VoterDashboard";
import RegisterVoters from "./component/pages/RegisterVoters/RegisterVoters";
import routesConfig from "../src/component/Routes/routesConfig";
import ProtectedRoute from "../src/component/Routes/ProtectedRoute";
import { ToastContainer } from "react-toastify";
import { ThemeProvider } from "./context/ThemeContext";
import ManageUsers from "./component/pages/ManageUsers/ManageUsers";
import { useCallback, useEffect, useRef, useState } from "react";
//import useLogoutTimer from "./components/CustomHooks/useLogoutTimer";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // const [logoutTimer, setLogoutTimer] = useState(10);
  //const [autoTheme, setAutoTheme] = useState("");

  // Inactivity timeout (15 minutes)
  const INACTIVITY_TIME = 15 * 60 * 1000; // 15 minutes

  // Inactivity timeout (15 minutes)
  const inactivityTimerRef = useRef(null);

  /////////////////////////////////////////////
  //Logout function
  ////////////////////////////////////////
  const navigate = useNavigate();
  const logoutHandler = useCallback(() => {
    navigate("/");
    sessionStorage.clear();
    localStorage.removeItem("user");

    // clear inactivity timer
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
      inactivityTimerRef.current = null;
    }
  }, [navigate]);

  ////////////////////////////////////////////////////////////////
  //==== Inactivity auto-logout: reset on user activity====
  ////////////////////////////////////////////////////////////
  useEffect(() => {
    //const isLoggedInSessionStorage = ;
    setIsLoggedIn(JSON.parse(sessionStorage.getItem("isLoggedIn")));

    if (!isLoggedIn) return; // Only track when logged in
    // const localStorageAutoLogoutTime = +localStorage.getItem("autoLogoutTime");

    const events = [
      "mousemove",
      "mousedown",
      "keydown",
      "touchstart",
      "scroll",
      "click",
    ];

    const resetInactivity = () => {
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }

      // set a new inactivity timeout
      inactivityTimerRef.current = setTimeout(() => {
        logoutHandler();
      }, INACTIVITY_TIME);

      // Also update stored expiryTime so other tabs/logic can read it
      // try {
      //   const expiryTimestamp = Date.now() + localStorageAutoLogoutTime;
      //   localStorage.setItem("expiryTime", JSON.stringify(expiryTimestamp));
      // } catch {
      //   // ignore
      // }
    };

    // attach listeners
    events.forEach((ev) => window.addEventListener(ev, resetInactivity));

    // start initial timer
    resetInactivity();

    return () => {
      events.forEach((ev) => window.removeEventListener(ev, resetInactivity));
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
        inactivityTimerRef.current = null;
      }
    };
  }, [INACTIVITY_TIME, logoutHandler, isLoggedIn]);
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
    <ThemeProvider>
      <main className="App">
        <ToastContainer />

        <Routes>
          {/* Define your routes here /admin/manage-users */}
          <Route path="/" element={<SignIn />} />

          {/* 
          Protected Routes: 
          Mapping through the routesConfig array and rendering the routes based on the user's role. 
          The routes are wrapped inside the ProtectedRoute component which checks for the allowed roles before rendering the component. 
          If the user does not have the required role, they will be redirected to the login page. 
           */}
          {routesConfig.map(({ role, routes }) => (
            <Route
              key={`role-${role}`}
              element={<ProtectedRoute allowedRoles={[role]} />}
            >
              {/* 
              Mapping through the routes array for each role and rendering the corresponding component for each route. The components are wrapped inside the ProtectedRoute component which checks for the allowed roles before rendering the component. If the user does not have the required role, they will be redirected to the login page.
              */}
              {routes.map(({ path, component: Component }) => (
                <Route
                  key={`${role}-${path}`}
                  path={path}
                  element={<Component />}
                />
              ))}
            </Route>
          ))}

          {/* <Route
            path="/admin/dashboard"
            element={isLoggedIn && <AdminDashboard />}
          />

          <Route
            path="/voter/dashboard"
            element={isLoggedIn && <VoterDashboard />}
          />

          <Route
            path="/admin/register"
            element={isLoggedIn && <RegisterVoters />}
          />

          <Route
            path="/admin/manage_users"
            element={isLoggedIn && <ManageUsers />}
          /> */}

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </ThemeProvider>
  );
}

export default App;
