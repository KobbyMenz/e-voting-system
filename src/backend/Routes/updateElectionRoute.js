import db from "../Services/dataBaseConnection.js";
//import dayjs from "dayjs";

const updateElectionRoute = (app) => {
  //const upload = staticStorage();

  app.put("/api/updateElection/:electionId", (req, res) => {
    const electionId = req.params.electionId;
    const { title, description, startDate, endDate } = req.body;

    // ✅ CRITICAL FIX: Validate electionId
    if (!electionId || electionId.trim().length === 0) {
      return res.status(400).json({ error: "Invalid election ID" });
    }

    // ✅ CRITICAL FIX: Validate required fields
    if (!title || !startDate || !endDate) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // ✅ CRITICAL FIX: Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({ error: "Invalid date format" });
    }
    if (end <= start) {
      return res
        .status(400)
        .json({ error: "End date must be after start date" });
    }

    const sqlInsert =
      "UPDATE e_voting_db.election SET title = ?, description = ?, startDate = ?, endDate = ? WHERE electionId = ?";
    db.query(
      sqlInsert,
      [title, description, startDate, endDate, electionId],
      (err) => {
        if (err) {
          console.error("Database operation failed");
          return res.status(500).json({ error: "Unable to update election" });
        }

        res.status(201).json({ message: "Election updated successfully" });
        // console.log(result);
      },
    );
  });
};
export default updateElectionRoute;
