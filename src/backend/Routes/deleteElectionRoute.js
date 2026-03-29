import db from "./../Services/dataBaseConnection.js";

const deleteElectionRoute = (app) => {
  app.delete("/api/deleteElection/:electionId", (req, res) => {
    const electionId = req.params.electionId;
    // console.log("id Request received: ", req.params.userId);
    // console.log("pass Request received: ", req.body);

    //const profilePicturePath = `/public/uploads/${req.file.filename}`;

    const sqlDelete = `DELETE FROM e_voting_db.election WHERE electionId = ? `;

    db.query(sqlDelete, [electionId], (err) => {
      if (err) {
        // console.log("Database error", err);
        return res.status(500).send("Error deleting election"); //returning HTTP status
      }

      res.status(200).json({ message: "Election deleted successfully" });
      // console.log(result);
    });
  });
};
export default deleteElectionRoute;
