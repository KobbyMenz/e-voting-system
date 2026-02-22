import React from "react";
import Card from "../../UI/Card/Card";
import Button from "../../UI/Button/Button";
import { Box, Typography } from "@mui/material";
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
      <Card
        key={election._id || election.id}
        className={
          election.hasVoted ? `${classes.hasVoted}` : `${classes.content}`
        }
      >
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          flexWrap="wrap"
          gap="1rem"
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            {/*Election title*/}
            <h1>{election.title || "Election"}</h1>

            {/* Election status */}
            <span
              className={
                election.status === "Active"
                  ? `${classes.status} ${classes.active}`
                  : election.status === "Closed"
                    ? `${classes.status} ${classes.closed}`
                    : election.status === "Upcoming"
                      ? `${classes.status} ${classes.upcoming}`
                      : ""
              }
            >
              {election.status}
            </span>
          </Box>
        </Box>

        {/*Election description*/}
        <p className={classes.electionDescription}>
          {election.description || ""}
        </p>

        {election.hasVoted === true ? (
          <div className={classes.hasVoted_content}>
            <span>✓</span> <p>You have already voted in this election</p>
          </div>
        ) : (
          <div>
            <h2>Select a Candidate to Vote</h2>

            {election.candidates && election.candidates.length > 0 ? (
              <div className={classes.candidatesContainer}>
                {election.candidates.map((candidate) => {
                  const candidateId =
                    candidate._id || candidate.id || candidate.candidateId;
                  const isSelected =
                    selectedCandidates[election._id || election.id] ===
                    candidateId;

                  return (
                    <>
                      <div
                        key={candidateId}
                        className={`${classes.candidateCard} ${
                          isSelected ? classes.selected : ""
                        }`}
                        onClick={() => {
                          // election.status === "Closed";

                          //Preventing voter to vote when election status is closed
                          if (election.status === "Closed") {
                            Toast("error", "Election is closed");
                            return;
                          }

                          //Preventing voter to vote when election status is upcoming
                          if (election.status === "Upcoming") {
                            Toast("error", "Election is yet to commence");
                            return;
                          }

                          //Function to handle selected candidate
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
                          <ImageBox
                            src={candidate.image}
                            width="13rem"
                            height="14rem"
                            alt={candidate.name}
                          />

                          <Box>
                            <h2>{candidate.name}</h2>
                            <p>{candidate.position || "Candidate"}</p>
                          </Box>
                        </div>

                        {/* */}
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
              <p
                style={{
                  padding: "1.5rem",
                  background: "var(--primary)",
                  color:"#fff",
                  borderRadius: "0.5rem",
                  fontSize: "1.6rem",
                }}
              >
                No candidates available for this election
              </p>
            )}
          </div>
        )}

        <Typography variant="p">
          <p className={classes.electionDate}>
            Election Period: {formatDateTime(election.startDate)} to{" "}
            {formatDateTime(election.endDate)}
          </p>
        </Typography>

        <div className={classes.buttonContainer}>
          <Button
            className={classes.castVoteBtn}
            onClick={() =>
              handleCastVote(
                election._id || election.id
                
              )
            }
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
