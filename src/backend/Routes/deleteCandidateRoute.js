import db from "./../Services/dataBaseConnection.js";

const deleteCandidateRoute = (app) => {
  app.delete("/api/deleteCandidate/:id", (req, res) => {
    const id = req.params.id;

    const sqlDelete = `DELETE FROM e_voting_db.candidate WHERE candidateId = ? `;

    db.query(sqlDelete, [id], (err) => {
      if (err) {
        // console.log("Database error", err);
        return res.status(500).send("Error deleting candidate"); //returning HTTP status
      }

      res.status(200).json({ message: "Candidate deleted successfully" });
      // console.log(result);
    });
  });
};
export default deleteCandidateRoute;
