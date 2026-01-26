import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PropTypes from "prop-types";
import PaginationTable from "../PaginationTable/PaginationTable";
import { Box } from "@mui/material";
import Button from "../Button/Button";

export default function AccordionExpandDefault({
  electionTitle,
  status,
  dateCreated,
  id,
  columns,
  rows,
  onEdit,
  onDelete,
  onAdd,
  onChangeStatus,
}) {
  return (
    <div>
      <Accordion
        sx={{
          borderBottom: "0.2rem solid #ccc",
          borderRadius: "2rem",
          boxShadow: "0rem 0.2rem 1rem rgba(0, 0, 0, 0.25)",
          "@media (max-width: 600px)": {
            borderRadius: "1rem",
            boxShadow: "0rem 0.1rem 0.5rem rgba(0, 0, 0, 0.15)",
          },
          "@media (max-width: 768px)": {
            borderRadius: "1.5rem",
          },
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
        >
          <Typography
            component="span"
            sx={{
              fontSize: "1.8rem",
              fontWeight: "bold",
              "@media (max-width: 600px)": {
                fontSize: "1.2rem",
              },
              "@media (max-width: 768px)": {
                fontSize: "1.5rem",
              },
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "4rem",
                "@media (max-width: 600px)": {
                  gap: "0.3rem",
                  flexDirection: "row",
                },
                "@media (max-width: 768px)": {
                  gap: "2rem",
                },
              }}
            >
              <div>{electionTitle}</div>{" "}
              <div
                style={{
                  background:
                    status === "Active" ? "var(--primary)" : "#ca0202",
                  padding: "0.2rem 1rem",
                  fontSize: "1.4rem",
                  borderRadius: "0.5rem",
                  height: "fit-content",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                }}
              >
                {status}
              </div>{" "}
              <div style={{ fontSize: "1.5rem" }}>Created: {dateCreated}</div>
            </Box>
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ marginBottom: "2rem" }}>
          <Box>
            <Box
              sx={{
                display: "flex",
                gap: "2rem",
                padding: "2rem",
                border: "0.1rem solid var(--bg-color)",
                borderRadius: "1rem",
                alignItems: "center",
                flexWrap: "wrap",
                marginBottom: "2rem",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  gap: "2rem",
                  alignItems: "center",
                }}
              >
                <h2>Status Control:</h2>
                <p>
                  Election is currently{" "}
                  {status === "Active" ? "open for voting" : "closed"}
                </p>
              </Box>

              <Button
                onClick={onChangeStatus}
                style={{
                  backgroundColor: status === "Active" ? "#ca0202" : "#06882d",
                }}
              >
                <Typography
                  sx={{ fontSize: "1.5rem", fontWeight: "bold", color: "#fff" }}
                >
                  {status === "Active" ? "End Election" : "Start Election"}
                </Typography>
              </Button>
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

      {/* <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2-content"
          id="panel2-header"
        >
          <Typography component="span">Header</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
            malesuada lacus ex, sit amet blandit leo lobortis eget.
          </Typography>
        </AccordionDetails>
      </Accordion> */}
    </div>
  );
}
AccordionExpandDefault.propTypes = {
  electionTitle: PropTypes.string,
  dateCreated: PropTypes.string,
  status: PropTypes.string,
  id: PropTypes.string,
  columns: PropTypes.array,
  rows: PropTypes.array,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  onAdd: PropTypes.func,
  onChangeStatus: PropTypes.func,
};
