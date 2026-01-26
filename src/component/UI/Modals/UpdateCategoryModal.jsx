import { Fragment, useState, useCallback } from "react";
import PropTypes from "prop-types";
import classes from "../../UI/Modals/AddModal.module.css";
import Card from "../Card";
import Button from "../Button";
import styles from "../../pages/AdminStaff/AdminStaffContent.module.css";
import axios from "axios";
import CloseIcon from "../Icons/CloseIcon";
import SaveIcon from "../Icons/SaveIcon";
import CancelIcon from "../Icons/CancelIcon";
import app_api_url from "../../../../APP_API_URL";
//import OkayIcon from "./OkayIcon";

const UpdateCategoryModal = (props) => {
  //const [databaseCategoryId, setDatabaseCategoryId] = useState({});
  const [formData, setFormData] = useState({
    categoryId: props.onSubmit.categoryId,
    categoryName: props.onSubmit.categoryName,
  });

  const onFormDataChangeHandler = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => {
      return {
        ...prevFormData,
        [name]: value,
      };
    });
  }, []);

  ////////////////////////////////////////
  //UPDATING CATEGORY
  /////////////////////////////////////////
  const onSaveUpdateHandler = useCallback(
    (e) => {
      e.preventDefault();

      if (window.confirm("Are you sure you want to update product category?")) {
        const categoryData = {
          categoryId: formData.categoryId,
          categoryName: formData.categoryName,
        };

        //Updating Product
        const updateProduct = async () => {
          try {
            const response = await axios.put(
              `${app_api_url}/updateCategory/${formData.categoryId}`,
              categoryData
            );
            props.setRefetch();

            props.toastModal("success", `${response.data.message}`);
          } catch (err) {
            props.toastModal("error", `${err}`);
          }
        };
        updateProduct();

        props.onCloseModal(); // closing modal
      }
    },
    [formData.categoryName, props, formData.categoryId]
  );

  return (
    <Fragment>
      <div className={classes.backdrop} />

      <Card className={classes.modal}>
        <header>
          <span>Update Category</span>

          <div onClick={props.onCloseModal} className={classes.close_btn}>
            <CloseIcon />
          </div>
        </header>
        <form onSubmit={onSaveUpdateHandler}>
          <div className={classes.content}>
            <div className={styles.form_control}>
              <label className={classes.label} htmlFor="categoryName">
                Category Name<span className={classes.required_field}>*</span>
              </label>

              <input
                name="categoryName"
                id="categoryName"
                value={formData.categoryName}
                type="text"
                placeholder="Enter category name"
                onChange={onFormDataChangeHandler}
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
              id={classes.btn__no}
              className={classes.btn}
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

UpdateCategoryModal.propTypes = {
  title: PropTypes.string,
  message: PropTypes.string,
  backdrop: PropTypes.func,
  onCloseModal: PropTypes.func,
  onSubmit: PropTypes.object,
  toastModal: PropTypes.func,
  setRefetch: PropTypes.func,
};

export default UpdateCategoryModal;
