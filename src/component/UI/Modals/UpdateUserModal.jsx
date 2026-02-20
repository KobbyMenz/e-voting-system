import { Fragment, useState, useRef, useCallback } from "react";
//import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import classes from "../../UI/Modals/AddModal.module.css";
import Card from "./../../UI/Card/Card";
import Button from "../../UI/Button/Button";
//import styles from "../AdminStaff/AdminStaffContent.module.css";
import axios from "axios";
import app_api_url from "../../../app_api_url";
import CloseIcon from "../../UI/Icons/CloseIcon";
import AddIcon from "../../UI/Icons/AddIcon";
import CancelIcon from "../../UI/Icons/CancelIcon";
import ImageBox from "../../UI/ImageBox/ImageBox";
import ToolTip from "../../UI/ToolTip/ToolTip";
import DeleteIcon from "../../UI/Icons/DeleteIcon";
import Toast from "../../UI/Notification/Toast";
import PasswordInput from "../../UI/PasswordInput/PasswordInput";

const UpdateUserModal = (props) => {
  const [file, setFile] = useState("");

  const [formData, setFormData] = useState({
    userId: props.userData.id,
    profilePicture: props.userData.image,
    fullName: props.userData.name,
    userName: props.userData.userName,
    email: props.userData.email,
    phoneNumber: props.userData.contact,
    loginType: props.userData.role,
    // userId: "",
    // fullName: "",
    // userName: "",
    // email: "",
    // phoneNumber: "",
    // loginType: "",
    pass: "",
    confirmPass: "",
    // profilePicture: "",
    userStatus: "Enabled",
  });

  const fileInputRef = useRef(null);

  const onFormDataChangeHandler = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => {
      return {
        ...prevFormData,
        [name]:
          name === "userName"
            ? value.replace(/[\s\-+=?,><.()/|\\[\]{}]/g, "")
            : value,
      };
    });
  };

  //function to change profile image
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

  // useEffect(() => {
  //   /*receiving from AdminStaff component and setting User data
  //    into useState after clicking on edit button*/
  //   setFormData({
  //     userId: props.userData.id,
  //     profilePicture: props.userData.image,
  //     fullName: props.userData.name,
  //     userName: props.userData.userName,
  //     email: props.userData.email,
  //     phoneNumber: props.userData.contact,
  //     loginType: props.userData.role,
  //   });
  // }, [props.userData]);

  ////////////////////////////////////////////////////
  //  UPDATE USER DATA
  ///////////////////////////////////////////////////
  const updateHandler = useCallback(
    async (e) => {
      e.preventDefault();

      //Checking for empty fields
      if (
        +formData.userId.length === 0 ||
        +formData.fullName.length === 0 ||
        +formData.userName.length === 0 ||
        +formData.email.length === 0 ||
        +formData.phoneNumber.length === 0 ||
        +formData.loginType.length === 0
      ) {
        props.toastModal(
          "error",
          "All fields are required but leave password and photo fields blank if you do not want to change!",
        );
      } else {
        //check if password field is empty
        if (
          (formData.pass === undefined ||
            formData.pass === "" ||
            formData.pass === null ||
            +formData.pass.length === 0) &&
          (formData.confirmPass === undefined ||
            formData.confirmPass === "" ||
            formData.confirmPass === null ||
            +formData.confirmPass.length === 0)
        ) {
          //Checking for Phone number length
          if (
            +formData.phoneNumber.length > 10 ||
            +formData.phoneNumber.length < 10
          ) {
            props.toastModal("error", "Phone number must be 10 digits long");
            return;
          }

          if (window.confirm("Are you sure you want to update records?")) {
            const profileFormData = new FormData();
            profileFormData.append("profilePicture", file); //key must match what multer expects
            profileFormData.append("fullName", formData.fullName);
            profileFormData.append("userName", formData.userName);
            profileFormData.append("email", formData.email);
            profileFormData.append("phoneNumber", formData.phoneNumber);
            profileFormData.append("loginType", formData.loginType);

            try {
              const response = await axios.put(
                `${app_api_url}/updateUser/${+formData.userId}`,
                profileFormData,
                {
                  headers: {
                    "Content-Type": "multipart/form-data",
                  },
                },
              );

              props.setRefetch(); //Refreshing table after update

              props.toastModal("success", response.data.message);

              props.onCloseModal(); //Close modal after update
            } catch (err) {
              if (
                err.response &&
                err.response.data &&
                err.response.data.error
              ) {
                props.toastModal("error", err.response.data.error);
              } else {
                props.toastModal("error", `Error updating records ${err}`);
              }
            }
          }
        } else {
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

          //Checking for Phone number length
          if (
            +formData.phoneNumber.length > 10 ||
            +formData.phoneNumber.length < 10
          ) {
            props.toastModal("error", "Phone number must be 10 digits long");
            return;
          }

          //3001/api/updateUserAndPass
          if (window.confirm("Are you sure you want to update records?")) {
            const userId = formData.userId;
            const profileFormData = new FormData();
            profileFormData.append("profilePicture", file); //key must match what multer expects
            profileFormData.append("fullName", formData.fullName);
            profileFormData.append("userName", formData.userName);
            profileFormData.append("phoneNumber", formData.phoneNumber);
            profileFormData.append("loginType", formData.loginType);
            profileFormData.append("pass", formData.pass);
            profileFormData.append("email", formData.email);

            try {
              const response = await axios.put(
                `${app_api_url}/updateUserAndPass/${+userId}`,
                profileFormData,
                {
                  headers: {
                    "Content-Type": "multipart/form-data",
                  },
                },
              );

              props.setRefetch(); //Refreshing table after update

              props.toastModal("success", response.data.message);

              props.onCloseModal(); //Close modal after update
            } catch (err) {
              if (
                err.response &&
                err.response.data &&
                err.response.data.error
              ) {
                props.toastModal("error", err.response.data.error);
              } else {
                props.toastModal("error", `Error updating records ${err}`);
              }
            }
          }
        }
      }
    },
    [
      file,
      formData.confirmPass,
      formData.email,
      formData.fullName,
      formData.loginType,
      formData.phoneNumber,
      formData.pass,
      formData.userName,
      formData.userId,
      props,
    ],
  );
  ////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////

  //function to clear input fields
  // const clearForm = () => {
  //   setFormData({
  //     userId: "",
  //     fullName: "",
  //     userName: "",
  //     email: "",
  //     phoneNumber: "",
  //     loginType: "",
  //     pass: "",
  //     confirmPass: "",
  //   });

  //   // setSelectedImage(null);
  //   setFile(null);
  //   fileInputRef.current.value = null;
  // };

  ///////////////////////////////
  //DELETE PROFILE PICTURE FILE
  //////////////////////////////
  const deleteProfilePictureHandler = useCallback(async () => {
    const hasFileSelected = !!(
      fileInputRef &&
      fileInputRef.current &&
      fileInputRef.current.value
    );
    const hasProfilePicture =
      formData.profilePicture !== null && formData.profilePicture !== "";

    // If neither an existing image nor a selected file exist, nothing to delete.
    if (!hasFileSelected && !hasProfilePicture) {
      Toast("info", "No image to delete");
      return;
    }
    // If both an existing product image and a new file are present, do nothing and instruct the user.
    if (hasFileSelected && hasProfilePicture) {
      fileInputRef.current.value = null;
      //setSelectedImage(formData.productImage);
      setFormData((prev) => ({
        ...prev,
        profilePicture: props.userData.image,
      }));
      Toast("info", "Selected file is removed.");
      return;
    }

    // If there is a selected file but no existing image, just clear the selection locally.
    if (hasFileSelected && !hasProfilePicture) {
      setFile(null);
      if (fileInputRef && fileInputRef.current)
        fileInputRef.current.value = null;
      //setSelectedImage(defaultLogo);
      setFormData((prev) => ({
        ...prev,
        profilePicture: "",
      }));
      Toast("info", "Selected file cleared");
      return;
    }

    // At this point: hasProductImage === true && hasFileSelected === false
    if (hasProfilePicture) {
      if (!window.confirm("Are you sure you want to delete image?")) return;

      setFormData((prev) => ({ ...prev, profilePicture: null }));
      setFile(null);
      if (fileInputRef && fileInputRef.current)
        fileInputRef.current.value = null;

      // const updateFormData = new FormData();
      // Append an empty value so the backend knows to remove the image.
      // updateFormData.append("profilePicture", "");
      // const userId = formData.userId;

      const profileFormData = new FormData();
      profileFormData.append("userId", formData.userId);
      profileFormData.append("profilePicture", file);
      try {
        //Deleting profile picture from the backend
        const response = await axios.put(
          `${app_api_url}/deleteProfile`,
          profileFormData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          },
        );

        //setSelectedImage(defaultLogo);
        setFormData((prev) => ({
          ...prev,
          profilePicture: "",
        }));
        props.setRefetch();
        Toast("success", response.data.message);
      } catch (err) {
        Toast("error", `Failed to delete ${err}`);
      }
    }
  }, [formData.userId, props, formData.profilePicture, file]);

  return (
    <Fragment>
      <div className={classes.backdrop} onClick={props.onCloseModal} />

      <Card className={`${classes.addUserModal}`}>
        <header>
          <span>Update User Details</span>

          <div onClick={props.onCloseModal} className={classes.close_btn}>
            <CloseIcon />
          </div>
        </header>

        <form onSubmit={updateHandler}>
          <div className={classes.content}>
            <div
              className={`${classes.profile_form}  ${classes.form_container_left_right}`}
            >
              <div className={classes.form_left}>
                <div className="profile_picture_container">
                  <div className="profile_picture">
                    {/* {Setting profile image to display} */}
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
                            // Padding: "0.5rem",
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

                {/* <div className={classes.form_control}>
                  <label htmlFor="userName">
                    User Name<span className={classes.required_field}>*</span>
                  </label>

                  <input
                    name="userName"
                    id="userName"
                    type="text"
                    placeholder="eg. Kobby ( No spaces,- + = ? > < allowed )"
                    onChange={onFormDataChangeHandler}
                    value={formData.userName}
                    required
                  />
                </div> */}
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
                  <label htmlFor="phone">
                    Phone<span className={classes.required_field}>*</span>
                  </label>

                  <input
                    name="phone"
                    id="phone"
                    type="tel"
                    onChange={onFormDataChangeHandler}
                    value={formData.phoneNumber}
                    placeholder="eg. 0546163240"
                    required
                  />
                </div>

                <div className={classes.form_control}>
                  <label htmlFor="password">Password</label>

                  <PasswordInput
                    onChange={onFormDataChangeHandler}
                    name="password"
                    value={formData.pass ? formData.pass : ""}
                    id="password"
                    placeholder="Enter password"
                  />
                </div>

                <div className={classes.form_control}>
                  <label htmlFor="confirmPass">Confirm Password</label>

                  <PasswordInput
                    onChange={onFormDataChangeHandler}
                    name="confirmPass"
                    value={formData.confirmPass ? formData.confirmPass : ""}
                    id="confirmPass"
                    placeholder="Confirm password"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className={classes.btn_container}>
            <Button className={classes.btn}>
              <AddIcon />
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
    </Fragment>
  );
};

UpdateUserModal.propTypes = {
  title: PropTypes.string,
  message: PropTypes.string,
  toastModal: PropTypes.func,
  userData: PropTypes.object.isRequired,
  onCloseModal: PropTypes.func,
  setRefetch: PropTypes.func,
};

export default UpdateUserModal;
