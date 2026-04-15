import db from "./../Services/dataBaseConnection.js";
import { deleteImageFile } from "../Services/fileDeleteService.js";

const deleteVoterRoute = (app) => {
  app.delete("/api/deleteVoter/:id", async (req, res) => {
    const id = req.params.id;

    // ✅ CRITICAL FIX: Validate id parameter
    if (!id || id.trim().length === 0) {
      return res.status(400).json({ error: "Invalid voter ID" });
    }

    try {
      // ✅ STEP 1: Fetch voter data to get photo path (if exists)
      const sqlSelect =
        "SELECT voterId, photo FROM e_voting_db.voter WHERE voterId = ?";

      db.query(sqlSelect, [id], async (err, result) => {
        if (err) {
          console.error("Database error:", err);
          return res.status(500).json({ error: "Unable to retrieve voter" });
        }

        if (!result || result.length === 0) {
          return res.status(404).json({ error: "Voter not found" });
        }

        const voterPhoto = result[0].photo;

        // ✅ STEP 2: Delete physical image file if exists
        if (voterPhoto) {
          const deleteResult = await deleteImageFile(voterPhoto);
          if (!deleteResult.success) {
            console.warn(`⚠️ File deletion warning: ${deleteResult.message}`);
            // Continue with database deletion even if file deletion fails
          }
        }

        // ✅ STEP 3: Delete voter from database
        const sqlDelete = `DELETE FROM e_voting_db.voter WHERE voterId = ?`;

        db.query(sqlDelete, [id], (err) => {
          if (err) {
            console.error("Database operation failed:", err);
            return res.status(500).json({ error: "Unable to delete voter" });
          }

          res.status(200).json({
            success: true,
            message: "Voter deleted successfully",
            fileDeleted: voterPhoto ? true : false,
          });
        });
      });
    } catch (error) {
      console.error("Error in deleteVoterRoute:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
};

export default deleteVoterRoute;
