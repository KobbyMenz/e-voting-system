import db from "../Services/dataBaseConnection.js";
import staticStorage from "../Services/staticStorage.js";
import { deleteImageFile } from "../Services/fileDeleteService.js";

const deleteProfilePhotoRoute = (app) => {
  const upload = staticStorage();

  app.put(
    "/api/deleteProfilePhoto/:userId",
    upload.single("photo"),
    async (req, res) => {
      const userId = req.params.userId;

      try {
        // ✅ STEP 1: Fetch current photo path from database
        const sqlSelect =
          "SELECT photo FROM e_voting_db.admin WHERE userId = ?";

        db.query(sqlSelect, [userId], async (err, result) => {
          if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Database query failed" });
          }

          if (!result || result.length === 0) {
            return res.status(404).json({ error: "User not found" });
          }

          const currentPhotoPath = result[0].photo;

          // ✅ STEP 2: Delete physical file if it exists
          if (currentPhotoPath) {
            const deleteResult = await deleteImageFile(currentPhotoPath);
            if (!deleteResult.success) {
              console.warn(`⚠️ File deletion warning: ${deleteResult.message}`);
              // Continue with database update even if file deletion fails
            }
          }

          // ✅ STEP 3: Update database to remove photo reference
          const sqlUpdate =
            "UPDATE e_voting_db.admin SET photo = NULL WHERE userId = ?";

          db.query(sqlUpdate, [userId], (err) => {
            if (err) {
              console.error("Database error:", err);
              return res
                .status(500)
                .json({ error: "Failed to update database" });
            }

            res.status(200).json({
              success: true,
              message: "Profile photo deleted successfully",
              fileDeleted: currentPhotoPath ? true : false,
            });
          });
        });
      } catch (error) {
        console.error("Error in deleteProfilePhotoRoute:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    },
  );
};

export default deleteProfilePhotoRoute;
