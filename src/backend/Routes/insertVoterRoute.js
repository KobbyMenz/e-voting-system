import db from "./../Services/dataBaseConnection.js";
import staticStorage from "../Services/staticStorage.js";
import bcrypt from "bcryptjs";
import dayjs from "dayjs";
import ROLES from "../../component/Utils/ROLES.js";

const insertVoterRoute = (app) => {
  const upload = staticStorage();

  app.post("/api/insertVoter", upload.single("photo"), (req, res) => {
    //console.log("Body Request received: ", req.body);
    // console.log("File Request received: ", req.file);

    const { fullName, dob, password } = req.body;
    const role = ROLES.VOTER;
    //const status = "Enabled";
    const dateCreated = dayjs().format("YYYY-MM-DDTHH:mm");

    if (req.file) {
      const photo = `/uploads/${req.file.filename}`;

      //Hashing the password before storing in the database
      bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
          return res.status(500).json({ error: "Error hashing password" });
        }

        const sqlInsert =
          "INSERT INTO e_voting_db.voter (fullName, DOB, photo, role, password, dateCreated) VALUES (?,?,?,?,?,?)";
        db.query(
          sqlInsert,
          [fullName, dob, photo, role, hashedPassword, dateCreated],
          (err) => {
            if (err) {
              console.log("Database error", err);
              return res
                .status(500)
                .json({ error: "This username or email can not be used!" }); //returning HTTP status
            }

            res.status(201).json({ message: "Registered successfully" });
            // console.log(result);
          },
        );
      });
    } else {
      //Hashing the password before storing in the database
      bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
          return res.status(500).json({ error: "Error hashing password" });
        }

        //inserting user details into the database without profile picture
        const sqlInsert =
          "INSERT INTO e_voting_db.voter (fullName, DOB, role, password, dateCreated) VALUES (?,?,?,?,?)";
        db.query(
          sqlInsert,
          [fullName, dob, role, hashedPassword, dateCreated],
          (err) => {
            if (err) {
              console.log("Database error", err);
              return res
                .status(500)
                .json({ error: "This username or email can not be used!" }); //returning HTTP status
            }

            res.status(201).json({ message: "Registered successfully" });
            //console.log(result);
          },
        );
      });
    }
  });
};
export default insertVoterRoute;
