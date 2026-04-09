import db from "./../Services/dataBaseConnection.js";

const getNoOfVotersRoute = (app) => {
  app.get("/api/getNoOfVoters", (req, res) => {
    const sqlQuery = `SELECT COUNT(*) AS noOfVoters FROM e_voting_db.voter`;

    db.query(sqlQuery, (err, result) => {
      if (err) {
        console.log("Error fetching data", err);
        return res.status(500).json({ error: "Database error" });
      }

      res.status(200).json({
        totalVoters: result[0].noOfVoters,
      }); //Sending the query result back to json.
      // console.log(result);
    });
  });

  app.get("/api/getNoOfVoteCast", (req, res) => {
    const sqlQuery = `SELECT COUNT(DISTINCT voterId) AS noOfVoteCast FROM e_voting_db.vote`; // Assuming you want to count votes for each election. Adjust the query as needed.

    db.query(sqlQuery, (err, result) => {
      if (err) {
        console.log("Error fetching data", err);
        return res.status(500).json({ error: "Database error" });
      }

      res.status(200).json({
        totalVoteCast: result[0].noOfVoteCast,
      }); //Sending the query result back to json.
      // console.log(result);
    });
  });
};
export default getNoOfVotersRoute;
