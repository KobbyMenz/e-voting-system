import db from "./../Services/dataBaseConnection.js";
import staticStorage from "../Services/staticStorage.js";
import bcrypt from "bcryptjs";
import dayjs from "dayjs";

const insertUserRoute = (app) => {
  const upload = staticStorage();

  app.post("/api/addUser", upload.single("photo"), (req, res) => {
    //console.log("Body Request received: ", req.body);
    // console.log("File Request received: ", req.file);

    const { fullName, email, phone, password } = req.body;
    const role = "Admin";
    const status = "Enabled";
    const dateCreated = dayjs().format("YYYY-MM-DDTHH:mm");

    if (req.file) {
      const photo = `/uploads/${req.file.filename}`;

      //Hashing the password before storing in the database
      bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
          return res.status(500).json({ error: "Error hashing password" });
        }

        const sqlInsert =
          "INSERT INTO e_voting_db.admin (fullName, email, phone, password, photo, status, role, dateCreated) VALUES (?,?,?,?,?,?,?,? )";
        db.query(
          sqlInsert,
          [
            fullName,
            email,
            phone,
            hashedPassword,
            photo,
            status,
            role,
            dateCreated,
          ],
          (err) => {
            if (err) {
              console.log("Database error", err);
              return res
                .status(500)
                .json({ error: "This username or email can not be used!" }); //returning HTTP status
            }

            res.status(201).json({ message: "Added successfully" });
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
          "INSERT INTO e_voting_db.admin (fullName, email, phone, password, status, role, dateCreated) VALUES (?,?,?,?,?,?,? )";
        db.query(
          sqlInsert,
          [fullName, email, phone, hashedPassword, status, role, dateCreated],
          (err) => {
            if (err) {
              console.log("Database error", err);
              return res
                .status(500)
                .json({ error: "This username or email can not be used!" }); //returning HTTP status
            }

            res.status(201).json({ message: "Added successfully" });
            //console.log(result);
          },
        );
      });
    }
  });
};
export default insertUserRoute;
