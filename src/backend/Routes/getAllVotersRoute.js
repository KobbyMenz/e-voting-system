import db from "./../Services/dataBaseConnection.js";

const getAllVotersRoute = (app) => {
  app.get("/api/getAllVoters", (req, res) => {
    const sqlQuery = `SELECT voterId, fullName, DOB, photo, dateCreated FROM e_voting_db.voter`;

    db.query(sqlQuery, (err, result) => {
      if (err) {
        console.log("Error fetching data", err);
        return res.status(500).json({ error: "Database error" });
      }

      res.status(200).json({
        result: result,
      }); //Sending the query result back to json.
      //console.log(result);
    });
  });
};
export default getAllVotersRoute;
