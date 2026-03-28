import db from "./../Services/dataBaseConnection.js";

const getUserProfilePicture = (app) => {
  app.get(`/api/getUserProfilePicture/:userId`, (req, res) => {
    const { userId } = req.params;

    //console.log("UserId get received: ", req.params.userId);

    const query = `SELECT photo AS profilePicture FROM e_voting_db.admin WHERE userId = ?`;
    db.query(query, [userId], (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Error getting profile picture" });
      }

      const profilePicturePath =
        result[0] !== undefined ? result[0].profilePicture : null;

      if (result.length > 0) {
        res.json({
          message: "retrieved successfully",
          profilePicture: profilePicturePath,
        });
      }
      //  else {
      // res
      //   .status(404)
      //   .json({ error: "Profile picture not found", profilePicture: null });
      //console.log("Profile picture not found");
      // }
    });
  });
};
export default getUserProfilePicture;
