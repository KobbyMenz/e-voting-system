import classes from "./Footer.module.css";

const Footer = () => {
  return (
    <>
      <footer className={classes.footer}>
        Software by{" "}
        <span className={classes.span_container}>
          <span className={classes.span_1}>KOBBY-MENZ</span>{" "}
          <span className={classes.span_2}>Tech Solutions</span>
        </span>{" "}
        | copy right &copy; 2026. All right reserved.
      </footer>
    </>
  );
};
export default Footer;
