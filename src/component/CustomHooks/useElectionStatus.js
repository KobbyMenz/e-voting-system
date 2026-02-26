import dayjs from "dayjs";
import { useState, useEffect } from "react";

/**
 * Hook to automatically calculate election status based on current time
 * @param {string|Date} startDate - Election start date
 * @param {string|Date} endDate - Election end date
 * @param {string} initialStatus - Initial status from props (fallback)
 * @returns {string} Calculated status: "Upcoming", "Active", or "Closed"
 */
export const useElectionStatus = (
  startDate,
  endDate,
  initialStatus = "Upcoming",
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

    // Calculate status immediately
    setStatus(calculateStatus());

    // Set up an interval to check every 30 seconds
    const interval = setInterval(() => {
      setStatus(calculateStatus());
    }, 5000);

    return () => clearInterval(interval);
  }, [startDate, endDate]);

  return status;
};
