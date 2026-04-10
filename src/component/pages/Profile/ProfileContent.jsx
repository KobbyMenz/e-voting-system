import { Fragment, useState, useEffect, useCallback } from "react";
//import "./ProfileContent.css";
import classes from "../Profile/ProfileContent.module.css";
import Card from "../../UI/Card/Card";
import Button from "../../UI/Button/Button";
//import defaultProfilePicture from "../../../../src/assets/images/profilePicture.png";
import PropTypes from "prop-types";
import Modal from "../../UI/Modals/Modal";
//import axios from "axios";
//import Loader from "../../UI/Loader";
//import ErrorIcon from "../../UI/Icons/ErrorIcon";
import Footer from "../../Footer/Footer";
import Toast from "../../UI/Notification/Toast";
import ProfileSkeleton from "../../UI/Skeleton/ProfileSkeleton";
// import UploadIcon from "../../UI/Icons/UploadIcon";
// import DeleteIcon from "../../UI/Icons/DeleteIcon";
import SaveIcon from "../../UI/Icons/SaveIcon";
import ImageBox from "../../UI/ImageBox/ImageBox";
import PasswordInput from "../../UI/PasswordInput/PasswordInput";
//import app_api_url from "../../../app_api_url";
import { authLocalStorage } from "../../Utils/authLocalStorage";
import useUpdateHook from "../../CustomHooks/useUpdateHook";

const ProfileContent = () => {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  // const [file, setFile] = useState(null);
  // //const [selectedImage, setSelectedImage] = useState(null);
  // const fileInput = useRef(null);
  // const { onSubmitProfilePicture } = props;
  const [formData, setFormData] = useState({
    id: authLocalStorage().userId,
    name: authLocalStorage().fullName,
    password: "",
    confirmPassword: "",
  });

  const { updateData } = useUpdateHook();

  //function to handle form data
  const formDataHandler = useCallback((e) => {
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
  }, []);

  //========Getting and setting user's info from local storage to input fields============
  useEffect(() => {
    const storedUser = authLocalStorage();
    if (storedUser) {
      setLoading(false);
      return;
    }
  }, []);

  //////////////////////////////
  // Updating password
  /////////////////////////////
  const submitFormaHandler = useCallback(
    async (e) => {
      e.preventDefault();

      if (formData.password !== formData.confirmPassword) {
        Toast("error", "Password mismatched!");
        return;
      }

      if (+formData.password.length < 8 && +formData.password.length !== 0) {
        Toast("error", "Password length must be at least 8 characters long");
        return;
      }

      //confirmation to update
      if (window.confirm("Are you sure you want to save changes?")) {
        const userId = formData.id;

        updateData(
          `updateVoterPassword/${+userId}`,
          {
            password: formData.password,
          },
          Toast,
        );

        // Clear password fields after update
        setFormData((prevFormData) => {
          return {
            ...prevFormData,
            password: "",
            confirmPassword: "",
          };
        });
      }
    },
    [updateData, formData.confirmPassword, formData.id, formData.password],
  );

  ////////////////////////////////
  const closeShowModalHandler = useCallback(() => {
    setShowModal((prev) => !prev);
  }, []);

  return (
    <Fragment>
      {/* {loading && <Loader />} */}

      {showModal && (
        <Modal
          title={showModal.title}
          icon={showModal.icon}
          message={showModal.message}
          onCloseModal={closeShowModalHandler}
        />
      )}

      <div className={classes.content__container}>
        <Card className={classes.card__wrapper}>
          {loading ? (
            <ProfileSkeleton />
          ) : (
            <form onSubmit={submitFormaHandler}>
              <div className={classes.profile_container}>
                <div className={classes.profile_form}>
                  <div className={classes.form_control}>
                    <label htmlFor="id">ID Number:</label>

                    <input
                      onChange={formDataHandler}
                      value={formData.id}
                      name="id"
                      id="id"
                      type="number"
                      // disabled
                      readOnly
                      placeholder=""
                      required
                    />
                  </div>

                  <div className={classes.form_control}>
                    <label htmlFor="name">Full Name:</label>

                    <input
                      onChange={formDataHandler}
                      value={formData.name}
                      name="name"
                      id="name"
                      type="text"
                      placeholder=""
                      // disabled
                      readOnly
                      required
                    />
                  </div>

                  {/* <div className={classes.form_control}>
                    <label htmlFor="userName"> UserName:</label>

                    <input
                      onChange={formDataHandler}
                      value={formData.userName}
                      name="userName"
                      id="userName"
                      type="text"
                      placeholder="Enter user name ( No spaces,- + = ? > < allowed )"
                      required
                      
                    />
                  </div>

                  <div className={classes.form_control}>
                    <label htmlFor="email">Email:</label>

                    <input
                      onChange={formDataHandler}
                      value={formData.email}
                      name="email"
                      id="email"
                      type="email"
                      placeholder=""
                      readOnly
                      required
                    />
                  </div>

                  <div className={classes.form_control}>
                    <label htmlFor="phone">Phone:</label>

                    <input
                      onChange={formDataHandler}
                      value={formData.phone}
                      name="phone"
                      id="phone"
                      type="tel"
                      placeholder=""
                      
                      readOnly
                      required
                    />
                  </div> */}
                </div>

                <div className={classes.profile_picture_container}>
                  <div className={classes.profile_picture}>
                    {/* <Avatar
                      alt="avatar"
                      src={selectedImage}
                      sx={avatarSx}
                    /> */}

                    <ImageBox
                      width="13rem"
                      height="16rem"
                      src={authLocalStorage().photo}
                    />

                    {/* <div className={classes.image_chooser_container}> */}
                    {/* <div className={classes.form_control}>
                        <label htmlFor="photo">Choose photo:</label>
                        <input
                          id="photo"
                          ref={fileInput}
                          type="file"
                          onChange={profilePictureChangeHandler}
                          name="profilePicture"
                          accept="image/*"
                        />
                      </div> */}

                    {/* <div className={classes.btns}>
                        <Button
                          onClick={submitProfilePictureHandler}
                          className="btn"
                        >
                          <UploadIcon />
                          Upload
                        </Button>

                        <Button
                          onClick={deleteProfileHandler}
                          className="btn delete_btn"
                        >
                          <DeleteIcon />
                          Delete
                        </Button>
                      </div> */}
                    {/* </div> */}
                    {/* </form> */}
                  </div>
                </div>
              </div>

              <p className={classes.password_header}>
                Leave Password field blank if you do not want to change.
              </p>

              <div
                className={`${classes.profile_form} ${classes.password_form}`}
              >
                <div className={classes.form_control}>
                  <label htmlFor="password">New Password:</label>

                  <PasswordInput
                    onChange={formDataHandler}
                    name="password"
                    id="password"
                    placeholder="Enter new password"
                    value={formData.password}
                  />
                </div>

                <div className={classes.form_control}>
                  <label htmlFor="confirmPassword">Confirm Password:</label>

                  <PasswordInput
                    onChange={formDataHandler}
                    name="confirmPassword"
                    id="confirmPassword"
                    placeholder="Confirm new password"
                    value={formData.confirmPassword}
                  />
                </div>

                <Button className={classes.btn}>
                  <div className="btn_icon">
                    <SaveIcon />
                  </div>
                  <span>Save Changes</span>
                </Button>
              </div>
            </form>
          )}
        </Card>

        <Card className={`${classes.footer_card}`}>
          <Footer />
        </Card>
      </div>
    </Fragment>
  );
};
ProfileContent.propTypes = {
  onSubmitProfilePicture: PropTypes.func,
  userDetails: PropTypes.object,
};
export default ProfileContent;
