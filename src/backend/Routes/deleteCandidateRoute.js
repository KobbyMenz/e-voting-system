import db from "./../Services/dataBaseConnection.js";

const deleteCandidateRoute = (app) => {
  app.delete("/api/deleteCandidate/:id", (req, res) => {
    const id = req.params.id;

    // ✅ CRITICAL FIX: Validate id parameter
    if (!id || id.trim().length === 0) {
      return res.status(400).json({ error: "Invalid candidate ID" });
    }

    const sqlDelete = `DELETE FROM e_voting_db.candidate WHERE candidateId = ?`;

    db.query(sqlDelete, [id], (err) => {
      if (err) {
        console.error("Database operation failed");
        return res.status(500).json({ error: "Unable to delete candidate" });
      }

      res.status(200).json({ message: "Candidate deleted successfully" });
      // console.log(result);
    });
  });
};
export default deleteCandidateRoute;
