import { Fragment, useCallback, useState } from "react";
//import ReactDOM from "react-dom";
import PropTypes from "prop-types";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import classes from "../../UI/Modals/AddModal.module.css";
import Card from "../Card/Card";
import Button from "../Button/Button";
// import styles from "../../pages/AdminStaff/AdminStaffContent.module.css";
//import axios from "axios";
import CloseIcon from "../Icons/CloseIcon";
import SaveIcon from "../Icons/SaveIcon";
import CancelIcon from "../Icons/CancelIcon";
import DateTimeInput from "../DateTimeInput/DateTimeInput";
import dayjs from "dayjs";
import useUpdateHook from "../../CustomHooks/useUpdateHook";
//import DateTimeInput from "../DateTimeInput/DateTimeInput";
//import app_api_url from "../../../app_api_url";

const EditElectionModal = (props) => {
  const [formData, setFormData] = useState({
    electionId: props.submitElectionData.electionId,
    title: props.submitElectionData.title,
    description: props.submitElectionData.description,
    startDate: props.submitElectionData.startDate,
    endDate: props.submitElectionData.endDate,
  });

  const { updateData } = useUpdateHook();

  const onFormDataChangeHandler = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => {
      return {
        ...prevFormData,
        [name]:
          name === "phone"
            ? value.replace(
                /[\s-+=?,></.(){}_qwertyuiopasdfghjkl;zxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM]/g,
                "",
              )
            : value,
      };
    });
  }, []);

  /////////////////////////////////////////
  // UPDATING ELECTION
  /////////////////////////////////////////
  const onEditElectionHandler = useCallback(
    (e) => {
      e.preventDefault();

      if (window.confirm("Are you sure you want to update election?")) {
        const electionData = {
          // id: Date.now().toString(),
          title: formData.title,
          // dateCreated: new Date().toLocaleDateString(),
          // status: "Active",
          description: formData.description,
          startDate: formData.startDate,
          endDate: formData.endDate,
        };

        // props.onEditElection(electionData);
        props.toastModal("success", `Election updated successfully`);

        //sending election details to be updated into the database at the backend
        updateData(
          `updateElection/${formData.electionId}`,
          electionData,
          props.toastModal,
        );

        props.onCloseModal();
      }
    },
    [props, formData, updateData],
  );

  return (
    <AnimatePresence>
      {/* Backdrop with fade animation */}
      <motion.div
        className={classes.backdrop}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        // onClick={props.onCloseModal}
      />

      {/* Modal with bounce forward and settle animation */}
      <motion.div
        initial={{
          opacity: 0,
          scale: 0.8,
          y: 50,
        }}
        animate={{
          opacity: 1,
          scale: 1,
          y: 0,
        }}
        exit={{
          opacity: 0,
          scale: 0.75,
          y: 50,
        }}
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
        {" "}
        <Card className={`${classes.modal}`}>
          {" "}
          <header>
            <span>Update Election Details</span>

            <div onClick={props.onCloseModal} className={classes.close_btn}>
              <CloseIcon />
            </div>
          </header>
          <form onSubmit={onEditElectionHandler}>
            <div className={classes.content}>
              <p className={classes.heading}>
                Update election by filling in the details below.
              </p>

              <div className={classes.form_control}>
                <label className={classes.label} htmlFor="title">
                  Election Title
                  <span className={classes.required_field}>*</span>
                </label>

                <input
                  name="title"
                  id="title"
                  value={formData.title}
                  type="text"
                  placeholder="eg. 2026 SRC President"
                  onChange={onFormDataChangeHandler}
                  required
                />
              </div>

              <div className={classes.form_control}>
                <label className={classes.label} htmlFor="description">
                  Description<span className={classes.required_field}>*</span>
                </label>

                <input
                  name="description"
                  id="description"
                  value={formData.description}
                  type="text"
                  placeholder="Brief details about this election..."
                  onChange={onFormDataChangeHandler}
                  required
                />
              </div>

              <div className={classes.form_control}>
                <label className={classes.label} htmlFor="startDate">
                  Start Date<span className={classes.required_field}>*</span>
                </label>

                <input
                  className={`${classes.date_input}}`}
                  name="startDate"
                  id="startDate"
                  value={formData.startDate}
                  type="datetime-local"
                  placeholder="Enter election start date..."
                  onChange={onFormDataChangeHandler}
                  min={dayjs().format("YYYY-MM-DDTHH:mm")}
                  // max={dayjs(formData.endDate).format("YYYY-MM-DDTHH:mm")}
                  required
                />
              </div>

              <div className={classes.form_control}>
                <label className={classes.label} htmlFor="endDate">
                  End Date<span className={classes.required_field}>*</span>
                </label>

                <input
                  className={classes.date_input}
                  name="endDate"
                  id="endDate"
                  value={formData.endDate}
                  type="datetime-local"
                  placeholder="Enter election end date..."
                  onChange={onFormDataChangeHandler}
                  min={dayjs(formData.startDate).format("YYYY-MM-DDTHH:mm")}
                  required
                />
              </div>
            </div>

            <div className={classes.btn_container}>
              <Button className={classes.btn}>
                <SaveIcon />

                <span>Save</span>
              </Button>

              <Button
                type="button"
                className={classes.btn}
                id={classes.btn__no}
                onClick={props.onCloseModal}
              >
                <CancelIcon />

                <span>Cancel</span>
              </Button>
            </div>
          </form>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
};

EditElectionModal.propTypes = {
  toastModal: PropTypes.func.isRequired,
  onCloseModal: PropTypes.func.isRequired,
  setRefetch: PropTypes.func,
  onEditElection: PropTypes.func.isRequired,
  submitElectionData: PropTypes.object,
};

export default EditElectionModal;
