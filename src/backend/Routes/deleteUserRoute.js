import db from "./../Services/dataBaseConnection.js";

const deleteUserRoute = (app) => {
  app.delete("/api/deleteUser/:id", (req, res) => {
    const id = req.params.id;

    // ✅ CRITICAL FIX: Validate id parameter
    if (!id || id.trim().length === 0) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const sqlDelete = `DELETE FROM e_voting_db.admin WHERE userId = ?`;

    db.query(sqlDelete, [id], (err) => {
      if (err) {
        console.error("Database operation failed");
        return res.status(500).json({ error: "Unable to delete user" });
      }

      res.status(200).json({ message: "User deleted successfully" });
      // console.log(result);
    });
  });
};
export default deleteUserRoute;
