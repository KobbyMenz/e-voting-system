import db from "../Services/dataBaseConnection.js";
//import dayjs from "dayjs";
import staticStorage from "../Services/staticStorage.js";

const updateCandidateRoute = (app) => {
  const upload = staticStorage();

  app.put("/api/updateCandidate/:id", upload.single("photo"), (req, res) => {
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

    if (req.file) {
      const photo = `/uploads/${req.file.filename}`;

      // If a new photo is uploaded, update the fullName, position, and photo
      const sqlUpdate =
        "UPDATE e_voting_db.candidate SET fullName = ?, photo = ?, position = ? WHERE candidateId = ?";
      db.query(sqlUpdate, [fullName, photo, position, candidateId], (err) => {
        if (err) {
          console.error("Database operation failed");
          return res.status(500).json({ error: "Unable to update candidate" });
        }

        res.status(201).json({ message: "Candidate updated successfully" });
        // console.log(result);
      });
    } else {
      // If no new photo is uploaded, update only the fullName and position
      const sqlUpdate =
        "UPDATE e_voting_db.candidate SET fullName = ?, position = ? WHERE candidateId = ?";
      db.query(sqlUpdate, [fullName, position, candidateId], (err) => {
        if (err) {
          console.error("Database operation failed");
          return res.status(500).json({ error: "Unable to update candidate" });
        }

        res.status(201).json({ message: "Candidate updated successfully" });
        // console.log(result);
      });
    }
  });
};
export default updateCandidateRoute;
