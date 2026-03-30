import db from "./../Services/dataBaseConnection.js";
import dayjs from "dayjs";

// Function to calculate election status based on current time and update database if needed
///////////////////////////////////////////////////////////////
const calculateElectionStatus = (startDate, endDate, now) => {
  const start = dayjs(startDate);
  const end = dayjs(endDate);

  // Handle invalid dates gracefully by treating them as "Upcoming"
  if (!start.isValid() || !end.isValid()) {
    return "Upcoming";
  }

  // Determine status based on current time
  if (now.isBefore(start)) {
    return "Upcoming";
  } else if (now.isAfter(end)) {
    return "Closed";
  } else {
    return "Active";
  }
};
///////////////////////////////////////////////////////

const getAllElectionsRoute = (app) => {
  app.get("/api/getAllElections", (req, res) => {
    const sqlQuery = `SELECT election.electionId, election.title, election.description, election.dateCreated, election.status, election.startDate, election.endDate, candidate.candidateId, candidate.fullName, candidate.photo, candidate.position FROM e_voting_db.election LEFT JOIN e_voting_db.candidate ON election.electionId = candidate.electionId GROUP BY candidate.candidateId ORDER BY candidate.candidateId ASC`;
    const now = dayjs(); // Cache current time once

    db.query(sqlQuery, (err, result) => {
      if (err) {
        console.log("Error fetching data", err);
        return res.status(500).json({ error: "Database error" });
      }

      // Collect elections needing status updates
      const electionsToUpdate = [];
      const electionsWithCalculatedStatus = result.map((election) => {
        const calculatedStatus = calculateElectionStatus(
          election.startDate,
          election.endDate,
          now,
        );

        // If calculated status differs from current status, queue it for update
        if (calculatedStatus !== election.status) {
          electionsToUpdate.push({
            electionId: election.electionId,
            newStatus: calculatedStatus,
            oldStatus: election.status,
          });
        }

        // Return election data with calculated status for response
        return {
          ...election,
          status: calculatedStatus,
        };
      });

      // Send response immediately (non-blocking)
      res.status(200).json({
        result: electionsWithCalculatedStatus,
      });

      // Update database asynchronously in background (non-blocking)
      if (electionsToUpdate.length > 0) {
        // Build batch update query
        const updateCases = electionsToUpdate
          .map(
            (el) => `WHEN electionId = ${el.electionId} THEN '${el.newStatus}'`,
          )
          .join("\n");

        // Extract election IDs for WHERE clause
        const electionIds = electionsToUpdate
          .map((el) => el.electionId)
          .join(",");

        // Construct batch update query using CASE statement
        const batchUpdateQuery = `
          UPDATE e_voting_db.election
          SET status = CASE
            ${updateCases}
            ELSE status
          END
          WHERE electionId IN (${electionIds})
        `;

        // Execute batch update query
        db.query(batchUpdateQuery, (err) => {
          if (err) {
            console.error(
              `[getAllElections] Batch update error for ${electionsToUpdate.length} elections:`,
              err,
            );
          }
          //   else {
          //     console.log(
          //       `[getAllElections] Successfully batch updated ${electionsToUpdate.length} election(s)`,
          //     );
          //   }
        });
      }
    });
  });
};
export default getAllElectionsRoute;
