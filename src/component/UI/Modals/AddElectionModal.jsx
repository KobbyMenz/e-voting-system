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
import AddIcon from "../Icons/AddIcon";
import CancelIcon from "../Icons/CancelIcon";
import dayjs from "dayjs";
import useInsertHook from "../../CustomHooks/useInsertHook";
//import app_api_url from "../../../app_api_url";

const AddElectionModal = (props) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    // dateCreated:"",
    // status:"",
    startDate: "",
    endDate: "",
  });

  const { insertData } = useInsertHook();

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
  // ADDING ELECTION
  /////////////////////////////////////////
  const onAddElectionHandler = useCallback(
    (e) => {
      e.preventDefault();

      if (window.confirm("Are you sure you want to add a new election?")) {
        const electionData = {
          // id: Date.now().toString(),
          title: formData.title,
          description: formData.description,
          dateCreated: dayjs().format("YYYY-MM-DDTHH:mm"),
          status: "Upcoming",
          startDate: formData.startDate,
          endDate: formData.endDate,
        };
        //console.log("electionData: ", electionData);
        props.onAddElection(electionData);
        props.toastModal("success", `Election added successfully`);

        //sending election details to be inserted into the database at the backend
        insertData(`insertElection`, electionData, props.toastModal);

        props.onCloseModal();
      }
    },
    [props, formData, insertData],
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
        onClick={props.onCloseModal}
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
        <Card className={`${classes.modal}`}>
          <header>
            <span>Add New Election</span>

            <div onClick={props.onCloseModal} className={classes.close_btn}>
              <CloseIcon />
            </div>
          </header>

          <p className={classes.heading}>
            Create a new election by filling in the details below.
          </p>

          <form onSubmit={onAddElectionHandler}>
            <div className={classes.content}>
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
                  name="startDate"
                  id="startDate"
                  value={formData.startDate}
                  type="datetime-local"
                  placeholder="Enter election start date..."
                  onChange={onFormDataChangeHandler}
                  min={dayjs().format("YYYY-MM-DDTHH:mm")}
                  max={dayjs(formData.endDate).format("YYYY-MM-DDTHH:mm")}
                  required
                />
              </div>

              <div className={classes.form_control}>
                <label className={classes.label} htmlFor="endDate">
                  End Date<span className={classes.required_field}>*</span>
                </label>

                <input
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
                <AddIcon />

                <span>Add</span>
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

AddElectionModal.propTypes = {
  toastModal: PropTypes.func.isRequired,
  onCloseModal: PropTypes.func.isRequired,
  setRefetch: PropTypes.func,
  onAddElection: PropTypes.func.isRequired,
};

export default AddElectionModal;
