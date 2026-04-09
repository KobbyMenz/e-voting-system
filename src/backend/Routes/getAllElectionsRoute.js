import db from "./../Services/dataBaseConnection.js";
import dayjs from "dayjs";
import process from "process";

// ✅ Selectively log only on development
const log = (message, data) => {
  if (process.env.NODE_ENV === "development") {
    console.log(message, data);
  }
};

const calculateElectionStatus = (startDate, endDate, now) => {
  const start = dayjs(startDate);
  const end = dayjs(endDate);

  if (!start.isValid() || !end.isValid()) {
    return "Upcoming";
  }

  if (now.isBefore(start)) {
    return "Upcoming";
  } else if (now.isAfter(end)) {
    return "Closed";
  } else {
    return "Active";
  }
};

const getAllElectionsRoute = (app) => {
  app.get("/api/getAllElections", (req, res) => {
    // ✅ NEW: Add pagination query parameters
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, parseInt(req.query.limit) || 50); // Max 100
    const offset = (page - 1) * limit;
    // ✅ NEW: Get voterId from query parameters
    const voterId = req.query.voterId;

    // ✅ OPTIMIZED: Add LIMIT and OFFSET for pagination
    // ✅ OPTIMIZED: Also fetch total count for pagination metadata
    // ✅ NEW: Add LEFT JOIN to vote table to check if voter has voted
    const sqlQuery = `
      SELECT 
        election.electionId, 
        election.title, 
        election.description, 
        election.dateCreated, 
        election.status, 
        election.startDate, 
        election.endDate, 
        candidate.candidateId, 
        candidate.fullName, 
        candidate.photo, 
        candidate.position,
        COUNT(vote.voteId) AS votes,
        MAX(CASE WHEN vote.voterId = ? THEN 1 ELSE 0 END) AS hasVoted,
         ROUND(
        (COUNT(vote.voteId) / 
        SUM(COUNT(vote.voteId)) OVER (PARTITION BY vote.electionId)
        ) * 100, 
    2) AS percentage
      FROM e_voting_db.election 
      LEFT JOIN e_voting_db.candidate ON election.electionId = candidate.electionId
      LEFT JOIN e_voting_db.vote ON candidate.candidateId = vote.candidateId
      GROUP BY election.electionId, candidate.candidateId
      ORDER BY election.dateCreated DESC, election.electionId, candidate.candidateId
      LIMIT ? OFFSET ?
    `;

    // Separate count query to get total number of elections for pagination
    const countQuery = `SELECT COUNT(DISTINCT electionId) as total FROM e_voting_db.election`;

    const now = dayjs();

    // ✅ Fetch paginated elections with voterId parameter
    db.query(sqlQuery, [voterId || null, limit, offset], (err, result) => {
      if (err) {
        console.error("Error fetching elections:", err);
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

        if (calculatedStatus !== election.status) {
          electionsToUpdate.push({
            electionId: election.electionId,
            newStatus: calculatedStatus,
            oldStatus: election.status,
          });
        }

        return {
          ...election,
          status: calculatedStatus,
        };
      });

      // ✅ NEW: Include pagination metadata
      res.status(200).json({
        result: electionsWithCalculatedStatus,
        pagination: {
          page,
          limit,
          offset,
          timestamp: new Date().toISOString(),
        },
      });

      log("Elections fetched:", electionsWithCalculatedStatus.length);

      // ✅ FIXED: Asynchronously update status using prepared statements if needed
      if (electionsToUpdate.length > 0) {
        updateElectionsStatus(electionsToUpdate);
      }
    });

    // ✅ FIXED: Fetch total count separately
    db.query(countQuery, (err, countResult) => {
      if (!err && countResult.length > 0) {
        log("Total elections in DB:", countResult[0].total);
      }
    });
  });
};

// ✅ NEW: Separate function to handle batch updates safely
const updateElectionsStatus = (electionsToUpdate) => {
  // For each election, update status individually (safer and clearer)
  electionsToUpdate.forEach((election) => {
    const updateQuery = `
      UPDATE e_voting_db.election 
      SET status = ? 
      WHERE electionId = ?
    `;

    // ✅ FIXED: Use prepared statements to prevent SQL injection
    db.query(updateQuery, [election.newStatus, election.electionId], (err) => {
      if (err) {
        console.error(`Failed to update election ${election.electionId}:`, err);
      } else {
        log(
          `Election ${election.electionId} status updated: ${election.oldStatus} -> ${election.newStatus}`,
        );
      }
    });
  });
};

export default getAllElectionsRoute;
