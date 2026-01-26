import { Fragment, useCallback, useState } from "react";
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

const UpdateCustomerModal = (props) => {
  const [formData, setFormData] = useState({
    customerId: props.onSubmit.customerId,
    customerName: props.onSubmit.customerName,
    phone: props.onSubmit.phone,
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
                ""
              )
            : value,
      };
    });
  }, []);

  ////////////////////////////////////////
  //UPDATING CUSTOMER
  /////////////////////////////////////////
  const onSaveUpdateHandler = useCallback(
    (e) => {
      e.preventDefault();

      if (+formData.phone.length !== 10) {
        props.toastModal("error", "Phone number must be 10 digits!");

        return;
      }

      if (
        window.confirm(`Are you sure you want to update customer's details?`)
      ) {
        const customerData = {
          customerId: formData.customerId,
          customerName: formData.customerName,
          phone: formData.phone,
        };

        //Updating Product
        const updateCustomer = async () => {
          try {
            const response = await axios.put(
              `${app_api_url}/updateCustomer/${formData.customerId}`,
              customerData
            );
            props.setRefetch();

            props.toastModal("success", `${response.data.message}`);
          } catch (err) {
            props.toastModal("success", `${err}`);
          }
        };
        updateCustomer();

        //   clearInputFields();

        props.onCloseModal();
      }
    },
    [formData, props]
  );

  return (
    <Fragment>
      <div className={classes.backdrop} />

      <Card className={classes.modal}>
        <header>
          <span>Update Customer</span>

          <div onClick={props.onCloseModal} className={classes.close_btn}>
            <CloseIcon />
          </div>
        </header>

        <form onSubmit={onSaveUpdateHandler}>
          <div className={classes.content}>
            <div className={styles.form_control}>
              <label className={classes.label} htmlFor="customerName">
                Customer Name<span className={classes.required_field}>*</span>
              </label>

              <input
                name="customerName"
                id="customerName"
                value={formData.customerName}
                type="text"
                placeholder="Enter customer's name"
                onChange={onFormDataChangeHandler}
                required
              />
            </div>

            <div className={styles.form_control}>
              <label className={classes.label} htmlFor="phone">
                Phone Number<span className={classes.required_field}>*</span>
              </label>

              <input
                name="phone"
                id="phone"
                value={formData.phone}
                type="tel"
                placeholder="Enter customer's phone number"
                onChange={onFormDataChangeHandler}
                required
                maxLength={10}
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

UpdateCustomerModal.propTypes = {
  // title: PropTypes.string,
  // message: PropTypes.string,
  onCloseModal: PropTypes.func,
  onSubmit: PropTypes.object,
  toastModal: PropTypes.func,
  onAdd: PropTypes.func,
  setRefetch: PropTypes.func,
};

export default UpdateCustomerModal;
