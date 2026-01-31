//import axios from "axios";
import { useEffect, useState } from "react";
import classes from "./ProfileCard.module.css";
//import defaultProfilePicture from "../../../assets/images/profilePicture.png";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
//import ToolTip from "../ToolTip/ToolTip";
//import FormatDate from "../../Functions/FormatDate";
//import formatName from "../../Functions/formatName";
// import moment from "moment";
import ProfileCardSkeleton from "../Skeleton/ProfileCardSkeleton";
import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  //Tooltip,
  Typography,
} from "@mui/material";
import Person from "@mui/icons-material/Person";
import Logout from "@mui/icons-material/Logout";
import ToolTip from "../ToolTip/ToolTip";
import Card from "../Card/Card";
import ImageBox from "../ImageBox/ImageBox";
//import app_api_url from "../../../app_api_url";
import QuestionModal from "../Modals/QuestionModal";

const settings = [
  { key: "profile", label: "Profile", Icon: Person },
  { key: "logout", label: "Logout", Icon: Logout },
];

const ProfileCard = () => {
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [userDetails, setUserDetails] = useState({
    fullName: "",
    lastLogin: "",
    loginType: "",
  });
  // const [selectedImage, setSelectedImage] = useState("");
  // const [loading, setLoading] = useState(true);

  //   props.loading(loading);
  //========Getting user's info from local storage ============
  useEffect(() => {
    const userDataFromLocalStorage = JSON.parse(localStorage.getItem("user"));

    if (userDataFromLocalStorage) {
      setUserDetails((prev) => {
        return {
          ...prev,
          fullName: userDataFromLocalStorage.fullName,
          lastLogin: userDataFromLocalStorage.lastLogin,
          loginType: userDataFromLocalStorage.loginType,
        };
      });
    }
  }, []);

  //////////////////////////////////////////////////////////////
  // useEffect(() => {
  //   //Fetching profile picture from the backend
  //   const userDataFromLocalStorage = JSON.parse(localStorage.getItem("user"));
  //   const userId = userDataFromLocalStorage.userId ;

  //   axios
  //     .get(`${app_api_url}/getUserProfilePicture/${userId}`)
  //     .then((response) => {
  //       if (
  //         response.data.profilePicture !== null ||
  //         response.data.profilePicture !== ""
  //       ) {
  //         setSelectedImage(
  //           response.data.profilePicture
  //             ? `${response.data.profilePicture}`
  //             : props.profileImage,
  //         );

  //         setLoading(false);
  //         // console.log("response: ", selectedImage);
  //       }
  //     })
  //     .catch((err) => {
  //       console.log(err.response.data.error);
  //       setLoading(false);
  //     });
  // }, [selectedImage, props.profileImage]);
  //////////////////////////////////////////////////////

  //Getting user name from props
  // const userName = formatName(userDetails.fullName);
  // const lastLoginDate = userDetails.lastLogin.split(" ")[0];

  // const time = moment(userDetails.lastLogin).format("hh:mm:ss A");
  // const day = FormatDate(lastLoginDate.trim());
  // const dayName = moment(userDetails.lastLogin).format("ddd");

  //Navigating to the various user profile
  const navigate = useNavigate();
  const onClickProfileHandler = () => {
    if (userDetails.loginType === "Admin") {
      navigate("/adminProfile");
    }

    if (userDetails.loginType !== "Admin") {
      navigate("/voterProfile");
    }
  };

  const [anchorElUser, setAnchorElUser] = useState(null);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  //Confirm handler of logout modal
  const onConfirmHandler = () => {
    setShowQuestionModal(false);
    navigate("/");
    sessionStorage.clear();
  };

  //Handler to show logout modal
  const onShowQuestionModalHandler = () => {
    setShowQuestionModal(true);
  };

  //Handler to close logout modal
  const closeQuestionModalHandler = () => {
    setShowQuestionModal(false);
  };

  return (
    <>
      {/* =======Logout modal ==========*/}
      {showQuestionModal && (
        <QuestionModal
          onCloseModal={closeQuestionModalHandler}
          onConfirm={onConfirmHandler}
        />
      )}

      {
      // !loading ? (
      //   <ProfileCardSkeleton />
      // ) : 
      (
        <div className={classes.user_details_container}>
          {/*======= user and last login details ===========*/}
          <div className={classes.user_details}>
            <p className={classes.user_name}>{userDetails.fullName}</p>
            {/* <div className={classes.last_login}>
              <span>Last Login: </span>
              {day === "Today" || day === "Yesterday"
                ? `${day},`
                : `${lastLoginDate},`}
            </div>
            <div className={classes.time}>
              {userDetails.lastLogin === "N/A" ? "" : `${dayName} @ ${time}`}
            </div> */}
          </div>

          {/*=========== Profile Menu =======s=====*/}
          <div className={classes.avatar_container}>
            <Toolbar disableGutters>
              <Box sx={{ flexGrow: 0 }}>
                <ToolTip title="Open menu">
                  {/*=========== Profile Picture ==============*/}
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <ImageBox
                      width="3.5rem"
                      height="3.5rem"
                      borderRadius="50%"
                      // src={selectedImage}
                    />
                  </IconButton>
                </ToolTip>

                {/*======= Menu popup ========*/}
                <Card className={classes.card}>
                  <Menu
                    sx={{ mt: "4.5rem" }}
                    id="menu-appbar"
                    anchorEl={anchorElUser}
                    anchorOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    open={Boolean(anchorElUser)}
                    onClose={handleCloseUserMenu}
                    PaperProps={{
                      sx: {
                        maxWidth: "calc(100vw - 2rem)",
                        // boxShadow: "0 0.5rem 1.5rem rgba(0,0,0,0.15)",
                        boxShadow: "0rem 0.5rem 1.5rem rgba(0, 0, 0, 0.25)",
                        p: 0,
                      },
                    }}
                  >
                    {settings.map((setting) => {
                      const { key, label, Icon } = setting;
                      return (
                        <MenuItem
                          key={key}
                          onClick={() => {
                            handleCloseUserMenu();
                            if (key === "profile") onClickProfileHandler();
                            if (key === "logout") onShowQuestionModalHandler();
                          }}
                          sx={{
                            py: 1.25,
                            width: "12rem",
                            fontSize: "1.5rem",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            // color: "#fff",
                            px: 2,
                            transition: "background-color 200ms, color 200ms",
                            "&:hover": {
                              backgroundColor: "var(--primary)",
                              color: "#fff",
                            },

                            "&:hover label": {
                              // backgroundColor: "var(--primary)",
                              color: "inherit",
                            },
                          }}
                        >
                          <Icon
                            sx={{
                              fontSize: "1.6rem",
                              color: "inherit",
                              "&:hover": {
                                // backgroundColor: "inherit",
                                // color: "#fff",
                              },
                            }}
                          />
                          <Typography
                            sx={{
                              fontSize: "1.5rem",
                              "&:hover ": {
                                // backgroundColor: "var(--primary)",
                                color: "inherit",
                              },
                            }}
                          >
                            {label}
                          </Typography>
                        </MenuItem>
                      );
                    })}
                  </Menu>
                </Card>
              </Box>
            </Toolbar>
          </div>
        </div>
      )}
    </>
  );
};
ProfileCard.propTypes = {
  profileImage: PropTypes.string,
};
export default ProfileCard;
