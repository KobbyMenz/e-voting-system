import { Fragment, useCallback, useState } from "react";
//import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import classes from "../../UI/Modals/AddModal.module.css";
import Card from "../Card/Card";
import Button from "../Button/Button";
// import styles from "../../pages/AdminStaff/AdminStaffContent.module.css";
//import axios from "axios";
import CloseIcon from "../Icons/CloseIcon";
import AddIcon from "../Icons/AddIcon";
import CancelIcon from "../Icons/CancelIcon";
import DateTimeInput from "../DateTimeInput/DateTimeInput";
import dayjs from "dayjs";
//import DateTimeInput from "../DateTimeInput/DateTimeInput";
//import app_api_url from "../../../app_api_url";

const EditElectionModal = (props) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
  });

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
  // ADDING CUSTOMER
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

        props.onEditElection(electionData);
        props.toastModal("success", `Election updated successfully`);

        // Clear form after successful submission
        setFormData({
          title: "",
          description: "",
        });

        props.onCloseModal();
      }
    },
    [props, formData],
  );

  return (
    <Fragment>
      <div className={classes.backdrop} />

      <Card className={`${classes.modal}`}>
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
    </Fragment>
  );
};

EditElectionModal.propTypes = {
  toastModal: PropTypes.func.isRequired,
  onCloseModal: PropTypes.func.isRequired,
  setRefetch: PropTypes.func,
  onEditElection: PropTypes.func.isRequired,
};

export default EditElectionModal;
