import { Fragment } from "react";
import classes from "./MainHeader.module.css";
import PropTypes from "prop-types";
import ProfileCard from "../UI/ProfileCard/ProfileCard";
import Navigation from "../Navigation/Navigation";
import { Box } from "@mui/material";
//import { useNavigate } from "react-router-dom";
// import Menu from "./M";
// import Button from "../UI/Button";

const MainHeader = (props) => {
  return (
    <Fragment>
      <header className={`${classes["main-header"]} ${props.className}`}>
        <div className={classes.container}>
          <h2 className={classes.header_title}> {props.headerTitle}</h2>

          <Box display="flex" alignItems="center" gap="2rem">
            {props.children}

            <div className="profile_card">
              <ProfileCard profileImage={props.profileImage} />
            </div>
          </Box>
        </div>
      </header>
    </Fragment>
  );
};

MainHeader.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  profileImage: PropTypes.string,
  headerTitle: PropTypes.string,
};

export default MainHeader;
