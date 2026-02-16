import { FormControlLabel, Switch } from "@mui/material";
import { useTheme } from "../../../context/ThemeContext";
import { styled } from "@mui/material/styles";
import ToolTip from "../ToolTip/ToolTip";

const StyledSwitch = styled(Switch)(({ theme }) => ({
  padding: 8,
  "& .MuiSwitch-track": {
    borderRadius: 22 / 2,
    "&:before, &:after": {
      content: '""',
      position: "absolute",
      top: "50%",
      width: "4em",
      height: "100%",
      transform: "translateY(-50%)",
    },
    "&:before": {
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
        "#fff",
      )}" d="M9.37,5.51C9.37,5.51 6.26,9.45 6.26,12 C6.26,14.55 8.87,17.74 12,17.74 C15.13,17.74 17.74,14.55 17.74,12 C17.74,9.45 14.63,5.51 14.63,5.51 L12,2 L9.37,5.51 Z"/></svg>')`,
      left: 12,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
    },
    "&:after": {
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
        "#fff",
      )}" d="M9.37,5.51C9.37,5.51 6.26,9.45 6.26,12 C6.26,14.55 8.87,17.74 12,17.74 C15.13,17.74 17.74,14.55 17.74,12 C17.74,9.45 14.63,5.51 14.63,5.51 L12,2 L9.37,5.51 Z M12,15.74 C9.87,15.74 8.26,14.55 8.26,12 C8.26,11.09 8.66,10.16 9.25,9.58 C9.25,9.58 11.41,11.85 12,15.74 Z"/></svg>')`,
      right: 12,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
    },
  },
  "& .MuiSwitch-thumb": {
    boxShadow: "0 2px 4px 0 rgb(0 35 11 / 20%)",
    width: 21,
    height: 21,
    margin: 2,
  },
}));

const ThemeToggle = () => {
  const { isDarkTheme, toggleTheme } = useTheme();

  return (
    <>
      <ToolTip
        title={isDarkTheme ? "Switch to Light Mode" : "Switch to Dark Mode"}
        placement="bottom"
      >
        <FormControlLabel
          control={
            <StyledSwitch checked={isDarkTheme} onChange={toggleTheme} />
          }
          label=""
          sx={{ margin: 0 }}
        />
      </ToolTip>
    </>
  );
};

export default ThemeToggle;
