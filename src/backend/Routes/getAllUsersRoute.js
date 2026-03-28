import db from "./../Services/dataBaseConnection.js";

const getAllUsersRoute = (app) => {
  app.get("/api/getAllUsers", (req, res) => {
    const sqlQuery = `SELECT userId, fullName, email, phone, role, photo, status, dateCreated, lastLogin FROM e_voting_db.admin`;

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
export default getAllUsersRoute;
