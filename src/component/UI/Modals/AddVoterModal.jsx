import { Fragment, useCallback, useRef, useState } from "react";
//import ReactDOM from "react-dom";
import PropTypes from "prop-types";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import classes from "../../UI/Modals/AddModal.module.css";
import Card from "../Card/Card";
import Button from "../Button/Button";
import Toast from "../Notification/Toast";
// import classes from "../../pages/AdminStaff/AdminStaffContent.module.css";
//import axios from "axios";
import CloseIcon from "../Icons/CloseIcon";
import AddIcon from "../Icons/AddIcon";
import CancelIcon from "../Icons/CancelIcon";
import DeleteIcon from "../Icons/DeleteIcon";
import ImageBox from "../ImageBox/ImageBox";
import ToolTip from "../ToolTip/ToolTip";
import useInsertMultiPartsHook from "../../CustomHooks/useInsertMultiPartsHook";
//import app_api_url from "../../../app_api_url";

const AddVoterModal = (props) => {
  const [formData, setFormData] = useState({
    // id: "",
    image: "",
    name: "",
    dob: "",
  });
  const fileInputRef = useRef(null);
  //const [selectedImage, setSelectedImage] = useState();
  const [file, setFile] = useState("");

  const { insertMultiPartsData } = useInsertMultiPartsHook();

  const onFormDataChangeHandler = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => {
      return {
        ...prevFormData,
        [name]: value,
      };
    });
  }, []);

  //function to change profile image
  const profilePictureChangeHandler = useCallback(
    (e) => {
      const file = e.target.files && e.target.files[0];
      setFile(file);

      if (file) {
        //Displaying the image preview before uploading
        const fileReader = new FileReader();
        fileReader.onloadend = () => {
          setFormData((prev) => ({
            ...prev,
            image: fileReader.result,
          }));
        };

        fileReader.readAsDataURL(file);
      } else {
        props.toastModal("error", "No file selected");
      }
    },
    [props],
  );

  /////////////////////////////////////////
  // ADDING VOTER
  /////////////////////////////////////////
  const onAddHandler = useCallback(
    (e) => {
      e.preventDefault();

      if (window.confirm("Are you sure you want to add a new candidate?")) {
        const candidateData = {
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          image: formData.image,
          name: formData.name,
          dob: formData.dob,
        };

        //console.log(candidateData);
        // props.onAddCandidate(candidateData);
        props.toastModal("success", `Added successfully`);

        //sending voter details to be inserted into the database at the backend
        insertMultiPartsData(`insertVoter`, candidateData, props.toastModal);

        props.onCloseModal();
      }
    },
    [props, formData, insertMultiPartsData],
  );

  ///////////////////////////////
  //DELETE PROFILE PICTURE FILE
  /////////////////////////
  const deleteProfilePictureHandler = useCallback(async () => {
    if (file || formData.image) {
      setFormData((prev) => {
        return {
          ...prev,
          image: null,
        };
      });

      setFile(null);
      fileInputRef.current.value = null; //Clearing logo path

      //setSelectedImage(defaultLogo);
      setFormData((prev) => ({
        ...prev,
        image: "",
      }));
    } else {
      Toast("info", "No image to be deleted");
      return;
    }
  }, [file, formData.image]);

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
            <span>Add New Voter</span>

            <div onClick={props.onCloseModal} className={classes.close_btn}>
              <CloseIcon />
            </div>
          </header>
          <p className={classes.heading}>Register a voter for this election.</p>
          <form onSubmit={onAddHandler}>
            <div className={classes.content}>
              <div className="profile_picture_container">
                <div className="profile_picture">
                  {/*==== {Setting profile image to display}======*/}
                  <div className={classes.image_container}>
                    {/* {
                        <img
                          src={
                            formData.profilePicture
                              ? formData.profilePicture
                              : defaultProfilePicture
                          }
                          alt="profilePicture"
                        />
                      } */}

                    <ImageBox
                      width="13rem"
                      height="16rem"
                      src={formData.image}
                    />
                  </div>

                  <div className={classes.form_control}>
                    <label htmlFor="photo">
                      Choose Photo
                      <span className={classes.required_field}>*</span>
                    </label>

                    <div className="image_chooser_container">
                      <input
                        style={{ padding: "1rem" }}
                        id="photo"
                        ref={fileInputRef}
                        name="photo"
                        type="file"
                        onChange={profilePictureChangeHandler}
                        accept="image/*"
                        // required
                      />
                    </div>

                    <ToolTip placement="top" title="Delete image">
                      <Button
                        type="button"
                        className={classes.delete_btn}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                          borderRadius: "0.8rem",
                          Padding: "1rem",
                          // width:"2rem"
                        }}
                        onClick={deleteProfilePictureHandler}
                      >
                        {" "}
                        <DeleteIcon />
                        {/* <span>Delete</span> */}
                      </Button>
                    </ToolTip>
                  </div>
                </div>
              </div>

              <div className={classes.form_control}>
                <label className={classes.label} htmlFor="name">
                  Full Name<span className={classes.required_field}>*</span>
                </label>

                <input
                  name="name"
                  id="name"
                  value={formData.name}
                  type="text"
                  placeholder="Enter voter's full name..."
                  onChange={onFormDataChangeHandler}
                  required
                />
              </div>

              <div className={classes.form_control}>
                <label className={classes.label} htmlFor="dob">
                  Date of Birth
                  <span className={classes.required_field}>*</span>
                </label>

                <input
                  name="dob"
                  id="dob"
                  value={formData.dob}
                  type="date"
                  placeholder="Enter date of birth..."
                  onChange={onFormDataChangeHandler}
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

AddVoterModal.propTypes = {
  toastModal: PropTypes.func.isRequired,
  onCloseModal: PropTypes.func.isRequired,
  // onAddCandidate: PropTypes.func.isRequired,
  setRefetch: PropTypes.func,
};

export default AddVoterModal;
