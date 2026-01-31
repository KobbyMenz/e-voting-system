import { Box } from "@mui/material";
import Button from "../../UI/Button/Button";
import Card from "../../UI/Card/Card";
import classes from "../VoterDashboard/VoterDashboard.module.css";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import app_api_url from "../../../app_api_url";
import Toast from "../../UI/Notification/Toast";
import ImageBox from "../../UI/ImageBox/ImageBox";
import Loader from "../../UI/Loader/Loader";
import ElectionCard from "../../UI/ElectionCard/ElectionCard";

const VoterDashboardContent = () => {
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const token = JSON.parse(sessionStorage.getItem("token"));
  const [elections, setElections] = useState([
    {
      id: 1,
      title: "SRC Presidential",
      description: "Namong SRC Presidential Election",
      status: "Active",
      startDate: "2026-01-30 07:00:00",
      endDate: "2026-02-27 19:00:00",
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
      startDate: "2026-02-23 07:00:00",
      endDate: "2026-02-27 19:00:00",
      candidates: [
        {
          candidateId: 1,
          name: "John Doe",
          image: "",
          position: "Dinning Hall Prefect",
        },
        {
          candidateId: 2,
          name: "Jane Smith",
          image: "",
          position: "Dinning Hall Prefect",
        },
      ],
    },

    {
      id: 3,
      title: "Sanitation Prefect",
      description: "Namong Sanitation Prefect Election",
      status: "Active",
      startDate: "2026-02-23 07:00:00",
      endDate: "2026-02-27 19:00:00",
      candidates: [
        // {
        //   candidateId: 1,
        //   name: "John Doe",
        //   image: "",
        //   position: "Dinning Hall Prefect",
        // },
        // {
        //   candidateId: 2,
        //   name: "Jane Smith",
        //   image: "",
        //   position: "Dinning Hall Prefect",
        // },
      ],
    },
  ]);

  const [selectedCandidates, setSelectedCandidates] = useState({});
  const [loading, setLoading] = useState(true);
  // const [votingInProgress, setVotingInProgress] = useState(false);
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

  //////////////////////////////////////////////////
  // Handle voting for a specific election
  /////////////////////////////////////////////////
  const handleCastVote = useCallback(
    (electionId) => {
      if (!selectedCandidates[electionId]) {
        Toast("warning", "Please select a candidate first");
        return;
      }
      setCurrentElectionId(electionId);
      // setVotingInProgress(true);

      if (window.confirm("Are you sure you want to cast your vote?")) {
        const castVote = async () => {
          try {
            // setVotingInProgress(false);
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
            Toast(
              "error",
              err.response?.data?.message || "Failed to cast vote",
            );
            //setVotingInProgress(false);
          }
        };
        castVote();
      }
    },
    [currentElectionId, selectedCandidates, token],
  );

  // Confirm vote after clicking cast vote
  // const handleConfirmVote = async () => {};

  // const handleCloseVoteModal = () => {
  //   setVotingInProgress(false);
  // };
  return (
    <>
      {/* {votingInProgress && (
        <QuestionModal
          onConfirm={handleConfirmVote}
          onCloseModal={handleCloseVoteModal}
        />
      )} */}

      {loading ? (
        <Loader />
      ) : (
        <Card className={classes.card}>
          <h1>Voter Dashboard</h1>
          <Card className={classes.userInfo}>
            <h2>Welcome, {user.name || "Guest"}!</h2>
            <p>Voter ID: {user.voterId || "N/A"}</p>
          </Card>

          {elections.length === 0 ? (
            <p>No elections available</p>
          ) : (
            elections.map((election) => (
              <ElectionCard
                key={election._id || election.id}
                election={election}
                selectedCandidates={selectedCandidates}
                handleSelectCandidate={handleSelectCandidate}
                handleCastVote={handleCastVote}
              />
            ))
          )}
        </Card>
      )}
    </>
  );
};
export default VoterDashboardContent;
