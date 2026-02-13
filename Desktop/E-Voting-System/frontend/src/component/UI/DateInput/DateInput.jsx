import styles from "../SearchBar/SearchBar.module.css";
import PropTypes from "prop-types";
//import CalendarIcon from "../../UI/Icons/CalendarIcon";
//import SearchIcon from "../../UI/Icons/SearchIcon";

const DateInput = (props) => {
  return (
    <>
      <div className={styles.search_container}>
        <div className={styles.search}>
          <input
            className={styles.input}
            placeholder={props.placeholder}
            type="time"
            name={props.name}
            value={props.value}
            id={props.id}
            onChange={props.onChangeDate}
            required={props.required}
          />

          {/* <label className={styles.date_picker__icon} htmlFor="filterInput">
            <CalendarIcon />
          </label> */}

          {/* <label className={styles.search__icon} htmlFor="filterInput">
            <SearchIcon />
          </label> */}
        </div>
      </div>
    </>
  );
};

DateInput.propTypes = {
  name: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  onChangeDate: PropTypes.func,
  required: PropTypes.bool,
  id: PropTypes.string,
};
export default DateInput;
