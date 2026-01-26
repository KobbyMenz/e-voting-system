import { Route, Routes } from "react-router-dom";
import "./App.css";
import SignIn from "./component/pages/SignIn/SignIn";
import NotFoundPage from "./component/pages/NotFound/NotFoundPage";
import AdminDashboard from "./component/pages/AdminDashboard/AdminDashboard";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <>
      <main className="App">
        <ToastContainer />
        <Routes>
          {/* Define your routes here */}
          <Route path="/" element={<SignIn />} />
          <Route path="admin/dashboard" element={<AdminDashboard />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
