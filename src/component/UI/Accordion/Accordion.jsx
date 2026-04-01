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
//import classes from "../Accordion/Accordion.module.css";
//import DeleteIcon from "../Icons/DeleteIcon";
import { Delete, Edit } from "@mui/icons-material";
import ToolTip from "../ToolTip/ToolTip";
import formatDateTime from "../../Functions/formatDateTime";
import BarChartCompo from "../Chart/BarChartCompo";
// import Card from "../Card/Card";
//import { useElectionStatus } from "../../CustomHooks/useElectionStatus";
import Toast from "../Notification/Toast";

export default function AccordionExpandDefault({
  id,
  electionTitle,
  status,
  description,
  dateCreated,
  startDate,
  endDate,

  columns,
  rows,

  onEdit,
  onDeleteCandidate,
  onAdd,
  // onclickAccordion,
  onDeleteElection,
  onEditElection,
  expanded,
  onExpandChange,
}) {
  // Automatically calculate election status based on current time and update database
  // const calculatedStatus = useElectionStatus(
  //   id,
  //   startDate,
  //   endDate,
  //   status,
  //   null, // onStatusChange callback can be added here if needed
  // );

  return (
    // <Card className={classes.card}>
    <Accordion
      expanded={expanded}
      onChange={(event, isExpanded) => onExpandChange(id, isExpanded)}
      sx={{
        backgroundColor: "var(--bg-color3)",
        transition: "all 0.3s ease-in-out",
        // borderBottom: "0.2rem solid var(--bg-color)",
        marginBottom: "0.5rem",
        borderRadius: "0.5rem",
        boxShadow: "0rem 0.2rem 1rem rgba(0, 0, 0, 0.25)",
        border: "0.2rem solid var(--bg-color)",

        // ".MuiButtonBase-root:hover ": {
        //   background: "var(--header-color)",
        //   borderRadius: "0.5rem",
        // },

        "@media (max-width: 600px)": {
          boxShadow: "0rem 0.1rem 0.5rem rgba(0, 0, 0, 0.15)",
        },

        "&:hover": {
          transition: "all 0.3s ease-in-out",
          // border: "0.1rem solid var(--primary)",
          // transform: "translateY(-0.2rem)",
          borderColor: "var(--primary)",
          boxShadow: "0 0.4rem 1.2rem var(--shadow-color)",
          // borderLeft: "0.5rem solid var(--primary)",
        },
        // "@media (max-width: 768px)": {

        // },
      }}
    >
      <AccordionSummary
        expandIcon={
          <ToolTip title={expanded ? "Show less" : "Show more"}>
            <ExpandMoreIcon
              sx={{
                color: "#fff",
                background: "var(--primary)",
                fontSize: "2.5rem",
                borderRadius: "50%",
              }}
            />
          </ToolTip>
        }
        aria-controls={`panel${id}-content`}
        id={`panel${id}-header`}
        sx={{ transition: "all 0.3s ease-in-out", borderRadius: "1rem" }}
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
          <Box
            sx={{
              display: "flex",
              // alignItems: "center",
              gap: "0.5rem",
              flexDirection: "column",
            }}
          >
            <Box sx={{ display: "flex", gap: "1rem", alignItems: "center" }}>
              <Typography variant="h4" color="initial">
                <p
                  style={{
                    fontSize: "1.4rem",
                    fontWeight: "500",
                    color: "#747474",
                  }}
                >
                  Election ID: {id}
                </p>
                <p
                  style={{
                    fontSize: "1.8rem",
                    fontWeight: "700",
                    color: "var(--text-color)",
                  }}
                >
                  {electionTitle}
                </p>{" "}
              </Typography>
              <div
                style={{
                  background:
                    status === "Active"
                      ? "#06882d"
                      : status === "Upcoming"
                        ? "var(--primary)"
                        : status === "Closed"
                          ? "#ca0202"
                          : "",
                  padding: "0.5rem 1.2rem",
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
            <Typography variant="p" color="initial">
              <p style={{ color: "#747474" }}>{description}</p>
            </Typography>
          </Box>

          <div style={{ fontSize: "1.5rem", color: "var(--text-color)" }}>
            Created: {formatDateTime(dateCreated)}
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
              <Typography>
                <span
                  style={{
                    fontSize: "1.3rem",
                    opacity: 0.9,
                    fontWeight: "400",
                    color: "#fff",
                  }}
                >
                  Start Date:
                </span>
              </Typography>

              <Typography>
                <span
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: "600",
                    color: "#fff",
                  }}
                >
                  {formatDateTime(startDate)}
                </span>
              </Typography>
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
              <Typography>
                <span
                  style={{
                    fontSize: "1.3rem",
                    opacity: 0.9,
                    fontWeight: "400",
                    color: "#fff",
                    // color: "var(--text-color)",
                  }}
                >
                  End Date:
                </span>
              </Typography>

              <Typography>
                <span
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: "600",
                    color: "#fff",
                    // color: "var(--text-color)",
                  }}
                >
                  {formatDateTime(endDate)}
                </span>
              </Typography>
            </Box>
          </Box>
        </Box>
        {/* </Typography> */}
      </AccordionSummary>

      <AccordionDetails
        sx={{
          marginBottom: "2rem",
          transition: "all 0.3s ease-in-out",
          borderRadius: "0 0 1rem 1rem",
        }}
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
                  Election is{" "}
                  {status === "Active"
                    ? " currently open for voting"
                    : status === "Closed"
                      ? " currently closed"
                      : status === "Upcoming"
                        ? " yet to commence"
                        : ""}
                </p>
              </Box>
            </Box>

            <Box display="flex" alignItems="center" gap="2rem">
              {/* {<Button
                onClick={onChangeStatus}
                style={{
                  backgroundColor:
                    calculatedStatus === "Active"
                      ? "#ca0202"
                      : "var(--primary)",
                }}
              >
               
                {calculatedStatus === "Active" ? <StopIcon /> : <PlayIcon />}
                <Typography
                  sx={{
                    fontSize: "1.5rem",
                    fontWeight: "bold",
                    color: "#fff",
                  }}
                >
                  {calculatedStatus === "Active"
                    ? "End Election"
                    : "Start Election"}
                </Typography>
              </Button>} */}

              <Box
                sx={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
              >
                <ToolTip title="View/Edit election">
                  <IconButton
                    sx={{
                      width: "3.6rem",
                      height: "3.6rem",
                      border: "0.3rem solid #ffffff4d",
                      backgroundColor: " #007a25",
                      color: "var(--text-color)",
                      borderRadius: "1rem",
                      "&:hover": { backgroundColor: "#079b33" },
                    }}
                    onClick={() =>
                      onEditElection(
                        id,
                        electionTitle,
                        description,
                        // status,
                        dateCreated,
                        startDate,
                        endDate,
                      )
                    }
                  >
                    <Edit sx={{ fontSize: "1.8rem" }} />
                  </IconButton>
                </ToolTip>

                <ToolTip title="Delete election">
                  <IconButton
                    sx={{
                      width: "3.6rem",
                      height: "3.6rem",
                      border: "0.3rem solid #ffffff4d",
                      backgroundColor: "#ca0202",
                      color: "var(--text-color)",
                      borderRadius: "1rem",
                      "&:hover": { backgroundColor: "#f52b1cff" },
                    }}
                    onClick={() => onDeleteElection(id)}
                  >
                    <Delete sx={{ fontSize: "1.8rem" }} />
                  </IconButton>
                </ToolTip>
              </Box>
            </Box>
          </Box>

          <div style={{ margin: " 0 auto", maxWidth: "98vw", width: " 100%" }}>
            <PaginationTable
              key={id}
              columns={columns}
              rows={rows}
              onEdit={onEdit}
              onDelete={onDeleteCandidate}
              onAdd={onAdd}
            />
          </div>

          <div
            style={{ margin: "2rem auto", maxWidth: "98vw", width: " 100%" }}
          >
            <h2 style={{ color: "var(--text-color)" }}>
              Total Votes for Candidates
            </h2>

            <BarChartCompo
              candidatesRow={rows}
              // name="name"
              // total_vote="votes"
            />
          </div>
        </Box>
        <Typography sx={{ fontSize: "1.1rem" }}></Typography>
      </AccordionDetails>
    </Accordion>
    // </Card>
  );
}
AccordionExpandDefault.propTypes = {
  electionTitle: PropTypes.string,
  description: PropTypes.string,
  dateCreated: PropTypes.string,
  startDate: PropTypes.string,
  endDate: PropTypes.string,
  status: PropTypes.string,
  id: PropTypes.string,
  columns: PropTypes.array,
  rows: PropTypes.array,
  onEdit: PropTypes.func,
  onDeleteCandidate: PropTypes.func,
  onAdd: PropTypes.func,
  onChangeStatus: PropTypes.func,
  onDeleteElection: PropTypes.func,
  onEditElection: PropTypes.func,
  expanded: PropTypes.bool,
  onExpandChange: PropTypes.func,
  // onclickAccordion: PropTypes.func,
};
