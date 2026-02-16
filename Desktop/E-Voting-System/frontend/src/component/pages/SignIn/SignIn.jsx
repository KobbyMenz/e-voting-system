import { useState, Fragment } from "react";
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

// import { ToastContainer } from "react-toastify";
// import { toast } from "react-toastify";
// //import "react-toastify/dist/ReactToastify.css";
//import useAuth from "../CustomHooks/useAuth";
//import TimeDate from "../UI/TimeDate";

//import { response } from "express";

const SignIn = () => {
  // const apiUrl = import.meta.env.VITE_API_URL;
  // const appName = import.meta.env.VITE_APP_NAME;
  const [userName, setUserName] = useState("");
  const [pass, setPassword] = useState("");
  //const [showModal, setShowModal] = useState();
  const [showPassword, setShowPassword] = useState(false);
  const [loadingLogin, setLoadingLogin] = useState(false);
  const [error, setError] = useState(false);

  const navigate = useNavigate();
  const togglePassword = () => {
    setShowPassword((prevPassword) => !prevPassword);
  };

  const closeLoaderLogin = () => {
    setLoadingLogin((prev) => !prev);
  };

  const indexNumberHandler = (e) => {
    setUserName(e.target.value);
  };

  const passwordHandler = (e) => {
    setPassword(e.target.value);
  };

  //////////////////////////////////////
  //  LOGIN
  //////////////////////////////////////
  const onSubmitHandler = (e) => {
    e.preventDefault();

    if (userName === "KobbyMenz" && pass === "11111111") {
      navigate("/admin/dashboard");

    }else if (userName === "Ronyx" && pass === "22222222") {
      navigate("/voter/dashboard");
     } else {
      Toast("error", "Wrong credentials");
    }

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
            userName: userName,
            pass: pass,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          },
        );
        const expiryTimestamp = Date.now() + response.data.expiresIn;
        //console.log("Time:", new Date(response.data.expiresIn));
        localStorage.setItem("user", JSON.stringify(response.data.user));
        sessionStorage.setItem("token", JSON.stringify(response.data.token));
        sessionStorage.setItem("expiryTime", JSON.stringify(expiryTimestamp));

        // //==========checking for admin login============
        // if (response.data.token && response.data.user.loginType === "Admin") {
        //   navigate("/dashboard");
        //   sessionStorage.setItem("isLoggedIn", JSON.stringify(true));
        // }

        //==========checking for admin login============
        if (response.data.token && response.data.user.loginType === "Admin") {
          navigate("/admin/dashboard");
          sessionStorage.setItem("isLoggedIn", JSON.stringify(true));
        }

        //========checking for voter login ============
        if (response.data.token && response.data.user.loginType !== "Admin") {
          navigate("/voter/dashboard");
          sessionStorage.setItem("isLoggedIn", JSON.stringify(true));
        }
      } catch (err) {
        if (err.response && err.response.data && err.response.data.message) {
          Toast("error", err.response.data.message);
          setError(true);

          closeLoaderLogin();
        } else {
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
          <h2 className={classes.title}>OLINE VOTING SYSTEM</h2>
          {/* <h1 className={classes.sub__title}></h1> */}
          {/* <div className={classes.logo}>
            <img src={logo} alt="logo" />
          </div> */}

          <form onSubmit={onSubmitHandler}>
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
                onChange={indexNumberHandler}
                value={userName}
                id="index"
                type="text"
                placeholder=""
                required
              />

              <label htmlFor="index">User Name/User ID</label>
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
                onChange={passwordHandler}
                value={pass}
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder=""
                required
              />
              <label htmlFor="password">Password</label>

              {pass === "" ? (
                ""
              ) : (
                <div
                  className={classes.password__icon}
                  onClick={togglePassword}
                >
                  {showPassword ? <OpenEyeIcon /> : <CloseEyeIcon />}
                </div>
              )}
            </div>

            <div className={classes.btn_container}>
              <Button className={classes.login_btn} type="submit">
                {<LoginIcon />} {loadingLogin ? <LoginLoader /> : `Login`}
              </Button>
            </div>

            {/* <div className={classes.forgot_password}>
              <p>forgot password</p>
            </div> */}
          </form>

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
