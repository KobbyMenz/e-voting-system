import { Fragment } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import classes from "../../UI/Modals/Modal.module.css";
import Card from "../Card/Card";
import Button from "../Button/Button";
import QuestionIcon from "../../UI/Icons/QuestionIcon";

const Backdrop = ({ onCloseModal }) => {
  return (
    <Fragment>
      <div className={classes.backdrop} onClick={onCloseModal} />
    </Fragment>
  );
};

const ModalOverlay = ({ onConfirm, onCloseModal }) => {
  return (
    <Fragment>
      <Card className={classes.modal}>
        <header>Confirmation Message</header>
        <div className={classes.content}>
          <QuestionIcon />
          <p>Are you sure you want to logout?</p>
        </div>

        <div className={classes.btn_container}>
          <Button className={classes.btn} onClick={onConfirm}>
            Yes
          </Button>

          <Button id={classes.btn__no} onClick={onCloseModal}>
            No
          </Button>
        </div>
      </Card>
    </Fragment>
  );
};

const QuestionModal = (props) => {
  return (
    <Fragment>
      {ReactDOM.createPortal(
        <Backdrop onCloseModal={props.onCloseModal} />,
        document.getElementById("backdrop-root"),
      )}
      {ReactDOM.createPortal(
        <ModalOverlay
          onConfirm={props.onConfirm}
          onCloseModal={props.onCloseModal}
        />,
        document.getElementById("overlay-root"),
      )}
    </Fragment>
  );
};

QuestionModal.propTypes = {
  title: PropTypes.string,
  message: PropTypes.string,
  // backdrop: PropTypes.func.isRequired,
  onCloseModal: PropTypes.func,
  onConfirm: PropTypes.func,
};

export default QuestionModal;
