import db from "./../Services/dataBaseConnection.js";
import { deleteImageFile } from "../Services/fileDeleteService.js";

const deleteCandidateRoute = (app) => {
  app.delete("/api/deleteCandidate/:id", async (req, res) => {
    const id = req.params.id;

    // ✅ CRITICAL FIX: Validate id parameter
    if (!id || id.trim().length === 0) {
      return res.status(400).json({ error: "Invalid candidate ID" });
    }

    try {
      // ✅ STEP 1: Fetch candidate data to get photo path
      const sqlSelect =
        "SELECT candidateId, photo FROM e_voting_db.candidate WHERE candidateId = ?";

      db.query(sqlSelect, [id], async (err, result) => {
        if (err) {
          console.error("Database error:", err);
          return res
            .status(500)
            .json({ error: "Unable to retrieve candidate" });
        }

        if (!result || result.length === 0) {
          return res.status(404).json({ error: "Candidate not found" });
        }

        const candidatePhoto = result[0].photo;

        // ✅ STEP 2: Delete physical image file if exists
        if (candidatePhoto) {
          const deleteResult = await deleteImageFile(candidatePhoto);
          if (!deleteResult.success) {
            console.warn(`⚠️ File deletion warning: ${deleteResult.message}`);
            // Continue with database deletion even if file deletion fails
          }
        }

        // ✅ STEP 3: Delete candidate from database
        const sqlDelete =
          "DELETE FROM e_voting_db.candidate WHERE candidateId = ?";

        db.query(sqlDelete, [id], (err) => {
          if (err) {
            console.error("Database operation failed:", err);
            return res
              .status(500)
              .json({ error: "Unable to delete candidate" });
          }

          res.status(200).json({
            success: true,
            message: "Candidate deleted successfully",
            fileDeleted: candidatePhoto ? true : false,
          });
        });
      });
    } catch (error) {
      console.error("Error in deleteCandidateRoute:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
};

export default deleteCandidateRoute;
