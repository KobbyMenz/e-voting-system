//import { useState } from "react";
//import useFetch from "../CustomHooks/useFetch";
import styles from "../Filter/Filter.module.css";
import PropTypes from "prop-types";
//import app_api_url from "../../../APP_API_URL";
import FilterIcon from "../Icons/FilterIcon";
import CloseIcon from "../Icons/CloseIcon";
import ROLES from "../../Utils/ROLES";

const Filter = (props) => {
  const roles = [ROLES.ADMIN, ROLES.VOTER];
  // const roles =
  //   data !== null
  //     ? data.sort((a, b) => a.categoryName.localeCompare(b.categoryName))
  //     : [];

  return (
    <>
      <form>
        <div className={styles.form_control}>
          {/* <label className={styles.label} htmlFor="filterInput">
            <FilterIcon />
          </label> */}

          <select
            className={styles.select}
            onChange={props.onChange}
            value={props.value}
            // name="categoryName"
            name={props.name}
            // id="category"
            id="filterInput"
            required
          >
            <option id={styles.select_option_placeholder} value="">
              {props.placeholder}
            </option>

            {roles.map((role, index) => (
              <option value={role} key={index}>
                {role}
              </option>
            ))}
          </select>

          <div onClick={props.onClickCloseBtn} className={styles.close_btn}>
            <CloseIcon />
          </div>
        </div>
      </form>
    </>
  );
};
Filter.propTypes = {
  onChange: PropTypes.func,
  value: PropTypes.string,
  name: PropTypes.string,
  // id: PropTypes.string,
  onClickCloseBtn: PropTypes.func,
  placeholder: PropTypes.string,
};
export default Filter;
