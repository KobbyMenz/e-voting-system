import { Fragment, useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import Card from "../../UI/Card/Card";
import Button from "../../UI/Button/Button";
import QuestionModal from "../../UI/Modals/QuestionModal";
import MainHeader from "../../MainHeader/MainHeader";
import Navigation from "../../Navigation/Navigation";
import ToolTip from "../../UI/ToolTip/ToolTip";
import navigationClasses from "../../Navigation/Navigation.module.css";
import "../../Layout/Layout.css";
import VoterDashboardContent from "./VoterDashboardContent";


const VoterDashboard = () => {
  const navigate = useNavigate();
  
  const [showLogoutModal, setShowLogoutModal] = useState(false);
 

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleConfirmLogout = () => {
    localStorage.removeItem("user");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("expiryTime");
    sessionStorage.removeItem("isLoggedIn");
    setShowLogoutModal(false);
    navigate("/");
  };

  const handleCloseModal = () => {
    setShowLogoutModal(false);
  };

 

  return (
    <Fragment>
      {showLogoutModal && (
        <QuestionModal
          onConfirm={handleConfirmLogout}
          onCloseModal={handleCloseModal}
        />
      )}

      

      <div className="wrapper">
        <MainHeader>
          <Navigation>
            <li>
              <ToolTip title="Voting" placement="bottom">
                <NavLink to={"/voter/dashboard"}>
                  <div className={`${navigationClasses.link}`}>
                    <div className={navigationClasses.link__icon}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div className={navigationClasses.link_title}>Voting</div>
                  </div>
                </NavLink>
              </ToolTip>
            </li>
            <li>
              <ToolTip title="Logout" placement="bottom">
                <div
                  className={`${navigationClasses.link}`}
                  onClick={handleLogoutClick}
                  style={{ cursor: "pointer" }}
                >
                  <div className={navigationClasses.link__icon}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
                      />
                    </svg>
                  </div>
                  <div className={navigationClasses.link_title}>Logout</div>
                </div>
              </ToolTip>
            </li>
          </Navigation>
        </MainHeader>

        <div className="content">
          <VoterDashboardContent />
        </div>
      </div>
    </Fragment>
  );
};

export default VoterDashboard;
