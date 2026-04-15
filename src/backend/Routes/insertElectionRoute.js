import db from "../Services/dataBaseConnection.js";
import dayjs from "dayjs";

const insertElectionRoute = (app) => {
  //const upload = staticStorage();

  app.post("/api/insertElection", (req, res) => {
    const { title, description, startDate, endDate } = req.body;

    // ✅ CRITICAL FIX: Validate all required fields
    if (!title || !startDate || !endDate) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // ✅ CRITICAL FIX: Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({ error: "Invalid date format" });
    }
    if (end <= start) {
      return res
        .status(400)
        .json({ error: "End date must be after start date" });
    }

    const status = "Upcoming";
    const dateCreated = dayjs().format("YYYY-MM-DDTHH:mm");

    const sqlInsert =
      "INSERT INTO e_voting_db.election (title, description, dateCreated, status, startDate, endDate) VALUES (?,?,?,?,?,?)";
    db.query(
      sqlInsert,
      [title, description, dateCreated, status, startDate, endDate],
      (err) => {
        if (err) {
          console.error("Database operation failed");
          return res.status(500).json({ error: "Unable to create election" });
        }

        res.status(201).json({ message: "Election created successfully" });
        // console.log(result);
      },
    );
  });
};
export default insertElectionRoute;
