import { Fragment, useState, useEffect, useCallback, useRef } from "react";
//import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import classes from "../../UI/Modals/AddModal.module.css";
import Card from "../Card";
import Button from "../Button";
import styles from "../../pages/AdminStaff/AdminStaffContent.module.css";
import axios from "axios";
import useFetch from "../../CustomHooks/useFetch";
import moment from "moment";
import app_api_url from "../../../../APP_API_URL";
import CloseIcon from "../Icons/CloseIcon";
import SaveIcon from "../Icons/SaveIcon";
import CancelIcon from "../Icons/CancelIcon";
import DeleteIcon from "../Icons/DeleteIcon";
import Toast from "../Notification/Toast";
import { Box } from "@mui/material";
import defaultLogo from "../../../assets/images/line-md--image-twotone.png";
import ToolTip from "../ToolTip/ToolTip";

const UpdateModal = (props) => {
  //const [categories, setCategories] = useState([]);
  const [databaseQuantity, setDatabaseQuantity] = useState({});
  const [databaseCategoryId, setDatabaseCategoryId] = useState({});
  const fileInput = useRef("");
  const [formData, setFormData] = useState({
    productId: props.onSubmit.productId,
    productName: props.onSubmit.productName,
    quantity: +"",
    costPrice: props.onSubmit.costPrice.toFixed(2),
    price: props.onSubmit.price.toFixed(2),
    // serviceCharge: props.onSubmit.serviceCharge
    //   ? props.onSubmit.serviceCharge
    //   : 0.0,
    description: props.onSubmit.description,
    categoryName: props.onSubmit.categoryName,
    productImage: props.onSubmit.productImage,
  });

  const [selectedImage, setSelectedImage] = useState(formData.productImage);
  const [file, setFile] = useState("");

  const { data } = useFetch(`${app_api_url}/getCategories`);
  const categories =
    data !== null
      ? data.sort((a, b) => a.categoryName.localeCompare(b.categoryName))
      : [];

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
  }, []);

  useEffect(() => {
    //=======Fetching Product quantity from database======
    const fetchProductQuantity = async () => {
      const productId = formData.productId;
      try {
        const response = await axios.get(
          `${app_api_url}/getProductQuantity/${+productId}`
        );

        setDatabaseQuantity(response.data);
      } catch (err) {
        if (err.response && err.response.data && err.response.data.error) {
          console.log(err.response.data.error);
        }
      }
    };
    fetchProductQuantity();

    //=======Fetching Category ID from database======
    const fetchCategoryId = async () => {
      const categoryName = formData.categoryName;
      try {
        const response = await axios.get(
          `${app_api_url}/getCategoryId/${categoryName}`
        );

        setDatabaseCategoryId(response.data);
      } catch (err) {
        if (err.response && err.response.data && err.response.data.error) {
          console.log(err.response.data.error);
        }
      }
    };
    fetchCategoryId();
  }, [formData.categoryName, formData.productId]);

  ////////////////////////////////////////
  //UPDATING PRODUCT
  /////////////////////////////////////////
  const onSaveUpdateHandler = useCallback(
    (e) => {
      e.preventDefault();

      if (window.confirm("Are you sure you want to update product?")) {
        const productFormData = new FormData();
        //key must match what multer expects
        productFormData.append("productName", formData.productName);
        productFormData.append(
          "quantity",
          +formData.quantity + databaseQuantity.quantity
        );
        productFormData.append("costPrice", +formData.costPrice);
        productFormData.append("price", +formData.price);
        // productFormData.append("serviceCharge", formData.serviceCharge);
        productFormData.append("description", formData.description);
        productFormData.append("categoryId", databaseCategoryId.categoryId);
        productFormData.append(
          "dateUpdated",
          moment().format("YYYY-MM-DD HH:mm:ss")
        );
        if (file) productFormData.append("productImage", file);

        //Updating Product
        const updateProduct = async () => {
          try {
            const response = await axios.put(
              `${app_api_url}/updateProduct/${formData.productId}`,
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
        updateProduct();

        props.onCloseModal();
        return;
      }
    },
    [
      databaseCategoryId.categoryId,
      file,
      formData,
      props,
      databaseQuantity.quantity,
    ]
  );

  ///////////////////////////////
  //DELETE LOGO FILE
  //////////////////////////////
  const deleteProductImageHandler = useCallback(async () => {
    const hasFileSelected = !!(
      fileInput &&
      fileInput.current &&
      fileInput.current.value
    );
    const hasProductImage =
      formData.productImage !== null && formData.productImage !== "";

    // If neither an existing image nor a selected file exist, nothing to delete.
    if (!hasFileSelected && !hasProductImage) {
      Toast("info", "No image to delete");
      return;
    }
    // If both an existing product image and a new file are present, do nothing and instruct the user.
    if (hasFileSelected && hasProductImage) {
      fileInput.current.value = null;
      setSelectedImage(formData.productImage);
      Toast("info", "Selected file is removed.");
      return;
    }

    // If there is a selected file but no existing image, just clear the selection locally.
    if (hasFileSelected && !hasProductImage) {
      setFile(null);
      if (fileInput && fileInput.current) fileInput.current.value = null;
      setSelectedImage(defaultLogo);
      Toast("info", "Selected file cleared");
      return;
    }

    // At this point: hasProductImage === true && hasFileSelected === false
    if (hasProductImage) {
      if (!window.confirm("Are you sure you want to delete image?")) return;

      setFormData((prev) => ({ ...prev, productImage: null }));
      setFile(null);
      if (fileInput && fileInput.current) fileInput.current.value = null;

      const updateFormData = new FormData();
      // Append an empty value so the backend knows to remove the image.
      updateFormData.append("productImage", "");
      const productId = formData.productId;
      try {
        const response = await axios.put(
          `${app_api_url}/updateProductImage/${productId}`,
          updateFormData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        setSelectedImage(defaultLogo);
        props.setRefetch();
        Toast("success", response.data.message);
      } catch (err) {
        Toast("error", `Failed to delete ${err}`);
      }
    }
  }, [formData.productImage, formData.productId, props]);

  return (
    <Fragment>
      <div className={classes.backdrop} />

      <Card className={classes.modal}>
        <header>
          <span>Update Product</span>

          <div onClick={props.onCloseModal} className={classes.close_btn}>
            <CloseIcon />
          </div>
        </header>

        <div className={`${classes.content} ${classes.productModal}`}>
          <form onSubmit={onSaveUpdateHandler}>
            <div className="profile_picture_container">
              <div className="profile_picture">
                {/* {Setting profile image to display} */}
                <div className={classes.image_container}>
                  {selectedImage && (
                    <img
                      className={classes.img}
                      src={
                        selectedImage ? selectedImage : defaultLogo
                        // `../../../../public${formData.productImage}`
                      }
                      alt="profilePicture"
                    />
                  )}
                </div>

                <Box
                  display="flex"
                  justifyItems="center"
                  justifyContent="center"
                  gap={1}
                >
                  <div className={styles.form_control}>
                    <label className={classes.label} htmlFor="productImage">
                      Product Image ( .png ):
                    </label>
                    <input
                      className={styles.input}
                      ref={fileInput}
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
                          // Padding: "0.5rem",
                        }}
                        onClick={deleteProductImageHandler}
                      >
                        {" "}
                        <DeleteIcon />
                        {/* <span>Delete</span> */}
                      </Button>
                    </ToolTip>
                  </div>
                </Box>
              </div>
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
                <SaveIcon />

                <span> Save</span>
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
        </div>
      </Card>
    </Fragment>
  );
};

UpdateModal.propTypes = {
  title: PropTypes.string,
  message: PropTypes.string,
  onCloseModal: PropTypes.func,
  onSubmit: PropTypes.object,
  toastModal: PropTypes.func,
  onAdd: PropTypes.func,
  setRefetch: PropTypes.func,
};

export default UpdateModal;
