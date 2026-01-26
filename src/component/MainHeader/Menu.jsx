// import React from "react";
import { Fragment } from "react";
import PropTypes from "prop-types";
import classes from "../MainHeader/Menu.module.css";

const Menu = (props) => {
  return (
    <Fragment>
      {/* <div className={classes.menu}> */}
      <div
        onClick={props.onClick}
        className={`${classes.menu__container} ${props.className}`}
      >
        {/* {!props.onToggle ? (
          <svg
            style={{ transition: " 0.3s ease-in-out" }}
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
              d="m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5"
            />
          </svg>
        ) : (
          <svg
            style={{ transition: "0.3s ease-in-out" }}
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
              d="m18.75 4.5-7.5 7.5 7.5 7.5m-6-15L5.25 12l7.5 7.5"
            />
          </svg>
        )} */}
        <div
          className={props.onToggle ? `${classes.active}` : ` ${classes.menu}`}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
      {/* </div> */}
    </Fragment>
  );
};
Menu.propTypes = {
  onClick: PropTypes.func.isRequired,
  onToggle: PropTypes.bool.isRequired,
  className: PropTypes.string,
};

export default Menu;
