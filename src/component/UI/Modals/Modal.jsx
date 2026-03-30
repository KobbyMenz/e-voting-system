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
  onCloseModal: PropTypes.func.isRequired,
};

const ModalOverlay = (props) => {
  return (
    <>
      <Card className={classes.modal}>
        <header>{props.title}</header>
        <div className={classes.content}>
          {props.icon}
          <p>{props.message}</p>
        </div>

        <div className={classes.btn_container}>
          <Button className={classes.btn} onClick={props.onCloseModal}>
            Okay
          </Button>
        </div>
      </Card>
    </>
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
      <AnimatePresence>
        {ReactDOM.createPortal(
          <Backdrop onCloseModal={props.onCloseModal} />,
          document.getElementById("backdrop-root"),
        )}
        {ReactDOM.createPortal(
          <ModalOverlay
            title={props.title}
            icon={props.icon}
            message={props.message}
            onCloseModal={props.onCloseModal}
          />,
          document.getElementById("overlay-root"),
        )}
      </AnimatePresence>
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
