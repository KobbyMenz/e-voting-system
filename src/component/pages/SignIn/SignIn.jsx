import { useState, Fragment, useEffect } from "react";
//import DarkVeil from "./DarkVeil";
//import Iridescence from "./Iridescence";
//import { useNavigate } from "react-router-dom";
import classes from "../SignIn/SignIn.module.css";
import Card from "../../UI/Card/Card";
import Button from "../../UI/Button/Button";
import axios from "axios";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import LoginLoader from "../../UI/LoginLoader/LoginLoader";
//import ErrorIcon from "../UI/Icons/ErrorIcon";
import SocialMediaButtons from "../../UI/SocialMedia/SocialMedia";
import Toast from "../../UI/Notification/Toast";
//import Modal from "../UI/Modals/Modal";
// import logo from "./../../assets/images/KM_Inventory_logo_new.ico";
import app_api_url from "../../../app_api_url";
import LoginIcon from "../../UI/Icons/LoginIcon";
import OpenEyeIcon from "../../UI/Icons/OpenEyeIcon";
import CloseEyeIcon from "../../UI/Icons/CloseEyeIcon";
import ROLES from "../../Utils/ROLES";
//import Filter from "../../UI/Filter/Filter";
import FilterIcon from "../../UI/Icons/FilterIcon";
//import { useLockoutTimer } from "../../CustomHooks/useLockoutTimer";
import LockoutModal from "../../UI/Modals/LockoutModal";

// import { ToastContainer } from "react-toastify";
// import { toast } from "react-toastify";
// //import "react-toastify/dist/ReactToastify.css";
//import useAuth from "../CustomHooks/useAuth";
//import TimeDate from "../UI/TimeDate";

//import { response } from "express";

