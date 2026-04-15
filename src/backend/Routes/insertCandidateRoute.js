import db from "../Services/dataBaseConnection.js";
//import dayjs from "dayjs";
import staticStorage from "../Services/staticStorage.js";

const insertCandidateRoute = (app) => {
  const upload = staticStorage();

  app.post("/api/insertCandidate", upload.single("photo"), (req, res) => {
    const { fullName, position, electionId } = req.body;

    // ✅ CRITICAL FIX: Validate all required fields
    if (!fullName || !electionId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // ✅ CRITICAL FIX: Validate file upload
    if (!req.file) {
      return res.status(400).json({ error: "Candidate photo is required" });
    }

    const photo = `/uploads/${req.file.filename}`;

    const sqlInsert =
      "INSERT INTO e_voting_db.candidate (fullName, photo, position, electionId ) VALUES (?,?,?,?)";
    db.query(sqlInsert, [fullName, photo, position, electionId], (err) => {
      if (err) {
        console.error("Database operation failed");
        return res.status(500).json({ error: "Unable to add candidate" });
      }

      res.status(201).json({ message: "Candidate added successfully" });
      // console.log(result);
    });
  });
};
export default insertCandidateRoute;
