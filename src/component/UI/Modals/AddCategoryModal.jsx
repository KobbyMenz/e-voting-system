import { Fragment, useCallback, useState } from "react";
import PropTypes from "prop-types";
import classes from "../../UI/Modals/AddModal.module.css";
import Card from "../Card";
import Button from "../Button";
import styles from "../../pages/AdminStaff/AdminStaffContent.module.css";
import axios from "axios";
import CloseIcon from "../Icons/CloseIcon";
import AddIcon from "../Icons/AddIcon";
import CancelIcon from "../Icons/CancelIcon";
import app_api_url from "../../../../APP_API_URL";

const AddCategoryModal = (props) => {
  const [formData, setFormData] = useState({
    categoryId: "",
    categoryName: "",
  });

  const allCategories = props.allCategories;

  const onFormDataChangeHandler = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => {
      return {
        ...prevFormData,
        [name]: value,
      };
    });
  }, []);

  /////////////////////////////////////////
  // ADDING CATEGORY
  /////////////////////////////////////////
  const onAddCategoryHandler = useCallback(
    (e) => {
      e.preventDefault();

      //Checking if category already exists
      if (
        allCategories.find(
          (category) =>
            category.categoryName.toLowerCase() ===
            formData.categoryName.toLowerCase()
        )
      ) {
        props.toastModal("error", "Category already exists!");
        return;
      }

      if (
        window.confirm("Are you sure you want to add new product category?")
      ) {
        const categoryData = {
          categoryName: formData.categoryName,
        };

        //Adding category to database
        const addCategory = async () => {
          try {
            const response = await axios.post(
              `${app_api_url}/insertCategory`,
              categoryData
            );

            props.setRefetch();

            props.toastModal("success", `${response.data.message}`);
          } catch (err) {
            // console.log(err);
            props.toastModal("error", `${err}`);
          }
        };
        addCategory();

        props.onCloseModal();
      }
    },
    [props, formData.categoryName, allCategories]
  );

  return (
    <Fragment>
      <div className={classes.backdrop} />

      <Card className={`${classes.modal}`}>
        <header>
          <span>Add New Category</span>

          <div onClick={props.onCloseModal} className={classes.close_btn}>
            <CloseIcon />
          </div>
        </header>
        <form onSubmit={onAddCategoryHandler}>
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

AddCategoryModal.propTypes = {
  toastModal: PropTypes.func,
  onCloseModal: PropTypes.func,
  setRefetch: PropTypes.func,
  allCategories: PropTypes.array,
};

export default AddCategoryModal;
