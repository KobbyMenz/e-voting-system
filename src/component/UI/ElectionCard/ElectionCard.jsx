import React from "react";
import Card from "../../UI/Card/Card";
import Button from "../../UI/Button/Button";
import { Box } from "@mui/material";
import classes from "../ElectionCard/ElectionCard.module.css";
import Toast from "../../UI/Notification/Toast";
import ImageBox from "../../UI/ImageBox/ImageBox";
import PropTypes from "prop-types";

const ElectionCard = ({
  election,
  selectedCandidates,
  handleSelectCandidate,
  handleCastVote,
}) => {
  return (
    <>
      <Card key={election._id || election.id} className={classes.content}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <h1>{election.title || "Election"}</h1>

          <div
            className={
              election.status === "Active"
                ? `${classes.status} ${classes.active}`
                : `${classes.status} ${classes.closed}`
            }
          >
            {election.status}
          </div>
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
                      //console.log("Clicked candidate:", candidateId);
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
                      <ImageBox src={candidate.image} alt={candidate.name} />

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
