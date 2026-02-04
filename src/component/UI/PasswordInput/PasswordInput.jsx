import { useState } from "react";
import styles from "./PasswordInput.module.css";
import OpenEyeIcon from "../Icons/OpenEyeIcon";
import CloseEyeIcon from "../Icons/CloseEyeIcon";
import PropTypes from "prop-types";

const PasswordInput = ({
  value,
  onChange,
  name,
  id,
  placeholder,
  required,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  //Toggle password icon
  const togglePassword = () => {
    setShowPassword((prevPassword) => !prevPassword);
  };
  return (
    <>
      <div className={styles.input_container}>
        {/* <label htmlFor="devicePassword">Device Password / PIN</label> */}

        <input
          name={name}
          id={id}
          type={showPassword ? "text" : "password"}
          placeholder={placeholder || "Enter password"}
          onChange={onChange}
          value={value}
          required={required}
        />

        {value === "" ? (
          ""
        ) : (
          <label
            htmlFor={id}
            className={styles.password__icon}
            onClick={togglePassword}
          >
            {!showPassword ? <OpenEyeIcon /> : <CloseEyeIcon />}
          </label>
        )}
      </div>
    </>
  );
};
PasswordInput.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  name: PropTypes.string,
  id: PropTypes.string,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
};

export default PasswordInput;
