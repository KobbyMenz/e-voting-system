import db from "./../Services/dataBaseConnection.js";
import staticStorage from "../Services/staticStorage.js";
import bcrypt from "bcryptjs";
import dayjs from "dayjs";
import ROLES from "../../component/Utils/ROLES.js";

const insertVoterRoute = (app) => {
  const upload = staticStorage();

  app.post("/api/insertVoter", upload.single("photo"), (req, res) => {
    const { fullName, dob, password } = req.body;

    // ✅ CRITICAL FIX: Validate all required fields
    if (!fullName || !dob || !password) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // ✅ CRITICAL FIX: Validate password strength
    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters" });
    }

    const role = ROLES.VOTER;
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
              console.error("Database operation failed");
              return res
                .status(500)
                .json({ error: "Unable to register voter" });
            }

            res.status(201).json({ message: "Voter registered successfully" });
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
              console.error("Database operation failed");
              return res
                .status(500)
                .json({ error: "Unable to register voter" });
            }

            res.status(201).json({ message: "Voter registered successfully" });
            //console.log(result);
          },
        );
      });
    }
  });
};
export default insertVoterRoute;
