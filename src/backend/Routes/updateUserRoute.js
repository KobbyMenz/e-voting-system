import db from "../Services/dataBaseConnection.js";
import staticStorage from "../Services/staticStorage.js";
import bcrypt from "bcryptjs";

const updateUserRoute = (app) => {
  const upload = staticStorage();

  app.put("/api/updateUser/:userId", upload.single("photo"), (req, res) => {
    const { fullName, email, phone, password } = req.body;
    const userId = req.params.userId;

    //Checking file (image)
    if (req.file && password) {
      const photoPath = `/uploads/${req.file.filename}`;

      //Hashing the password before updating
      bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: err });
        }

        const sqlUpdate = `UPDATE e_voting_db.admin SET fullName = ?, email = ?, phone =?,
         password = ?, photo = ? WHERE userId = ?`;
        db.query(
          sqlUpdate,
          [fullName, email, phone, hashedPassword, photoPath, userId],
          (err) => {
            if (err) {
              console.log("Database error", err);
              return res
                .status(500)
                .json({ error: "This username or email can not be used!" });
            }

            res.status(201).json({ message: "Saved successfully" });
            //console.log(result);
          },
        );
      });
    } else if (password) {
      //Hashing the password before updating
      bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: err });
        }

        const sqlUpdate = `UPDATE e_voting_db.admin SET fullName = ?, email = ?, phone = ?,
         password = ? WHERE userId = ? `;
        db.query(
          sqlUpdate,
          [fullName, email, phone, hashedPassword, userId],
          (err) => {
            if (err) {
              console.log("Database error", err);
              return res
                .status(500)
                .json({ error: "This email can not be used!" }); //returning HTTP status
            }

            res.status(201).json({ message: "Saved successfully" });
            //console.log(result);
          },
        );
      });
    } else if (req.file) {
      //Hashing the password before updating
      // bcrypt.hash(password, 10, (err, hashedPassword) => {
      //   if (err) {
      //     console.error(err);
      //     return res.status(500).json({ error: err });
      //   }
      const photoPath = `/uploads/${req.file.filename}`;

      const sqlUpdate = `UPDATE e_voting_db.admin SET fullName = ?, email = ?, phone =?, photo = ?
         WHERE userId = ? `;
      db.query(
        sqlUpdate,
        [fullName, email, phone, photoPath, userId],
        (err) => {
          if (err) {
            console.log("Database error", err);
            return res
              .status(500)
              .json({ error: "This email can not be used!" }); //returning HTTP status
          }

          res.status(201).json({ message: "Saved successfully" });
          //console.log(result);
        },
      );
      // });
    } else {
      //Hashing the password before updating
      // bcrypt.hash(password, 10, (err, hashedPassword) => {
      //   if (err) {
      //     console.error(err);
      //     return res.status(500).json({ error: err });
      //   }

      const sqlUpdate = `UPDATE e_voting_db.admin SET fullName = ?, email = ?, phone =?
         WHERE userId = ?`;
      db.query(sqlUpdate, [fullName, email, phone, userId], (err) => {
        if (err) {
          console.log("Database error", err);
          return res.status(500).json({ error: "This email can not be used!" }); //returning HTTP status
        }

        res.status(201).json({ message: "Saved successfully" });
        //console.log(result);
      });
      // });
    }
  });
};
export default updateUserRoute;
