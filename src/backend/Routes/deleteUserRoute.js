import db from "./../Services/dataBaseConnection.js";

const deleteUserRoute = (app) => {
  app.delete("/api/deleteUser/:id", (req, res) => {
    const id = req.params.id;
    // console.log("id Request received: ", req.params.userId);
    // console.log("pass Request received: ", req.body);

    //const profilePicturePath = `/public/uploads/${req.file.filename}`;

    const sqlDelete = `DELETE FROM e_voting_db.admin WHERE userId = ? `;

    db.query(sqlDelete, [id], (err) => {
      if (err) {
        // console.log("Database error", err);
        return res.status(500).send("Error deleting user"); //returning HTTP status
      }

      res.status(200).json({ message: "Deleted successfully" });
      // console.log(result);
    });
  });
};
export default deleteUserRoute;
