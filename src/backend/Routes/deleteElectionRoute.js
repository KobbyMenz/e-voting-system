import db from "./../Services/dataBaseConnection.js";

const deleteElectionRoute = (app) => {
  app.delete("/api/deleteElection/:electionId", (req, res) => {
    const electionId = req.params.electionId;

    // ✅ CRITICAL FIX: Validate id parameter
    if (!electionId || electionId.trim().length === 0) {
      return res.status(400).json({ error: "Invalid election ID" });
    }

    const sqlDelete = `DELETE FROM e_voting_db.election WHERE electionId = ?`;

    db.query(sqlDelete, [electionId], (err) => {
      if (err) {
        console.error("Database operation failed");
        return res.status(500).json({ error: "Unable to delete election" });
      }

      res.status(200).json({ message: "Election deleted successfully" });
      // console.log(result);
    });
  });
};
export default deleteElectionRoute;
