import db from "./../Services/dataBaseConnection.js";
import staticStorage from "../Services/staticStorage.js";
import bcrypt from "bcryptjs";
//import dayjs from "dayjs";
import ROLES from "../../component/Utils/ROLES.js";

const updateVoterRoute = (app) => {
  const upload = staticStorage();

  // Route to update voter information, including optional profile picture and password
  app.put("/api/updateVoter/:id", upload.single("photo"), (req, res) => {
    //console.log("Body Request received: ", req.body);
    // console.log("File Request received: ", req.file);
    const voterId = req.params.id;
    const { fullName, dob, password } = req.body;
    const role = ROLES.VOTER;
    //const status = "Enabled";
    //const dateCreated = dayjs().format("YYYY-MM-DDTHH:mm");

    if (req.file && password) {
      const photo = `/uploads/${req.file.filename}`;

      //Hashing the password before storing in the database
      bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
          return res.status(500).json({ error: "Error hashing password" });
        }

        const sqlInsert =
          "UPDATE e_voting_db.voter SET fullName = ?, DOB = ?, photo = ?, role = ?, password = ? WHERE voterId = ?";
        db.query(
          sqlInsert,
          [fullName, dob, photo, role, hashedPassword, voterId],
          (err) => {
            if (err) {
              console.log("Database error", err);
              return res
                .status(500)
                .json({ error: "This username or email can not be used!" }); //returning HTTP status
            }

            res.status(201).json({ message: "Saved successfully" });
            // console.log(result);
          },
        );
      });
    } else if (password) {
      //Hashing the password before storing in the database
      bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
          return res.status(500).json({ error: "Error hashing password" });
        }

        //inserting user details into the database without profile picture
        const sqlInsert = `UPDATE e_voting_db.voter SET fullName = ?, DOB = ?, role = ?, password = ? WHERE voterId = ?`;
        db.query(
          sqlInsert,
          [fullName, dob, role, hashedPassword, voterId],
          (err) => {
            if (err) {
              console.log("Database error", err);
              return res
                .status(500)
                .json({ error: "This username or email can not be used!" }); //returning HTTP status
            }

            res.status(201).json({ message: "Saved successfully" });
            //console.log(result);
          },
        );
      });
    } else if (req.file) {
      const photo = `/uploads/${req.file.filename}`;

      const sqlInsert =
        "UPDATE e_voting_db.voter SET fullName = ?, DOB = ?, photo = ?, role = ? WHERE voterId = ?";
      db.query(sqlInsert, [fullName, dob, photo, role, voterId], (err) => {
        if (err) {
          console.log("Database error", err);
          return res
            .status(500)
            .json({ error: "This username or email can not be used!" }); //returning HTTP status
        }

        res.status(201).json({ message: "Saved successfully" });
        // console.log(result);
      });
    } else {
      const sqlInsert =
        "UPDATE e_voting_db.voter SET fullName = ?, DOB = ?, role = ? WHERE voterId = ?";
      db.query(sqlInsert, [fullName, dob, role, voterId], (err) => {
        if (err) {
          console.log("Database error", err);
          return res
            .status(500)
            .json({ error: "This username or email can not be used!" }); //returning HTTP status
        }

        res.status(201).json({ message: "Saved successfully" });
        // console.log(result);
      });
    }
  });

  // Route to update voter password only
  app.put("/api/updateVoterPassword/:voterId", (req, res) => {
    const voterId = req.params.voterId;

    const { password } = req.body;

    //Hashing the password before updating
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: err });
      }

      const sqlUpdate = `UPDATE e_voting_db.voter SET password = ? WHERE voterId = ?`;

      db.query(sqlUpdate, [hashedPassword, voterId], (err) => {
        if (err) {
          // console.log("Database error", err);
          // return res.status(500).send("This user name can not be used!"); //returning HTTP status
          return res.status(500).json({
            error: "Failed to update password. Please try again later.",
          });
        }

        res.status(200).json({ message: "Saved successfully" });
        // console.log(result);
      });
    });
  });
};
export default updateVoterRoute;
