// utils/auth.js
export const authLocalStorage = () => {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch {
    return null;
  }
};
