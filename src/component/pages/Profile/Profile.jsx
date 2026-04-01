import { Fragment, useState } from "react";
//import "../dashboard/Dashboard.css";
import "../../Layout/Layout.css";
import classes from "../../Navigation/Navigation.module.css";
import Navigation from "../../Navigation/Navigation";
import MainHeader from "../../MainHeader/MainHeader";
import ProfileContent from "./ProfileContent";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";
import ToolTip from "../../UI/ToolTip/ToolTip";
import DashboardIcon from "../../UI/Icons/DashboardIcon";

const Profile = () => {
  const [profileImage, setProfileImage] = useState("");

  const profilePictureHandler = (image) => {
    setProfileImage(image);
  };

  return (
    <Fragment>
      <div className="wrapper">
        <MainHeader profileImage={profileImage}>
          <Navigation>
            <li>
              <ToolTip title="Cast Vote" placement="bottom">
                <NavLink to={"/voter/dashboard"}>
                  <div className={` ${classes.link} ${classes.current}`}>
                    <div className={classes.link__icon}>
                      <DashboardIcon />
                    </div>

                    <div className={classes.link_title}>Cast Vote</div>
                  </div>
                </NavLink>
              </ToolTip>
            </li>
          </Navigation>
        </MainHeader>

        <div className="content">
          <ProfileContent
            // closeLoader={props.closeLoader}
            onSubmitProfilePicture={profilePictureHandler}
          />
        </div>
      </div>
    </Fragment>
  );
};
Profile.propTypes = {
  logoutTimeData: PropTypes.object,
};

export default Profile;
