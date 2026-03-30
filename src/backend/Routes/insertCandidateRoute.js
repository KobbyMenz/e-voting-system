import db from "../Services/dataBaseConnection.js";
//import dayjs from "dayjs";
import staticStorage from "../Services/staticStorage.js";

const insertCandidateRoute = (app) => {
  const upload = staticStorage();

  app.post("/api/insertCandidate", upload.single("photo"), (req, res) => {
    //console.log("Body Request received: ", req.body);
    // console.log("File Request received: ", req.file);

    const { fullName, position, electionId } = req.body;
    // const status = "Upcoming";
    // const dateCreated = dayjs().format("YYYY-MM-DDTHH:mm");
    const photo = `/uploads/${req.file.filename}`;

    const sqlInsert =
      "INSERT INTO e_voting_db.candidate (fullName, photo, position, electionId ) VALUES (?,?,?,?)";
    db.query(sqlInsert, [fullName, photo, position, electionId], (err) => {
      if (err) {
        console.log("Database error", err);
        return res.status(500).json({ error: "Error adding candidate" }); //returning HTTP status
      }

      res.status(201).json({ message: "Candidate added successfully" });
      // console.log(result);
    });
  });
};
export default insertCandidateRoute;
