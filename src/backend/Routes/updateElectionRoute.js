import db from "../Services/dataBaseConnection.js";
//import dayjs from "dayjs";

const updateElectionRoute = (app) => {
  //const upload = staticStorage();

  app.put("/api/updateElection/:electionId", (req, res) => {
    const electionId = req.params.electionId;

    const { title, description, startDate, endDate } = req.body;
    // const status = "Upcoming";
    // const dateCreated = dayjs().format("YYYY-MM-DDTHH:mm");

    const sqlInsert =
      "UPDATE e_voting_db.election SET title = ?, description = ?, startDate = ?, endDate = ? WHERE electionId = ?";
    db.query(
      sqlInsert,
      [title, description, startDate, endDate, electionId],
      (err) => {
        if (err) {
          console.log("Database error", err);
          return res.status(500).json({ error: "Error updating election" }); //returning HTTP status
        }

        res.status(201).json({ message: "Election updated successfully" });
        // console.log(result);
      },
    );
  });
};
export default updateElectionRoute;
