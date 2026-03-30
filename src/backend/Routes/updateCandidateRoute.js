import db from "../Services/dataBaseConnection.js";
//import dayjs from "dayjs";
import staticStorage from "../Services/staticStorage.js";

const updateCandidateRoute = (app) => {
  const upload = staticStorage();

  app.put("/api/updateCandidate/:id", upload.single("photo"), (req, res) => {
    const candidateId = req.params.id;

    const { fullName, position } = req.body;

    if (req.file) {
      const photo = `/uploads/${req.file.filename}`;

      // If a new photo is uploaded, update the fullName, position, and photo
      const sqlUpdate =
        "UPDATE e_voting_db.candidate SET fullName = ?, photo = ?, position = ? WHERE candidateId = ?";
      db.query(sqlUpdate, [fullName, photo, position, candidateId], (err) => {
        if (err) {
          console.log("Database error", err);
          return res.status(500).json({ error: "Error saving candidate" }); //returning HTTP status
        }

        res.status(201).json({ message: "Saved successfully" });
        // console.log(result);
      });
    } else {
      // If no new photo is uploaded, update only the fullName and position
      const sqlUpdate =
        "UPDATE e_voting_db.candidate SET fullName = ?, position = ? WHERE candidateId = ?";
      db.query(sqlUpdate, [fullName, position, candidateId], (err) => {
        if (err) {
          console.log("Database error", err);
          return res.status(500).json({ error: "Error saving candidate" }); //returning HTTP status
        }

        res.status(201).json({ message: "Saved successfully" });
        // console.log(result);
      });
    }
  });
};
export default updateCandidateRoute;
