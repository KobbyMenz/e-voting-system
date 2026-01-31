import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PropTypes from "prop-types";
import PaginationTable from "../PaginationTable/PaginationTable";
import { Box, IconButton } from "@mui/material";
import Button from "../Button/Button";
import StopIcon from "../Icons/StopIcon";
import PlayIcon from "../Icons/PlayIcon";
//import DeleteIcon from "../Icons/DeleteIcon";
import { Delete } from "@mui/icons-material";
import ToolTip from "../ToolTip/ToolTip";
import formatDateTime from "../../Functions/formatDateTime";
import Card from "../Card/Card";

export default function AccordionExpandDefault({
  electionTitle,
  status,
  dateCreated,
  startDate,
  endDate,
  id,
  columns,
  rows,
  onEdit,
  onDelete,
  onAdd,
  onChangeStatus,
  onDeleteElection,
}) {
  return (
    <Card>
      <Accordion
        sx={{
          backgroundColor: "var(--bg-color3)",
          transition: "all 0.3s ease-in-out",
          borderBottom: "0.2rem solid var(--bg-color)",
          marginBottom: "0.2rem",
          borderRadius: "1rem",
          boxShadow: "0rem 0.2rem 1rem rgba(0, 0, 0, 0.25)",
          "@media (max-width: 600px)": {
            boxShadow: "0rem 0.1rem 0.5rem rgba(0, 0, 0, 0.15)",
          },
          // "@media (max-width: 768px)": {

          // },
        }}
      >
        <AccordionSummary
          expandIcon={
            <ExpandMoreIcon
              sx={{
                color: "#fff",
                background: "var(--primary)",
                fontSize: "2.5rem",
                borderRadius: "50%",
              }}
            />
          }
          aria-controls={`panel${id}-content`}
          id={`panel${id}-header`}
          sx={{ transition: "all 0.3s ease-in-out" }}
        >
          <Box
            sx={{
              display: "flex",
              flexGrow: 1,
              gap: "2rem",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              "@media (max-width: 600px)": {
                gap: "0.3rem",
                flexDirection: "row",
              },
              "@media (max-width: 768px)": {
                gap: "2rem",
              },
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <h3 style={{ fontWeight: "600", color: "var(--text-color)" }}>
                {electionTitle}
              </h3>{" "}
              <div
                style={{
                  background: status === "Active" ? "#06882d" : "#ca0202",
                  padding: "0.3rem 1.2rem",
                  fontSize: "1.4rem",
                  borderRadius: "1.5rem",
                  height: "fit-content",
                  width: "fit-content",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                }}
              >
                {status}
              </div>{" "}
            </Box>

            <div style={{ fontSize: "1.5rem", color: "var(--text-color)" }}>
              Created: {dateCreated}
            </div>

            <Box
              sx={{
                display: "flex",
                gap: "1.5rem",
                flexDirection: "row",

                "@media (max-width: 600px)": {
                  flexDirection: "column",
                  gap: "0.8rem",
                  flexWrap: "wrap",
                },
              }}
            >
              <Box
                sx={{
                  background:
                    "linear-gradient(135deg, #764ba2 0%,  #667eea  100%)",
                  padding: "0.8rem 1.5rem",
                  borderRadius: "1rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.3rem",
                  color: "#fff",
                  minWidth: "200px",
                  // boxShadow: "0 4px 15px rgba(102, 126, 234, 0.3)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  "@media (max-width: 600px)": {
                    padding: "0.6rem 1.2rem",
                    minWidth: "auto",
                  },
                }}
              >
                <span
                  style={{
                    fontSize: "1.3rem",
                    opacity: 0.9,
                    fontWeight: "400",
                    // color: "var(--text-color)",
                  }}
                >
                  Start Date
                </span>
                <span style={{ fontSize: "1.5rem", fontWeight: "600" }}>
                  {formatDateTime(startDate)}
                </span>
              </Box>

              <Box
                sx={{
                  background:
                    "linear-gradient(135deg, #f5576c 0%,  #ea2bff 100%)",
                  padding: "0.8rem 1.5rem",
                  borderRadius: "1rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.3rem",
                  color: "#fff",
                  marginRight: "0.5rem",
                  minWidth: "200px",
                  // boxShadow: "0 4px 15px rgba(245, 87, 108, 0.3)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  "@media (max-width: 600px)": {
                    padding: "0.6rem 1.2rem",
                    minWidth: "auto",
                  },
                }}
              >
                <span
                  style={{
                    fontSize: "1.3rem",
                    opacity: 0.9,
                    fontWeight: "400",
                    // color: "var(--text-color)",
                  }}
                >
                  End Date
                </span>
                <span
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: "600",
                    // color: "var(--text-color)",
                  }}
                >
                  {formatDateTime(endDate)}
                </span>
              </Box>
            </Box>
          </Box>
          {/* </Typography> */}
        </AccordionSummary>

        <AccordionDetails
          sx={{ marginBottom: "2rem", transition: "all 0.3s ease-in-out" }}
        >
          <Box>
            <Box
              sx={{
                display: "flex",
                gap: "2rem",
                padding: "2rem",
                border: "0.1rem solid var(--bg-color)",
                borderRadius: "1rem",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                marginBottom: "2rem",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  columnGap: "2rem",
                  rowGap: "0.5rem",
                  alignItems: "center",

                  flexWrap: "wrap",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    columnGap: "2rem",
                    rowGap: "0.5rem",
                    alignItems: "center",

                    flexWrap: "wrap",
                    color: "var(--text-color)",
                  }}
                >
                  <h2>Status Control:</h2>
                  <p>
                    Election is currently{" "}
                    {status === "Active" ? "open for voting" : "closed"}
                  </p>
                </Box>
              </Box>

              <Box display="flex" alignItems="center" gap="2rem">
                <Button
                  onClick={onChangeStatus}
                  style={{
                    backgroundColor:
                      status === "Active" ? "#ca0202" : "var(--primary)",
                  }}
                >
                  {/*Change button icon and text based on election status*/}
                  {status === "Active" ? <StopIcon /> : <PlayIcon />}
                  <Typography
                    sx={{
                      fontSize: "1.5rem",
                      fontWeight: "bold",
                      color: "#fff",
                    }}
                  >
                    {status === "Active" ? "End Election" : "Start Election"}
                  </Typography>
                </Button>

                <ToolTip title="Delete election">
                  <IconButton
                    sx={{
                      width: "3.6rem",
                      height: "3.6rem",
                      border: "0.3rem solid #ffffff4d",
                      backgroundColor: "#ca0202",
                      color: "var(text-color)",
                      "&:hover": { backgroundColor: "#f52b1cff" },
                    }}
                    onClick={() => onDeleteElection(id)}
                  >
                    <Delete sx={{ fontSize: "1.8rem" }} />
                  </IconButton>
                </ToolTip>
              </Box>
            </Box>

            <PaginationTable
              key={id}
              columns={columns}
              rows={rows}
              onEdit={onEdit}
              onDelete={onDelete}
              onAdd={onAdd}
            />
          </Box>
          <Typography sx={{ fontSize: "1.1rem" }}></Typography>
        </AccordionDetails>
      </Accordion>
    </Card>
  );
}
AccordionExpandDefault.propTypes = {
  electionTitle: PropTypes.string,
  dateCreated: PropTypes.string,
  startDate: PropTypes.string,
  endDate: PropTypes.string,
  status: PropTypes.string,
  id: PropTypes.string,
  columns: PropTypes.array,
  rows: PropTypes.array,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  onAdd: PropTypes.func,
  onChangeStatus: PropTypes.func,
  onDeleteElection: PropTypes.func,
};
