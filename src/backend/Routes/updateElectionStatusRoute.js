import db from "../Services/dataBaseConnection.js";

const updateElectionStatusRoute = (app) => {
  app.put("/api/updateElectionStatus/:id", (req, res) => {
    const electionId = req.params.id;
    const { status } = req.body;

    // Log incoming request for debugging
    console.log(
      `[UPDATE ELECTION STATUS] ID: ${electionId}, New Status: ${status}`,
    );

    // Validate parameters
    if (!electionId || !status) {
      return res.status(400).json({ error: "Missing electionId or status" });
    }

    const sqlUpdate = `UPDATE e_voting_db.election SET status = ? WHERE electionId = ?`;

    db.query(sqlUpdate, [status, electionId], (err, result) => {
      if (err) {
        console.error(`[ERROR] Failed to update election ${electionId}:`, err);
        return res.status(500).json({ error: "Status cannot be changed!" });
      }

      console.log(
        `[SUCCESS] Election ${electionId} status updated to ${status}. Affected rows: ${result.affectedRows}`,
      );

      res.status(200).json({
        message: `Status changed successfully`,
        affectedRows: result.affectedRows,
      });
    });
  });
};
export default updateElectionStatusRoute;
