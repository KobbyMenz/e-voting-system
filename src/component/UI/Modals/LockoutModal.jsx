import { Fragment } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import classes from "./LockoutModal.module.css";
import Card from "../Card/Card";
import Button from "../Button/Button";

const Backdrop = (props) => {
  return <div className={classes.backdrop} onClick={props.onCloseModal} />;
};

Backdrop.propTypes = {
  onCloseModal: PropTypes.func.isRequired,
};

const ModalOverlay = (props) => {
  // Format the countdown time
  const minutes = Math.floor(props.timeRemaining / 60);
  const seconds = props.timeRemaining % 60;
  const formattedTime = `${minutes}:${seconds.toString().padStart(2, "0")}`;

  // Add warning class if time is running out (less than 2 minutes)
  const isLowTime = props.timeRemaining < 120;

  return (
    <Card className={classes.modal}>
      <header>{props.title}</header>
      <div className={classes.content}>
        <p className={classes.subtitle}>{props.message}</p>
        <p className={classes.countdown}>
          Try again in:{" "}
          <span
            className={`${classes.timer} ${isLowTime ? classes.timerWarning : ""}`}
          >
            {formattedTime}
          </span>
        </p>
      </div>

      <div className={classes.btn_container}>
        <Button className={classes.btn} onClick={props.onCloseModal}>
          Close
        </Button>
      </div>
    </Card>
  );
};

ModalOverlay.propTypes = {
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  timeRemaining: PropTypes.number.isRequired,
  onCloseModal: PropTypes.func.isRequired,
};

const LockoutModal = (props) => {
  return (
    <Fragment>
      {ReactDOM.createPortal(
        <Backdrop onCloseModal={props.onCloseModal} />,
        document.getElementById("backdrop-root"),
      )}
      {ReactDOM.createPortal(
        <ModalOverlay
          title={props.title}
          message={props.message}
          timeRemaining={props.timeRemaining}
          onCloseModal={props.onCloseModal}
        />,
        document.getElementById("overlay-root"),
      )}
    </Fragment>
  );
};

LockoutModal.propTypes = {
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  timeRemaining: PropTypes.number.isRequired,
  onCloseModal: PropTypes.func.isRequired,
};

export default LockoutModal;
