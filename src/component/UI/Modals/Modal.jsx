import { Fragment } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import classes from "../../UI/Modals/Modal.module.css";
import Card from "../Card/Card";
import Button from "../Button/Button";

const Backdrop = (props) => {
  return (
    <motion.div
      className={classes.backdrop}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={props.onCloseModal}
    />
  );
};
Backdrop.propTypes = {
  onCloseModal: PropTypes.func.isRequired,
};

const ModalOverlay = (props) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 50 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.75, y: 50 }}
      transition={{
        opacity: { duration: 0.2 },
        scale: {
          type: "spring",
          stiffness: 280,
          damping: 16,
          mass: 1,
          delay: 0,
        },
        y: { type: "spring", stiffness: 280, damping: 20, delay: 0 },
      }}
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 1001,
      }}
    >
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
    </motion.div>
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