const SignIn = () => {
  // const apiUrl = import.meta.env.VITE_API_URL;
  // const appName = import.meta.env.VITE_APP_NAME;
  const [formData, setFormData] = useState({
    userName: "",
    password: "",
    role: "",
  });
  // const [userName, setUserName] = useState("");
  // const [password, setPassword] = useState("");
  // const [sec, setSec] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loadingLogin, setLoadingLogin] = useState(false);
  const [error, setError] = useState(false);
  const [isAccountLocked, setIsAccountLocked] = useState(false);
  const [showLockoutModal, setShowLockoutModal] = useState(false);

  const navigate = useNavigate();
  //const { timeRemaining, isExpired } = useLockoutTimer(isAccountLocked);

  // Auto-unlock account when lockout expires
  useEffect(() => {
    if (isAccountLocked) {
      setIsAccountLocked(false);
      setShowLockoutModal(false);
    }
  }, [isAccountLocked]);

  // Show modal when account gets locked
  useEffect(() => {
    if (isAccountLocked) {
      setShowLockoutModal(true);
    }
  }, [isAccountLocked]);

  const togglePassword = () => {
    setShowPassword((prevPassword) => !prevPassword);
  };

  const closeLoaderLogin = () => {
    setLoadingLogin((prev) => !prev);
  };

  const onChangeHandler = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // 🔒 SECURITY: Reset account lockout & error state when username or role changes
    // Lockout is username-specific, not session-specific
    // Different users should have independent lockout states
    if (name === "userName" || name === "role") {
      setIsAccountLocked(false);
      setShowLockoutModal(false);
      setError(false); // Clear error styling from previous attempts
    }
  };

  //////////////////////////////////////
  //  LOGIN
  //////////////////////////////////////
  const onSubmitHandler = (e) => {
    e.preventDefault();

    //=======Making API call to the backend for LOGIN============
    const login = async () => {
      setLoadingLogin(true);
      // closeLoaderLogin();

      try {
        //172.20.10.4
        const response = await axios.post(
          // "http://localhost:3001/api/login",
          `${app_api_url}/login`,
          {
            username: formData.userName,
            password: formData.password,
            role: formData.role,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true, // Include credentials for cookie handling
          },
        );
        // Store tokens and user data
        localStorage.setItem("user", JSON.stringify(response.data.user));
        sessionStorage.setItem("accessToken", response.data.accessToken);
        sessionStorage.setItem("refreshToken", response.data.refreshToken);

        // Calculate 15-minute expiry time
        const expiryTimestamp = Date.now() + 15 * 60 * 1000; // 15 minutes in milliseconds
        sessionStorage.setItem("expiryTime", JSON.stringify(expiryTimestamp));

        //==========checking for admin login============
        if (
          response.data.accessToken &&
          response.data.user.role === ROLES.ADMIN
        ) {
          navigate("/admin/dashboard");
          sessionStorage.setItem("isLoggedIn", JSON.stringify(true));
        } else {
          navigate("/voter/dashboard");
          sessionStorage.setItem("isLoggedIn", JSON.stringify(true));
        }
      } catch (err) {
        // 🔒 Handle account lockout (429 Too Many Requests)
        if (err.response && err.response.status === 429) {
          setIsAccountLocked(true);
          setShowLockoutModal(true);
          Toast(
            "error",
            `Too many login attempts. Please try again in ${Math.ceil(err.response.data.error / 60)} minutes`,
          );
          localStorage.setItem(
            "LOCKOUT_TIMESTAMP_KEY",
            JSON.stringify(err.response.data.error),
          );
          setError(true);
          closeLoaderLogin();
        }
        // ❌ Handle invalid credentials (401 Unauthorized)
        else if (err.response && err.response.data && err.response.data.error) {
          Toast("error", err.response.data.error);
          setError(true);
          closeLoaderLogin();
        }
        // ❌ Handle other error responses with message field
        else if (
          err.response &&
          err.response.data &&
          err.response.data.message
        ) {
          Toast("error", err.response.data.message);
          setError(true);
          closeLoaderLogin();
        }
        // 🌐 Handle network errors
        else {
          Toast("error", "Network error! Server cannot be reached");
          closeLoaderLogin();
        }
      }
    };
    login();
  };

  // const closeModalHandler = () => {
  //   setShowModal(null);
  // };

  return (
    <Fragment>
      {/* <ToastContainer /> */}
      {/* {showModal && (
        <Modal
          title={showModal.title}
          icon={showModal.icon}
          message={showModal.message}
          onCloseModal={closeModalHandler}
        />
      )} */}
      <div
        // style={{ height: "100vh", position: "relative" }}
        className={classes.main__container}
      >
        {/* <DarkVeil speed={2.0} resolutionScale={1.3} scanlineFrequency={1} /> */}

        <Card className={classes.input}>
          <h2 className={classes.title}>OLINE VOTING SYSTEM FOR SHS</h2>
          {/* <h1 className={classes.sub__title}></h1> */}
          {/* <div className={classes.logo}>
            <img src={logo} alt="logo" />
          </div> */}

          <form onSubmit={onSubmitHandler}>
            <div className={`${classes.form_control}`}>
              <div className={classes.icon}>
                <FilterIcon />
              </div>

              {/* <Filter
                name="role"
                id="role"
                onChange={onChangeHandler}
                value={formData.role}
                placeholder="Select your type"
                onClickCloseBtn={() =>
                  setFormData((prev) => ({ ...prev, role: "" }))
                }
              /> */}

              <select
                name="role"
                id="role"
                onChange={onChangeHandler}
                value={formData.role}
                required
                className={error ? `${classes.error}` : `${classes.success}`}
              >
                <option value="">Select User Type</option>
                <option value={ROLES.VOTER}>Voter</option>
                <option value={ROLES.ADMIN}>Admin</option>
              </select>

              {/* <label htmlFor="index">User Name/User ID</label> */}
            </div>

            <div className={`${classes.form_control}`}>
              <div className={classes.icon}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="size-6"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>

              <input
                className={error ? `${classes.error}` : `${classes.success}`}
                onChange={onChangeHandler}
                value={formData.userName}
                id="userName"
                name="userName"
                type="text"
                placeholder=""
                required
              />

              <label htmlFor="userName">User Name/User ID</label>
            </div>

            <div className={classes.form_control}>
              <div className={classes.icon}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="size-6"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 1.5a5.25 5.25 0 0 0-5.25 5.25v3a3 3 0 0 0-3 3v6.75a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3v-6.75a3 3 0 0 0-3-3v-3c0-2.9-2.35-5.25-5.25-5.25Zm3.75 8.25v-3a3.75 3.75 0 1 0-7.5 0v3h7.5Z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>

              <input
                className={error ? `${classes.error}` : `${classes.success}`}
                onChange={onChangeHandler}
                value={formData.password}
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder=""
                required
              />
              <label htmlFor="password">Password</label>

              {formData.password === "" ? (
                ""
              ) : (
                <div
                  className={classes.password__icon}
                  onClick={togglePassword}
                >
                  {showPassword ? <CloseEyeIcon /> : <OpenEyeIcon />}
                </div>
              )}
            </div>

            <div className={classes.btn_container}>
              <Button
                className={classes.login_btn}
                type="submit"
                disabled={isAccountLocked || loadingLogin}
                style={{
                  opacity: isAccountLocked ? 0.2 : 1,
                  cursor: isAccountLocked ? "not-allowed" : "pointer",
                }}
              >
                {<LoginIcon />} {loadingLogin ? <LoginLoader /> : `Login`}
              </Button>
            </div>

            {/* <div className={classes.forgot_password}>
              <p>forgot password</p>
            </div> */}
          </form>

          {/* 🔒 LOCKOUT MODAL WITH COUNTDOWN TIMER */}
          {showLockoutModal && (
            <LockoutModal
              title="🔒 Account Locked"
              message="Too many failed login attempts."
              // timeRemaining={timeRemaining}
              onCloseModal={() => setShowLockoutModal(false)}
            />
          )}

          <footer>
            <p>Powered by KOBBY-MENZ Tech Solutions.</p>
            <SocialMediaButtons />
          </footer>

          {/* {error && <p style={{ color: "red" }}>{error}</p>} */}
        </Card>
      </div>
    </Fragment>
  );
};
SignIn.propTypes = {
  // onUserDetails: PropTypes.func,
  setIsLogin: PropTypes.func,
};
export default SignIn;
