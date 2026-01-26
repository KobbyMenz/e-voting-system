import { useCallback, useEffect, useState } from "react";
import classes from "./Navigation.module.css";
import Menu from "../MainHeader/Menu";
import QuestionModal from "../UI/Modals/QuestionModal";
import PropTypes from "prop-types";
//import { NavLink } from "react-router-dom";
import { NavLink, useNavigate } from "react-router-dom";
//import { useSnackbar } from "notistack";
import ToolTip from "../UI/ToolTip/ToolTip";
import Modal from "../UI/Modals/Modal";
//import logo from "./../../assets/images/KM_Inventory_logo_new.ico";
import axios from "axios";
import Button from "../UI/Button/Button";
import ArrowRightIcon from "../UI/Icons/RightArrowIcon";
import ArrowLeftIcon from "../UI/Icons/LeftArrowIcon";
import app_api_url from "../../app_api_url";

//import NavLi from "./NavLi";

const Navigation = (props) => {
  const [showModal, setShowModal] = useState(false);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  //const [active, setActive] = useState(null);
  const [toggle, setToggle] = useState(false);
  const [formData, setFormData] = useState({
    logo: "",
  });

  const onClickHandler = useCallback(() => {
    setToggle((prevToggle) => !prevToggle);
  }, []);

  const navigate = useNavigate();

  const onConfirmHandler = () => {
    setShowQuestionModal(false);
    // props.logoutTimeData.stopTimer();
    navigate("/");
    sessionStorage.clear();
    //localStorage.removeItem("user");
    // sessionStorage.removeItem("token");
    // sessionStorage.removeItem("expiryTime");
    // sessionStorage.removeItem("isLoggedIn");
  };

  // const onShowQuestionModalHandler = () => {
  //   setShowQuestionModal(true);
  // };

  const closeHandler = () => {
    setShowModal(false);
  };

  const closeQuestionModalHandler = () => {
    setShowQuestionModal(false);
  };

  useEffect(() => {
    const getSettings = async () => {
      try {
        const response = await axios.get(`${app_api_url}/getSettings`);

        setFormData((prev) => {
          return {
            ...prev,

            logo: response.data?.logo || "",
          };
        });

        // if (response.data) {
        //   setLoading(false);
        // }
      } catch (err) {
        console.log(err);
      }
    };
    getSettings();
  }, []);

  // const onClickLinkHandler = (index) => {
  //   setActive(index);
  // };

  return (
    <>
      {showModal && (
        <Modal
          title={showModal.title}
          message={showModal.message}
          onCloseModal={closeHandler}
        />
      )}

      {showQuestionModal && (
        <QuestionModal
          title={showQuestionModal.title}
          message={showQuestionModal.message}
          onCloseModal={closeQuestionModalHandler}
          onConfirm={onConfirmHandler}
        />
      )}

      <div className={classes.menu}>
        <Menu onToggle={toggle} onClick={onClickHandler} />
      </div>

      <div className={classes.backdrop}>
        <nav
          className={
            toggle ? `${classes.active} ${classes.nav} ` : `${classes.nav}`
          }
        >
          <ul>
            {/* <div className={classes.arrow} onClick={onClickHandler}>
              {toggle ? <ArrowLeftIcon /> : <ArrowRightIcon />}
            </div> */}
            <div className={` ${classes.logo_container} `}>
              <div className={classes.logo}>
                {formData.logo ? (
                  <img src={props.propsLogo || formData.logo} alt="logo" />
                ) : (
                  <div className={classes.dummyImage}></div>
                )}
              </div>
            </div>

            <div className={classes.li__container}>
              {props.children}

              {/* <li>
                <ToolTip title="Logout" placement="right">
                  <div>
                    <Button
                      onClick={onShowQuestionModalHandler}
                      className={` ${classes.link}`}
                      id={classes.logout_btn}
                    >
                      <div className={classes.link__icon}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="size-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15"
                          />
                        </svg>
                      </div>
                      <div className={classes.link_title}>Logout</div>
                    </Button>
                  </div>
                </ToolTip>
              </li> */}
            </div>
          </ul>
        </nav>
      </div>
    </>
  );
};
Navigation.propTypes = {
  className: PropTypes.string,
  logoutTimeData: PropTypes.object,
  setIsLogin: PropTypes.func,
  children: PropTypes.node,
  propsLogo: PropTypes.string,
  // toggleNav: PropTypes.bool,
};
export default Navigation;
