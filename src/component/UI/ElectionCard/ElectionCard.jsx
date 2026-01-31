import React from "react";
import Card from "../../UI/Card/Card";
import Button from "../../UI/Button/Button";
import { Box } from "@mui/material";
import classes from "../ElectionCard/ElectionCard.module.css";
import Toast from "../../UI/Notification/Toast";
import ImageBox from "../../UI/ImageBox/ImageBox";
import PropTypes from "prop-types";
import formatDateTime from "../../Functions/formatDateTime";

const ElectionCard = ({
  election,
  selectedCandidates,
  handleSelectCandidate,
  handleCastVote,
}) => {
  return (
    <>
      <Card key={election._id || election.id} className={classes.content}>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          flexWrap="wrap"
          gap="1rem"
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <h1>{election.title || "Election"}</h1>

            <span
              className={
                election.status === "Active"
                  ? `${classes.status} ${classes.active}`
                  : `${classes.status} ${classes.closed}`
              }
            >
              {election.status}
            </span>
          </Box>

          <Box>
            <div
              style={{ fontSize: "1.2rem", fontWeight: "500", opacity: 0.8 }}
            >
              Election Period:{" "}
              <strong>
                <em>{formatDateTime(election.startDate)}</em>
              </strong>{" "}
              to{" "}
              <strong>
                <em>{formatDateTime(election.endDate)}</em>
              </strong>
            </div>
          </Box>
        </Box>

        <p className={classes.electionDescription}>
          {election.description || ""}
        </p>

        <h2>Select a Candidate to Vote</h2>

        {election.candidates && election.candidates.length > 0 ? (
          <div className={classes.candidatesContainer}>
            {election.candidates.map((candidate) => {
              const candidateId =
                candidate._id || candidate.id || candidate.candidateId;
              const isSelected =
                selectedCandidates[election._id || election.id] === candidateId;

              return (
                <>
                  <div
                    key={candidateId}
                    className={`${classes.candidateCard} ${
                      isSelected ? classes.selected : ""
                    }`}
                    onClick={() => {
                      election.status === "Closed";
                      if (election.status === "Closed") {
                        Toast("error", "Election is closed");
                        return;
                      }

                      handleSelectCandidate(
                        election._id || election.id,
                        candidateId,
                      );
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    <div className={classes.radioButton}>
                      {isSelected && (
                        <div className={classes.radioButtonInner} />
                      )}
                    </div>

                    <div className={classes.candidateInfo}>
                      <ImageBox src={candidate.image} width="13rem" height="14rem" alt={candidate.name} />

                      <Box>
                        <h2>{candidate.name}</h2>
                        <p>{candidate.position || "Candidate"}</p>
                      </Box>
                    </div>

                    {isSelected && (
                      <div className={classes.selectIndicator}>
                        {isSelected ? (
                          <span className={classes.selectedCheck}>✓</span>
                        ) : null}
                      </div>
                    )}
                  </div>
                </>
              );
            })}
          </div>
        ) : (
          <p>No candidates available for this election</p>
        )}

        <div className={classes.buttonContainer}>
          <Button
            className={classes.castVoteBtn}
            onClick={() => handleCastVote(election._id || election.id)}
            disabled={!selectedCandidates[election._id || election.id]}
          >
            Cast Your Vote
          </Button>
        </div>
      </Card>
    </>
  );
};
ElectionCard.propTypes = {
  election: PropTypes.object.isRequired,
  selectedCandidates: PropTypes.object.isRequired,
  handleSelectCandidate: PropTypes.func.isRequired,
  handleCastVote: PropTypes.func.isRequired,
};
export default ElectionCard;
