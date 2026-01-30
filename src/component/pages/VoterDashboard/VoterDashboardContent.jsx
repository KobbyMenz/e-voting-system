import { Box } from "@mui/material";
import Button from "../../UI/Button/Button";
import Card from "../../UI/Card/Card";
import classes from "../VoterDashboard/VoterDashboard.module.css";
import { useEffect, useState } from "react";
import axios from "axios";
import app_api_url from "../../../app_api_url";
import Toast from "../../UI/Notification/Toast";
import ImageBox from "../../UI/ImageBox/ImageBox";
import QuestionModal from "../../UI/Modals/QuestionModal";

const VoterDashboardContent = () => {
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const token = JSON.parse(sessionStorage.getItem("token"));
  const [elections, setElections] = useState([
    {
      id: 1,
      title: "SRC Presidential",
      description: "Namong SRC Presidential Election",
      status: "Active",
      candidates: [
        {
          candidateId: 1,
          name: "John Doe",
          image: "",
          position: "President",
        },
        {
          candidateId: 2,
          name: "Jane Smith",
          image: "",
          position: "President",
        },
      ],
    },

    {
      id: 2,
      title: "Dinning Hall Prefect",
      description: "Namong Dinning Hall Election",
      status: "Closed",
      candidates: [
        {
          candidateId: 1,
          name: "John Doe",
          image: "",
          position: "President",
        },
        {
          candidateId: 2,
          name: "Jane Smith",
          image: "",
          position: "President",
        },
      ],
    },
  ]);

  const [selectedCandidates, setSelectedCandidates] = useState({});
  const [loading, setLoading] = useState(true);
  const [votingInProgress, setVotingInProgress] = useState(false);
  const [currentElectionId, setCurrentElectionId] = useState(null);

  // Fetch elections and candidates from backend
  useEffect(() => {
    const fetchElections = async () => {
      try {
        const response = await axios.get(`${app_api_url}/elections`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        setElections(response.data.elections || []);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching elections:", err);
        Toast("error", "Failed to load elections");
        setLoading(false);
      }
    };

    fetchElections();
  }, [token]);

  // Handle candidate selection per election
  const handleSelectCandidate = (electionId, candidateId) => {
    setSelectedCandidates((prev) => ({
      ...prev,
      [electionId]: candidateId,
    }));
  };

  // Handle voting for a specific election
  const handleCastVote = (electionId) => {
    if (!selectedCandidates[electionId]) {
      Toast("warning", "Please select a candidate first");
      return;
    }
    setCurrentElectionId(electionId);
    setVotingInProgress(true);
  };

  // Confirm vote after clicking cast vote
  const handleConfirmVote = async () => {
    try {
      setVotingInProgress(false);
      const response = await axios.post(
        `${app_api_url}/vote`,
        {
          electionId: currentElectionId,
          candidateId: selectedCandidates[currentElectionId],
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (response.data.success) {
        Toast("success", "Your vote has been recorded successfully!");
        setSelectedCandidates((prev) => ({
          ...prev,
          [currentElectionId]: null,
        }));
      }
    } catch (err) {
      Toast("error", err.response?.data?.message || "Failed to cast vote");
      setVotingInProgress(false);
    }
  };

  const handleCloseVoteModal = () => {
    setVotingInProgress(false);
  };
  return (
    <>
      {votingInProgress && (
        <QuestionModal
          onConfirm={handleConfirmVote}
          onCloseModal={handleCloseVoteModal}
        />
      )}

      <Card className={classes.card}>
        <h1>Voter Dashboard</h1>
        <Card className={classes.userInfo}>
          <h2>Welcome, {user.name || "Guest"}!</h2>
          <p>Voter ID: {user.voterId || "N/A"}</p>
        </Card>

        {loading ? (
          <p>Loading elections...</p>
        ) : elections.length === 0 ? (
          <p>No elections available</p>
        ) : (
          elections.map((election) => (
            <Card key={election._id || election.id} className={classes.content}>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
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
                      selectedCandidates[election._id || election.id] ===
                      candidateId;

                    return (
                      <div
                        key={candidateId}
                        className={`${classes.candidateCard} ${
                          isSelected ? classes.selected : ""
                        }`}
                        onClick={() => {
                          console.log("Clicked candidate:", candidateId);
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
                            alt={candidate.name}
                          />

                          <Box>
                            <h2>{candidate.name}</h2>
                            <p>{candidate.position || "Candidate"}</p>
                          </Box>
                        </div>

                        <div className={classes.selectIndicator}>
                          {isSelected ? (
                            <span className={classes.selectedCheck}>✓</span>
                          ) : null}
                        </div>
                      </div>
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
          ))
        )}
      </Card>
    </>
  );
};
export default VoterDashboardContent;
