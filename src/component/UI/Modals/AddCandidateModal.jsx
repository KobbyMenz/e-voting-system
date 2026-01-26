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
//import app_api_url from "../../../app_api_url";

const AddCandidateModal = (props) => {
  const [formData, setFormData] = useState({
    name: "",
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
  const onAddCustomerHandler = useCallback(
    (e) => {
      e.preventDefault();

      if (window.confirm("Are you sure you want to add a new candidate?")) {
        const candidateData = {
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name: formData.name,
        };

        props.onAddCandidate(candidateData);
        props.toastModal("success", `Candidate added successfully`);

        // Clear form after successful submission
        setFormData({
          name: "",
        });

        props.onCloseModal();
      }
    },
    [props, formData.name],
  );

  return (
    <Fragment>
      <div className={classes.backdrop} />

      <Card className={`${classes.modal}`}>
        <header>
          <span>Add New Candidate</span>

          <div onClick={props.onCloseModal} className={classes.close_btn}>
            <CloseIcon />
          </div>
        </header>
        <form onSubmit={onAddCustomerHandler}>
          <div className={classes.content}>
            <div className={classes.form_control}>
              <label className={classes.label} htmlFor="name">
                Candidate Name<span className={classes.required_field}>*</span>
              </label>

              <input
                name="name"
                id="name"
                value={formData.name}
                type="text"
                placeholder="Enter candidate name..."
                onChange={onFormDataChangeHandler}
                required
              />
            </div>

            {/* <div className={classes.form_control}>
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
            </div> */}
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

AddCandidateModal.propTypes = {
  toastModal: PropTypes.func.isRequired,
  onCloseModal: PropTypes.func.isRequired,
  onAddCandidate: PropTypes.func.isRequired,
  setRefetch: PropTypes.func,
};

export default AddCandidateModal;
