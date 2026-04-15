import { Box } from "@mui/material";
//import Button from "../../UI/Button/Button";
import Card from "../../UI/Card/Card";
import classes from "../VoterDashboard/VoterDashboard.module.css";
import { useCallback, useEffect, useMemo, useState } from "react";
//import axios from "axios";
import app_api_url from "../../../app_api_url";
import Toast from "../../UI/Notification/Toast";
// import ImageBox from "../../UI/ImageBox/ImageBox";
// import Loader from "../../UI/Loader/Loader";
import ElectionCard from "../../UI/ElectionCard/ElectionCard";
import formatName from "../../Functions/formatName";
import useFetch from "../../CustomHooks/useFetch";
import { authLocalStorage } from "../../Utils/authLocalStorage";
import useInsertHook from "../../CustomHooks/useInsertHook";
import VoterDashboardSkeleton from "../../UI/Skeleton/VoterDashboardSkeleton";

// Function to create a new election instance with candidates
const createElectionInstance = (
  electionId,
  title,
  description,
  dateCreated,
  status,
  startDate,
  endDate,
  candidates = [],
  hasVoted = false, // Add hasVoted parameter
) => ({
  id: electionId,
  _id: electionId, // Keep both for compatibility
  title: title,
  description: description,
  dateCreated: dateCreated,
  status: status,
  startDate: startDate,
  endDate: endDate,
  hasVoted: hasVoted, // Include hasVoted in election object
  candidates: candidates.map((candidate, index) => ({
    sn: index + 1,
    id: candidate.candidateId || `candidate-${index}`,
    _id: candidate.candidateId, // Keep both for compatibility
    image: candidate.photo ? `${candidate.photo}` : "", // Maps database photo to image
    name: candidate.fullName || "N/A",
    position: candidate.position ? candidate.position : "N/A",
    votes: candidate.votes ? candidate.votes : 0,
  })),
});

const VoterDashboardContent = () => {
  const user = authLocalStorage() || {};
  const [selectedCandidates, setSelectedCandidates] = useState({});
  const [loading, setLoading] = useState(true);

  const { insertData } = useInsertHook(); // Custom hook for inserting data (casting vote)
  // Pass voterId to API
  const { data, setRefetch } = useFetch(
    `${app_api_url}/getAllElections?voterId=${user?.userId || ""}`,
    60000, // Changed from 1000 (every 1 second) to 60000 (every 60 seconds) - 98% reduction in API calls!
  );

  // Only show skeleton on first load, not on polling refreshes
  useEffect(() => {
    if (data !== null) {
      setLoading(false);
    }
  }, [data]);

  //Refetch data handler
  const refetchHandler = useCallback(() => {
    setRefetch((prev) => !prev);
  }, [setRefetch]);

  //Getting all users details
  const allElections = useMemo(() => (data !== null ? data : []), [data]);

  // Group candidates by election ID - SORTED by creation order
  const candidatesByElection = useMemo(() => {
    const grouped = {};
    if (Array.isArray(allElections)) {
      allElections.forEach((row) => {
        if (!grouped[row.electionId]) {
          grouped[row.electionId] = [];
        }
        // Only add candidate if it exists (not null from LEFT JOIN)
        if (row.candidateId) {
          grouped[row.electionId].push(row);
        }
      });

      // Sort candidates within each election by their position in the data (order added)
      Object.keys(grouped).forEach((electionId) => {
        grouped[electionId].sort((a, b) => {
          // If both have a date field, sort by it; otherwise maintain data order
          if (a.dateAdded && b.dateAdded) {
            return (
              new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime()
            );
          }
          return 0;
        });
      });
    }
    return grouped;
  }, [allElections]);

  // Get unique elections - SORTED by dateCreated (oldest first)
  // Ensure hasVoted is preserved from any candidate row for that election
  const uniqueElections = useMemo(() => {
    if (!Array.isArray(allElections)) return [];
    const seen = new Map(); // Changed to Map to store the full election object

    // Iterate through allElections and store the full election object in the Map
    allElections.forEach((election) => {
      if (!seen.has(election.electionId)) {
        seen.set(election.electionId, election);
      } else {
        // If we've seen this election before, update hasVoted if it's true in the current row
        const existing = seen.get(election.electionId);
        if (election.hasVoted && !existing.hasVoted) {
          existing.hasVoted = election.hasVoted;
        }
      }
    });

    // Convert Map values to an array of unique elections
    const unique = Array.from(seen.values());

    // Sort by dateCreated (ascending - oldest/first created first)
    return unique.sort(
      (a, b) =>
        new Date(a.dateCreated).getTime() - new Date(b.dateCreated).getTime(),
    );
  }, [allElections]);

  // Transform database elections into component election instances
  const election = useMemo(
    () =>
      uniqueElections.map((electionRow) =>
        // Pass the raw candidate rows for this election to createElectionInstance, which will handle mapping to the correct format
        createElectionInstance(
          electionRow.electionId,
          electionRow.title,
          electionRow.description,
          electionRow.dateCreated,
          electionRow.status,
          electionRow.startDate,
          electionRow.endDate,
          candidatesByElection[electionRow.electionId] || [], // Pass raw candidates, let createElectionInstance handle mapping
          electionRow.hasVoted, // Pass hasVoted from backend
        ),
      ),
    [uniqueElections, candidatesByElection],
  );

  // Deselect candidate when election status becomes Closed
  useEffect(() => {
    setSelectedCandidates((prevSelected) => {
      const updated = { ...prevSelected };
      let hasChanges = false;

      // Loop through elections and remove selected candidate if election is closed
      election.forEach((election) => {
        if (election.status === "Closed" && updated[election._id]) {
          delete updated[election._id];
          hasChanges = true;
        }
      });

      return hasChanges ? updated : prevSelected;
    });
  }, [election]);

  // Handle candidate selection per election
  const handleSelectCandidate = (electionId, candidateId) => {
    setSelectedCandidates({
      // ...prev,
      [electionId]: candidateId,
    });
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

      // Basic validation before casting vote
      if (
        +electionId.length === 0 ||
        +selectedCandidates[electionId].length === 0 ||
        +authLocalStorage().userId.length === 0
      ) {
        Toast("error", "Failed to cast vote");
        return;
      }

      //setCurrentElectionId(electionId);
      // setVotingInProgress(true);

      if (
        window.confirm(
          "Are you sure you want to vote for this candidate? This action cannot be undone.",
        )
      ) {
        const voteData = {
          electionId: electionId,
          candidateId: selectedCandidates[electionId],
          voterId: authLocalStorage().userId,
        };

        // Cast the vote into database using the insertData function from useInsertHook
        insertData(`insertVote`, voteData, Toast, refetchHandler);
      }
    },
    [selectedCandidates, insertData, refetchHandler],
  );

  return (
    <>
      {/* {votingInProgress && (
        <QuestionModal
          onConfirm={handleConfirmVote}
          onCloseModal={handleCloseVoteModal}
        />
      )} */}

      {loading ? (
        <VoterDashboardSkeleton />
      ) : (
        <Card className={classes.card}>
          <h1>Voter Dashboard</h1>
          <Card className={classes.userInfo}>
            <h1>
              Welcome back {formatName(user.fullName) || "Guest"}, Please cast
              your vote now.
            </h1>
            <p>Voter ID: {user.userId || "N/A"}</p>
          </Card>

          {election.length === 0 ? (
            <p>No elections available</p>
          ) : (
            election.map((election) => (
              <ElectionCard
                key={election.id}
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
