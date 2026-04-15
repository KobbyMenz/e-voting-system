import db from "../Services/dataBaseConnection.js";
//import dayjs from "dayjs";
import staticStorage from "../Services/staticStorage.js";
import { deleteImageFile } from "../Services/fileDeleteService.js";

const updateCandidateRoute = (app) => {
  const upload = staticStorage();

  app.put(
    "/api/updateCandidate/:id",
    upload.single("photo"),
    async (req, res) => {
      const candidateId = req.params.id;
      const { fullName, position } = req.body;

      // ✅ CRITICAL FIX: Validate candidateId
      if (!candidateId || candidateId.trim().length === 0) {
        return res.status(400).json({ error: "Invalid candidate ID" });
      }

      // ✅ CRITICAL FIX: Validate fullName is provided
      if (!fullName) {
        return res.status(400).json({ error: "Candidate name is required" });
      }

      try {
        if (req.file) {
          const newPhoto = `/uploads/${req.file.filename}`;

          // ✅ STEP 1: Fetch current photo to delete it
          const sqlSelect =
            "SELECT photo FROM e_voting_db.candidate WHERE candidateId = ?";

          db.query(sqlSelect, [candidateId], async (err, result) => {
            if (err) {
              console.error("Database error:", err);
              return res
                .status(500)
                .json({ error: "Unable to fetch candidate" });
            }

            if (result && result.length > 0 && result[0].photo) {
              // ✅ STEP 2: Delete old photo file
              const deleteResult = await deleteImageFile(result[0].photo);
              if (!deleteResult.success) {
                console.warn(
                  `⚠️ Old photo deletion warning: ${deleteResult.message}`,
                );
                // Continue with update even if old file deletion fails
              }
            }

            // ✅ STEP 3: Update database with new photo
            const sqlUpdate =
              "UPDATE e_voting_db.candidate SET fullName = ?, photo = ?, position = ? WHERE candidateId = ?";
            db.query(
              sqlUpdate,
              [fullName, newPhoto, position, candidateId],
              (err) => {
                if (err) {
                  console.error("Database operation failed:", err);
                  return res
                    .status(500)
                    .json({ error: "Unable to update candidate" });
                }

                res.status(200).json({
                  success: true,
                  message: "Candidate updated successfully",
                  photoUpdated: true,
                });
              },
            );
          });
        } else {
          // ✅ No new photo - update only fullName and position
          const sqlUpdate =
            "UPDATE e_voting_db.candidate SET fullName = ?, position = ? WHERE candidateId = ?";
          db.query(sqlUpdate, [fullName, position, candidateId], (err) => {
            if (err) {
              console.error("Database operation failed:", err);
              return res
                .status(500)
                .json({ error: "Unable to update candidate" });
            }

            res.status(200).json({
              success: true,
              message: "Candidate updated successfully",
              photoUpdated: false,
            });
          });
        }
      } catch (error) {
        console.error("Error in updateCandidateRoute:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    },
  );
};
export default updateCandidateRoute;
