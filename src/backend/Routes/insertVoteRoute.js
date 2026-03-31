import db from "../Services/dataBaseConnection.js";
import dayjs from "dayjs";
//import staticStorage from "../Services/staticStorage.js";

const insertVoteRoute = (app) => {
  app.post("/api/insertVote", (req, res) => {
    //console.log("Body Request received: ", req.body);
    // console.log("File Request received: ", req.file);

    const { electionId, candidateId, voterId } = req.body;
    // const status = "Upcoming";
    const timeStamp = dayjs().format("YYYY-MM-DDTHH:mm");

    const sqlInsert =
      "INSERT INTO e_voting_db.vote (electionId, candidateId, voterId, timeStamp ) VALUES (?,?,?,?)";
    db.query(
      sqlInsert,
      [electionId, candidateId, voterId, timeStamp],

      (err) => {
        if (err) {
          console.log("Database error", err);
          return res.status(500).json({ error: "Failed to cast vote!" }); //returning HTTP status
        }

        res
          .status(201)
          .json({ message: "Your vote has been recorded successfully" });
        // console.log(result);
      },
    );
  });
};
export default insertVoteRoute;
