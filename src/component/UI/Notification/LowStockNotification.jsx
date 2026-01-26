import { useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PropTypes from "prop-types";
import axios from "axios";
import app_api_url from "../../../../app_api_url";

const LowStockNotification = ({ notificationTimeInterval, isToggled }) => {
  ///////////////////////////////////////////
  // Fetching stock out products at regular intervals
  ///////////////////////////////////////////
  useEffect(() => {
    //========Fetching StockOut products ============
    const checkStockOutProducts = async () => {
      try {
        const response = await axios.get(
          `${app_api_url}/stockoutProducts`
        );

        const stockOut = response.data.stockoutProducts;

        if (+stockOut > 0) {
          toast.warning(
            `There ${stockOut > 1 ? "are" : "is"} ${stockOut} ${
              stockOut > 1 ? "products" : "product"
            } out of stock.  Please restock now!`,

            {
              position: "top-right",
              autoClose: 10000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              pauseOnFocusLoss: false,
              draggable: true,
              progress: undefined,
              closeButton: true,
              // className: "toast_className",
              toastId: "stockOut-notification", // Prevent duplicate toasts

              style: {
                fontSize: "1.5rem",
                backgroundColor: "var(--bg-color2",
                color: "var(--text-color)",
                boxShadow: "0rem 0.6rem 1.5rem rgba(0, 0, 0, 0.3)",
                border: "0.2rem solid rgba(255, 255, 255, 0.3)",
                // border: "0.2rem solid var(--bg-color)",
              },
            }
          );
        }
      } catch (err) {
        console.error(err);
      }
    };

    const interval = setInterval(() => {
      checkStockOutProducts();
    }, notificationTimeInterval);

    //Cleanup function
    return () => clearInterval(interval);
  }, [notificationTimeInterval, isToggled]);
  ///////////////////////////////////////

  // return (
  //   <>
  //     {/* <ToastContainer /> */}
  //   </>
  // );
};

LowStockNotification.propTypes = {
  isToggled: PropTypes.bool,
  notificationTimeInterval: PropTypes.number,
};
export default LowStockNotification;
