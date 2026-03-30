import { useState, useRef, useCallback } from "react";
import PropTypes from "prop-types";
import classes from "../../UI/Modals/AddModal.module.css";
import Card from "./../../UI/Card/Card";
import Button from "../../UI/Button/Button";
//import classes from "../AdminStaff/AdminStaffContent.module.css";
//import axios from "axios";
//import defaultProfilePicture from "../../../assets/images/profilePicture.png";
//import moment from "moment";
//import app_api_url from "../../../app_api_url";
import CloseIcon from "../../UI/Icons/CloseIcon";
import AddIcon from "../../UI/Icons/AddIcon";
import CancelIcon from "../../UI/Icons/CancelIcon";
import ImageBox from "../../UI/ImageBox/ImageBox";
import DeleteIcon from "../../UI/Icons/DeleteIcon";
import ToolTip from "../../UI/ToolTip/ToolTip";
import Toast from "../../UI/Notification/Toast";
import PasswordInput from "../../UI/PasswordInput/PasswordInput";
//import dayjs from "dayjs";
import useInsertMultiPartsHook from "../../CustomHooks/useInsertMultiPartsHook";

const AddUserModal = (props) => {
  const [file, setFile] = useState("");

  const [formData, setFormData] = useState({
    // userId: "",
    fullName: "",
    email: "",
    phoneNumber: "",
    // loginType: "",
    pass: "",
    confirmPass: "",
    profilePicture: "",
    // userStatus: "Enabled",
  });

  const allUsers = props.allUsers;

  const fileInputRef = useRef(null);
  const { insertMultiPartsData } = useInsertMultiPartsHook();

  const onFormDataChangeHandler = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => {
      return {
        ...prevFormData,
        [name]: value,
      };
    });
  };

  //function to change profile picture
  const profilePictureChangeHandler = (e) => {
    const file = e.target.files && e.target.files[0];
    setFile(file);

    if (file) {
      //Displaying the image preview before uploading
      const fileReader = new FileReader();
      fileReader.onloadend = () => {
        setFormData((prev) => ({ ...prev, profilePicture: fileReader.result }));
      };

      fileReader.readAsDataURL(file);
    } else {
      props.toastModal("error", "No file selected");
    }
  };

  ////////////////////////////////////////////////////////////////////
  //ADDING USERS TO THE DATABASE
  //////////////////////////////////////////////////////////////////////
  const addHandler = useCallback(
    async (e) => {
      e.preventDefault();

      //Checking for empty fields
      if (
        // +formData.userId.length === 0 ||
        +formData.fullName.length === 0 ||
        // +formData.userName.length === 0 ||
        +formData.email.length === 0 ||
        +formData.phoneNumber.length === 0 ||
        // +formData.loginType.length === 0 ||
        +formData.pass.length === 0
        // formData.pass === ""
      ) {
        props.toastModal(
          "error",
          "Please all fields are required but leave photo field blank if you do not want to add!",
        );
        return;
      }

      //Checking if userName already exist
      // if (allUsers.find((user) => user.userName === formData.userName)) {
      //   props.toastModal(
      //     "error",
      //     "An account with this userName already exist.",
      //   );
      //   return;
      // }

      //Checking if user email already exist
      if (allUsers.find((user) => user.email === formData.email)) {
        props.toastModal("error", "An account with this email already exist.");
        return;
      }

      //Checking for Phone number length
      if (
        +formData.phoneNumber.length > 10 ||
        +formData.phoneNumber.length < 10
      ) {
        props.toastModal("error", "Phone number must be 10 digits long");

        return;
      }

      //Checking for password confirmation
      if (formData.pass !== formData.confirmPass) {
        props.toastModal("error", "Passwords do not match!");

        return;
      }

      //Checking for password length
      if (+formData.pass.length < 8) {
        props.toastModal(
          "error",
          "Password must be at least 8 characters long",
        );
        return;
      }

      //Confirmation to add new user
      if (window.confirm("Are you sure you want to add new user?")) {
        const profileFormData = new FormData();
        //key must match what multer expects
        profileFormData.append("fullName", formData.fullName);
        profileFormData.append("email", formData.email);
        profileFormData.append("phone", formData.phoneNumber);
        profileFormData.append("password", formData.pass);
        profileFormData.append("photo", file);
        profileFormData.append("status", formData.userStatus);
        // profileFormData.append("role", formData.loginType);
        // profileFormData.append(
        //   "dateCreated",
        //   dayjs().format("YYYY-MM-DDTHH:mm"),
        // );

        //sending user details to be inserted into the database at the backend
        insertMultiPartsData(
          `addUser`,
          profileFormData,
          props.toastModal,
          props.setRefetch,
        );

        props.onCloseModal(); //Closing modal after insertion
      }
    },
    [file, formData, props, allUsers, insertMultiPartsData],
  );
  ////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////

  ///////////////////////////////
  //DELETE PROFILE PICTURE FILE
  /////////////////////////
  const deleteProfilePictureHandler = useCallback(async () => {
    if (file || formData.profilePicture) {
      setFormData((prev) => {
        return {
          ...prev,
          profilePicture: null,
        };
      });

      setFile(null);
      fileInputRef.current.value = null; //Clearing logo path

      //setSelectedImage(defaultLogo);
      setFormData((prev) => ({
        ...prev,
        profilePicture: "",
      }));
    } else {
      Toast("info", "No image to be deleted");
      return;
    }
  }, [file, formData.profilePicture]);

  return (
    <>
      <div className={classes.backdrop} />

      <Card className={`${classes.addUserModal}`}>
        <header>
          <span>Add New User</span>

          <div onClick={props.onCloseModal} className={classes.close_btn}>
            <CloseIcon />
          </div>
        </header>

        <form onSubmit={addHandler}>
          <div className={classes.content}>
            <div
              className={`${classes.profile_form}  ${classes.form_container_left_right}`}
            >
              <div className={classes.form_left}>
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
                        src={formData.profilePicture}
                      />
                    </div>

                    <div className={classes.form_control}>
                      <label htmlFor="photo">Choose Photo</label>

                      <div className="image_chooser_container">
                        <input
                          style={{ padding: "1rem" }}
                          id="photo"
                          ref={fileInputRef}
                          name="photo"
                          type="file"
                          onChange={profilePictureChangeHandler}
                          accept="image/*"
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
                  <label htmlFor="fullName">
                    Full Name<span className={classes.required_field}>*</span>
                  </label>

                  <input
                    name="fullName"
                    id="fullName"
                    value={formData.fullName}
                    type="text"
                    placeholder="eg. Kobby Mensah Junior"
                    onChange={onFormDataChangeHandler}
                    required
                  />
                </div>
              </div>

              <div className={classes.form_right}>
                <div className={classes.form_control}>
                  <label htmlFor="email">
                    Email<span className={classes.required_field}>*</span>
                  </label>

                  <input
                    name="email"
                    id="email"
                    type="email"
                    onChange={onFormDataChangeHandler}
                    value={formData.email}
                    placeholder="eg. kobbymenz@gmail.com"
                    required
                  />
                </div>

                <div className={classes.form_control}>
                  <label htmlFor="phoneNumber">
                    Phone<span className={classes.required_field}>*</span>
                  </label>

                  <input
                    name="phoneNumber"
                    id="phoneNumber"
                    type="tel"
                    onChange={onFormDataChangeHandler}
                    value={formData.phoneNumber}
                    placeholder="eg. 0546163240"
                    required
                  />
                </div>

                <div className={classes.form_control}>
                  <label htmlFor="pass">
                    Password<span className={classes.required_field}>*</span>
                  </label>

                  <PasswordInput
                    onChange={onFormDataChangeHandler}
                    name="pass"
                    value={formData.pass ? formData.pass : ""}
                    id="pass"
                    placeholder="Enter password"
                    required
                  />
                </div>

                <div className={classes.form_control}>
                  <label htmlFor="confirmPass">
                    Confirm Password
                    <span className={classes.required_field}>*</span>
                  </label>

                  <PasswordInput
                    onChange={onFormDataChangeHandler}
                    value={formData.confirmPass ? formData.confirmPass : ""}
                    name="confirmPass"
                    id="confirmPass"
                    placeholder="Confirm password"
                    required
                  />
                </div>
              </div>
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
    </>
  );
};

AddUserModal.propTypes = {
  title: PropTypes.string,
  message: PropTypes.string,
  toastModal: PropTypes.func,
  onCloseModal: PropTypes.func,
  setRefetch: PropTypes.func,
  allUsers: PropTypes.array,
};

export default AddUserModal;
