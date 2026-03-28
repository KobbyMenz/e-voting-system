import db from "../Services/dataBaseConnection.js";

const updateUserStatusRoute = (app) => {
  app.put("/api/updateUserStatus/:userId", (req, res) => {
    const userId = req.params.userId;

    const { userStatus, fullName } = req.body;

    const sqlUpdate = `UPDATE e_voting_db.admin SET status =? WHERE userId = ?`;

    db.query(sqlUpdate, [userStatus, userId], (err) => {
      if (err) {
        // console.log("Database error", err);
        // return res.status(500).send("This user name can not be used!"); //returning HTTP status
        return res
          .status(500)
          .json({ error: "user status cannot be changed!" });
      }

      res.status(200).json({
        message: `${fullName.split(" ")[0]}'s account has been ${userStatus.split()[0].toLowerCase()} successfully`,
      });
      // console.log(result);
    });
  });
};
export default updateUserStatusRoute;
