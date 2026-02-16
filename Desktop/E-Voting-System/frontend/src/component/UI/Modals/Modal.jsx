import { Fragment } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import classes from "../../UI/Modals/Modal.module.css";
import Card from "../Card/Card";
import Button from "../Button/Button";

const Backdrop = (props) => {
  return <div className={classes.backdrop} onClick={props.onCloseModal} />;
};
Backdrop.propTypes = {
  // title: PropTypes.string,
  // message: PropTypes.string,
  // backdrop: PropTypes.func.isRequired,
  onCloseModal: PropTypes.func.isRequired,
};

const ModalOverlay = (props) => {
  return (
    <Card className={classes.modal}>
      <header>{props.title}</header>
      <div className={classes.content}>
        {props.icon}
        {/* <svg
          xmlns="http://www.w3.org/2000/svg"
          width="50"
          height="50"
          viewBox="0 0 24 24"
        >
          <g
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          >
            <path
              strokeDasharray="64"
              strokeDashoffset="64"
              d="M3 12c0 -4.97 4.03 -9 9 -9c4.97 0 9 4.03 9 9c0 4.97 -4.03 9 -9 9c-4.97 0 -9 -4.03 -9 -9Z"
            >
              <animate
                fill="freeze"
                attributeName="stroke-dashoffset"
                dur="0.6s"
                values="64;0"
              />
            </path>
            <path strokeDasharray="14" strokeDashoffset="14" d="M8 12l3 3l5 -5">
              <animate
                fill="freeze"
                attributeName="stroke-dashoffset"
                begin="0.6s"
                dur="0.2s"
                values="14;0"
              />
            </path>
          </g>
        </svg> */}
        <p>{props.message}</p>
      </div>

      <div className={classes.btn_container}>
        <Button className={classes.btn} onClick={props.onCloseModal}>
          Okay
        </Button>
      </div>
    </Card>
  );
};

ModalOverlay.propTypes = {
  title: PropTypes.string,
  message: PropTypes.string,
  // backdrop: PropTypes.func.isRequired,
  onCloseModal: PropTypes.func.isRequired,
  icon: PropTypes.element,
};

const Modal = (props) => {
  return (
    <Fragment>
      {ReactDOM.createPortal(
        <Backdrop onCloseModal={props.onCloseModal} />,
        document.getElementById("backdrop-root")
      )}
      {ReactDOM.createPortal(
        <ModalOverlay
          title={props.title}
          icon={props.icon}
          message={props.message}
          onCloseModal={props.onCloseModal}
        />,
        document.getElementById("overlay-root")
      )}
    </Fragment>
  );
};
Modal.propTypes = {
  title: PropTypes.string,
  message: PropTypes.string,
  // backdrop: PropTypes.func.isRequired,
  onCloseModal: PropTypes.func.isRequired,
  icon: PropTypes.element,
};
export default Modal;
