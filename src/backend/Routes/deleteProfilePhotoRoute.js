import db from "../Services/dataBaseConnection.js";
import staticStorage from "../Services/staticStorage.js";
const deleteProfilePhotoRoute = (app) => {
  const upload = staticStorage();

  app.put(
    "/api/deleteProfilePhoto/:userId",
    upload.single("photo"),
    (req, res) => {
      const userId = req.params.userId;
      // console.log("Request received: ", req.body.userData);

      const profilePicturePath = null;

      const sqlUpdate =
        "UPDATE e_voting_db.admin SET photo = ? WHERE userId = ? ";
      db.query(sqlUpdate, [profilePicturePath, userId], (err) => {
        if (err) {
          console.log("Database error", err);
          return res.status(500).send("Error deleting "); //returning HTTP status
        }

        res.status(201).json({ message: "image deleted successfully" });
        // console.log(result);
      });
      // }
    },
  );
};
export default deleteProfilePhotoRoute;
