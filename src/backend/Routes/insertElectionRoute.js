import db from "../Services/dataBaseConnection.js";
import dayjs from "dayjs";

const insertElectionRoute = (app) => {
  //const upload = staticStorage();

  app.post("/api/insertElection", (req, res) => {
    //console.log("Body Request received: ", req.body);
    // console.log("File Request received: ", req.file);

    const { title, description, startDate, endDate } = req.body;
    const status = "Upcoming";
    const dateCreated = dayjs().format("YYYY-MM-DDTHH:mm");

    const sqlInsert =
      "INSERT INTO e_voting_db.election (title, description, dateCreated, status, startDate, endDate) VALUES (?,?,?,?,?,?)";
    db.query(
      sqlInsert,
      [title, description, dateCreated, status, startDate, endDate],
      (err) => {
        if (err) {
          console.log("Database error", err);
          return res.status(500).json({ error: "Error adding election" }); //returning HTTP status
        }

        res.status(201).json({ message: "Election added successfully" });
        // console.log(result);
      },
    );
  });
};
export default insertElectionRoute;
