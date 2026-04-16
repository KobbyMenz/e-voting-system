import { useState, useEffect } from "react";

/**
 * Custom hook to manage account lockout timer
 * Shows countdown for when account will be unlocked
 * @param {boolean} isLocked - Whether the account is currently locked
 * @returns {Object} - { timeRemaining, formatTime, isExpired }
 */
export const useLockoutTimer = (isLocked) => {
  const [timeRemaining, setTimeRemaining] = useState(900); // 15 minutes in seconds

  useEffect(() => {
    if (!isLocked) {
      setTimeRemaining(900);
      return;
    }

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isLocked]);

  const formatTime = () => {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return {
    timeRemaining,
    formatTime,
    isExpired: timeRemaining === 0,
  };
};
