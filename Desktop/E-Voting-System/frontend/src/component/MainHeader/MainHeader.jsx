import { Fragment } from "react";
import classes from "./MainHeader.module.css";
import PropTypes from "prop-types";
import ProfileCard from "../UI/ProfileCard/ProfileCard";
import Navigation from "../Navigation/Navigation";
import { Box } from "@mui/material";
import ThemeToggle from "../UI/ThemeToggle/ThemeToggle";
import logo from "../../assets/images/KM_Inventory_logo_new.ico";
//import { useNavigate } from "react-router-dom";
// import Menu from "./M";
// import Button from "../UI/Button";

const MainHeader = (props) => {
  return (
    <Fragment>
      <header className={`${classes["main-header"]} ${props.className}`}>
        <div className={classes.container}>
          <div className={classes.logo_container}>
            <h2 className={classes.header_title}> {props.headerTitle}</h2>
            <img src={logo} width={"45rem"} height={"45rem"} alt="logo" />
          </div>

          <Box display="flex" alignItems="center" gap="0.5rem">
            <Box sx={{ marginRight: "1rem" }}>{props.children}</Box>

            <Box sx={{ borderLeft: "0.3rem solid var(--bg-color)" }}>
              <ThemeToggle />
            </Box>

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
