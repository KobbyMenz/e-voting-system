import { Fragment, useState, useEffect, useCallback, useRef } from "react";
import PropTypes from "prop-types";
import classes from "../../UI/Modals/AddModal.module.css";
import Card from "../Card";
import Button from "../Button";
import styles from "../../pages/AdminStaff/AdminStaffContent.module.css";
import axios from "axios";
import useFetch from "../../CustomHooks/useFetch";
import moment from "moment";
import app_api_url from "../../../../APP_API_URL";
import default_data from "../../../default_data/default_data";
import CloseIcon from "../Icons/CloseIcon";
import AddIcon from "../Icons/AddIcon";
import CancelIcon from "../Icons/CancelIcon";
import DeleteIcon from "../Icons/DeleteIcon";
import defaultLogo from "../../../assets/images/line-md--image-twotone.png";
import Toast from "../Notification/Toast";
import ToolTip from "../ToolTip/ToolTip";

const AddModal = (props) => {
  const fileInput = useRef("");
  const [databaseCategoryId, setDatabaseCategoryId] = useState({});
  const [formData, setFormData] = useState({
    productName: "",
    quantity: "",
    costPrice: "",
    price: "",
    description: "",
    categoryName: "",
  });
  const [selectedImage, setSelectedImage] = useState();
  const [file, setFile] = useState("");

  const { data } = useFetch(`${app_api_url}/getCategories`);
  const categories =
    data !== null
      ? data.sort((a, b) => a.categoryName.localeCompare(b.categoryName))
      : [];

  const allProducts = props.allProducts;

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
  const profilePictureChangeHandler = useCallback((e) => {
    const file = e.target.files && e.target.files[0];
    setFile(file);

    if (file) {
      //Displaying the image preview before uploading
      const fileReader = new FileReader();
      fileReader.onloadend = () => {
        setSelectedImage(fileReader.result);
      };

      fileReader.readAsDataURL(file);
    }
    // else {
    //   setShowModal({
    //     title: "Error Message",
    //     message: "No file selected",
    //   });
    // }
  }, []);

  useEffect(() => {
    //=======Fetching Category ID from database======
    const fetchCategoryId = async () => {
      const categoryName = formData.categoryName;

      if (categoryName === null || categoryName === "") return;

      try {
        const response = await axios.get(
          `${app_api_url}/getCategoryId/${categoryName}`
        );

        // if (response.data) {
        setDatabaseCategoryId(response.data);
        // }
      } catch (err) {
        if (err.response && err.response.data && err.response.data.error) {
          console.log("Error", err.response.data.error);
        }
      }
    };
    fetchCategoryId();
  }, [formData]);

  /////////////////////////////////////////
  // ADDING PRODUCT
  /////////////////////////////////////////
  const onAddProductHandler = useCallback(
    (e) => {
      e.preventDefault();

      //Checking if product already exists
      if (
        allProducts.find(
          (product) =>
            product.productName.toLowerCase() ===
            formData.productName.toLowerCase()
        )
      ) {
        props.toastModal("error", "Product already exists!");
        return;
      }

      if (window.confirm("Are you sure you want to add new product?")) {
        const productFormData = new FormData();
        //key must match what multer expects
        productFormData.append("productName", formData.productName);
        productFormData.append("quantity", +formData.quantity);
        productFormData.append("costPrice", +formData.costPrice);
        productFormData.append("price", +formData.price);
        productFormData.append("description", formData.description);
        productFormData.append("categoryId", databaseCategoryId.categoryId);
        productFormData.append(
          "dateAdded",
          moment().format("YYYY-MM-DD HH:mm:ss")
        );
        if (file) productFormData.append("productImage", file);

        //Adding Product to database
        const addProduct = async () => {
          try {
            const response = await axios.post(
              `${app_api_url}/insertProduct`,
              productFormData,
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              }
            );
            props.setRefetch();

            props.toastModal("success", `${response.data.message}`);
          } catch (err) {
            props.toastModal("error", `${err}`);
          }
        };
        addProduct();

        //console.log(productData);

        props.onCloseModal();
      }
    },
    [databaseCategoryId.categoryId, file, props, formData, allProducts]
  );

  ///////////////////////////////
  //DELETE PRODUCT IMAGE FILE
  /////////////////////////
  const deleteProductImageHandler = useCallback(async () => {
    if (file || formData.productImage) {
      setFormData((prev) => {
        return {
          ...prev,
          productImage: null,
        };
      });

      setFile(null);
      fileInput.current.value = null; //Clearing logo path

      setSelectedImage(defaultLogo);
    } else {
      Toast("error", "No image to be deleted");
      return;
    }
  }, [file, formData.productImage]);

  return (
    <Fragment>
      <div className={classes.backdrop} />

      <Card className={`${classes.modal}`}>
        <header>
          <span>Add New Product</span>

          <div onClick={props.onCloseModal} className={classes.close_btn}>
            <CloseIcon />
          </div>
        </header>

        <div className={`${classes.content} ${classes.productModal}`}>
          <form onSubmit={onAddProductHandler}>
            <div className="profile_picture_container">
              <div className="profile_picture">
                {/* {Setting profile image to display} */}
                <div className={classes.image_container}>
                  <img
                    className={classes.img}
                    src={
                      selectedImage ? selectedImage : default_data.defaultLogo
                    }
                    alt="profilePicture"
                  />
                </div>

                {/* <div className="btn_container"> */}
                <div className={styles.form_control}>
                  <label className={classes.label} htmlFor="productImage">
                    Product Image (.png):
                  </label>

                  <input
                    className={styles.input}
                    ref={fileInput}
                    // ref={fileInputRef}
                    id={classes.img_input}
                    type="file"
                    onChange={profilePictureChangeHandler}
                    accept="image/*"
                  />

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
                      onClick={deleteProductImageHandler}
                    >
                      {" "}
                      <DeleteIcon />
                      {/* <span>Delete</span> */}
                    </Button>
                  </ToolTip>
                </div>
              </div>
              {/* </div> */}
            </div>

            <div className={styles.form_control}>
              <label className={classes.label} htmlFor="productName">
                Product Name<span className={classes.required_field}>*</span>
              </label>

              <input
                name="productName"
                id="productName"
                value={formData.productName}
                type="text"
                maxLength={30}
                placeholder="Enter product name"
                onChange={onFormDataChangeHandler}
                required
              />
            </div>

            <div className={styles.form_control}>
              <label className={classes.label} htmlFor="qty">
                Quantity<span className={classes.required_field}>*</span>
              </label>

              <input
                name="quantity"
                id="qty"
                value={formData.quantity}
                type="number"
                min={0}
                placeholder="Enter product quantity"
                onChange={onFormDataChangeHandler}
                required
              />
            </div>

            <div className={styles.form_control}>
              <label className={classes.label} htmlFor="costPrice">
                Cost Price<span className={classes.required_field}>*</span>
              </label>

              <input
                name="costPrice"
                id="costPrice"
                value={formData.costPrice}
                type="number"
                min={0}
                // step={0.01}
                placeholder="Enter product cost price"
                onChange={onFormDataChangeHandler}
                required
              />
            </div>

            <div className={styles.form_control}>
              <label className={classes.label} htmlFor="price">
                Selling Price<span className={classes.required_field}>*</span>
              </label>

              <input
                name="price"
                id="price"
                value={formData.price}
                type="number"
                min={0}
                // step={0.01}
                placeholder="Enter product selling price"
                onChange={onFormDataChangeHandler}
                required
              />
            </div>

            <div className={styles.form_control}>
              <label className={classes.label} htmlFor="description">
                Description
              </label>

              <input
                name="description"
                id="description"
                value={formData.description}
                maxLength={50}
                type="text"
                placeholder="Enter product description"
                onChange={onFormDataChangeHandler}
              />
            </div>

            <div className={styles.form_control}>
              <label className={classes.label} htmlFor="category">
                Category<span className={classes.required_field}>*</span>
              </label>

              <select
                className={classes.select}
                onChange={onFormDataChangeHandler}
                value={formData.categoryName}
                name="categoryName"
                id="category"
                required
              >
                <option value="">------ Select a category ------</option>
                {categories.map((category, index) => (
                  <option value={category.categoryName} key={index}>
                    {category.categoryName}
                  </option>
                ))}
              </select>
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
        </div>
      </Card>
    </Fragment>
  );
};

AddModal.propTypes = {
  title: PropTypes.string,
  message: PropTypes.string,
  toastModal: PropTypes.func,
  onCloseModal: PropTypes.func,
  setRefetch: PropTypes.func,
  allProducts: PropTypes.array,
};

export default AddModal;
