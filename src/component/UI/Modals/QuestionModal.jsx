import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import classes from "../../UI/Modals/Modal.module.css";
import Card from "../Card/Card";
import Button from "../Button/Button";
import QuestionIcon from "../../UI/Icons/QuestionIcon";

const Backdrop = ({ onCloseModal }) => {
  return (
    <motion.div
      className={classes.backdrop}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onCloseModal}
    />
  );
};

const ModalOverlay = ({ onConfirm, onCloseModal }) => {
  return (
    <motion.div>
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
    </motion.div>
  );
};

const QuestionModal = (props) => {
  const backdropRoot = document.getElementById("backdrop-root");
  const overlayRoot = document.getElementById("overlay-root");

  if (!backdropRoot || !overlayRoot) return null;

  return (
    <>
      {ReactDOM.createPortal(
        <AnimatePresence>
          <Backdrop onCloseModal={props.onCloseModal} key="backdrop" />
        </AnimatePresence>,
        backdropRoot,
      )}
      {ReactDOM.createPortal(
        <AnimatePresence>
          <ModalOverlay
            onConfirm={props.onConfirm}
            onCloseModal={props.onCloseModal}
            key="overlay"
          />
        </AnimatePresence>,
        overlayRoot,
      )}
    </>
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
