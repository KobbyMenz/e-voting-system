import { Route, Routes } from "react-router-dom";
import "./App.css";
import SignIn from "./component/pages/SignIn/SignIn";
import NotFoundPage from "./component/pages/NotFound/NotFoundPage";
import AdminDashboard from "./component/pages/AdminDashboard/AdminDashboard";
import VoterDashboard from "./component/pages/VoterDashboard/VoterDashboard";
import { ToastContainer } from "react-toastify";
import { ThemeProvider } from "./context/ThemeContext";

function App() {
  return (
    <ThemeProvider>
      <main className="App">
        <ToastContainer />
        <Routes>
          {/* Define your routes here */}
          <Route path="/" element={<SignIn />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/voter/dashboard" element={<VoterDashboard />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </ThemeProvider>
  );
}

export default App;
