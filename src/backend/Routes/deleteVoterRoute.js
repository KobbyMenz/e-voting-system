import db from "./../Services/dataBaseConnection.js";

const deleteVoterRoute = (app) => {
  app.delete("/api/deleteVoter/:id", (req, res) => {
    const id = req.params.id;

    // ✅ CRITICAL FIX: Validate id parameter
    if (!id || id.trim().length === 0) {
      return res.status(400).json({ error: "Invalid voter ID" });
    }

    const sqlDelete = `DELETE FROM e_voting_db.voter WHERE voterId = ?`;

    db.query(sqlDelete, [id], (err) => {
      if (err) {
        console.error("Database operation failed");
        return res.status(500).json({ error: "Unable to delete voter" });
      }

      res.status(200).json({ message: "Voter deleted successfully" });
      // console.log(result);
    });
  });
};
export default deleteVoterRoute;
