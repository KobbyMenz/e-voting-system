import axios from "axios";
import dayjs from "dayjs";
import { useState, useEffect } from "react";
import app_api_url from "../../app_api_url";
import Toast from "../UI/Notification/Toast";
// import Toast from "../UI/Notification/Toast";

/**
 * Hook to automatically calculate election status based on current time
 * @param {string|Date} startDate - Election start date
 * @param {string|Date} endDate - Election end date
 * @param {string} initialStatus - Initial status from props (fallback)
 * @returns {string} Calculated status: "Upcoming", "Active", or "Closed"
 */
export const useElectionStatus = (
  apiEndPointName,
  startDate,
  endDate,
  initialStatus = "Upcoming",
  // toastModal = null,
) => {
  const [status, setStatus] = useState(initialStatus);

  useEffect(() => {
    const calculateStatus = () => {
      const now = dayjs();
      const start = dayjs(startDate);
      const end = dayjs(endDate);

      if (now >= end) {
        return "Closed";
      } else if (now >= start) {
        return "Active";
      } else {
        return "Upcoming";
      }
    };

    // Function to show toast notifications
    const toastModal = (type, message) => {
      Toast(
        type === "Upcoming" ? "info" : type === "Active" ? "success" : "error",
        message,
      );
    };

    // // Show toast notification when status changes
    // toastModal("success", `Election status updated to ${calculateStatus()}`);

    const updateElectionStatus = async () => {
      try {
        const response = await axios.put(`${app_api_url}/${apiEndPointName}`, {
          status: calculateStatus(),
        });

        // refreshTable();
        if (response.data.message) {
          toastModal(
            "success",
            `Election status updated to ${calculateStatus()}`,
          );
        }
      } catch (err) {
        if (err.response?.data?.error) {
          toastModal("error", err.response.data.error);
        } else {
          toastModal("error", "Process Failed");
        }
      }
    };
    updateElectionStatus();

    // Calculate status immediately
    setStatus(calculateStatus());

    // Set up an interval to check every 5 seconds
    const interval = setInterval(() => {
      setStatus(calculateStatus());
    }, 5000);

    return () => clearInterval(interval);
  }, [apiEndPointName, startDate, endDate]);

  return status;
};
