import { useState, useEffect } from "react";

const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes in milliseconds
const LOCKOUT_TIMESTAMP_KEY = "accountLockoutTimestamp";

/**
 * Custom hook to manage account lockout timer
 * Shows countdown for when account will be unlocked
 * Persists lockout timestamp across page refreshes
 * @param {boolean} isLocked - Whether the account is currently locked
 * @returns {Object} - { timeRemaining, isExpired }
 */
export const useLockoutTimer = (isLocked) => {
  const [timeRemaining, setTimeRemaining] = useState(0);

  // Calculate remaining time based on stored lockout timestamp
  const calculateRemainingTime = () => {
    const lockoutTimestamp = +JSON.parse(
      localStorage.getItem(LOCKOUT_TIMESTAMP_KEY),
    );
    if (!lockoutTimestamp) return 0;

    const now = Date.now();
    const lockoutTime = parseInt(lockoutTimestamp, 10);
    const elapsedTime = now - lockoutTime;
    const remaining = LOCKOUT_DURATION_MS - elapsedTime;

    return Math.max(0, Math.ceil(remaining / 1000)); // Return in seconds
  };

  useEffect(() => {
    if (!isLocked) {
      // Clear lockout timestamp when account is unlocked
      localStorage.removeItem(LOCKOUT_TIMESTAMP_KEY);
      setTimeRemaining(0);
      return;
    }

    // Store the lockout timestamp if not already stored
    // if (!localStorage.getItem(LOCKOUT_TIMESTAMP_KEY)) {
    //   localStorage.setItem(LOCKOUT_TIMESTAMP_KEY, Date.now().toString());
    //   // Set initial time to 15 minutes when timestamp is just created
    //   setTimeRemaining(LOCKOUT_DURATION_MS / 1000);
    // } else {
      // Calculate initial remaining time from existing timestamp
      const remaining = calculateRemainingTime();
      setTimeRemaining(remaining);
    // }

    // Update timer every second
    const timer = setInterval(() => {
      const remaining = calculateRemainingTime();
      setTimeRemaining(remaining);

      // Stop timer when lockout expires
      if (remaining <= 0) {
        clearInterval(timer);
        localStorage.removeItem(LOCKOUT_TIMESTAMP_KEY);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isLocked]);

  // const formatTime = () => {
  //   const minutes = Math.floor(timeRemaining / 60);
  //   const seconds = timeRemaining % 60;
  //   return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  // };

  //console.log("timeRemaining: ", timeRemaining);

  return {
    timeRemaining,
    // formatTime,
    isExpired: timeRemaining === 0,
  };
};
