import db from "../Services/dataBaseConnection.js";
import staticStorage from "../Services/staticStorage.js";
import bcrypt from "bcryptjs";

const updateUserRoute = (app) => {
  const upload = staticStorage();

  app.put("/api/updateUser/:userId", upload.single("photo"), (req, res) => {
    const { fullName, email, phone, password } = req.body;
    const userId = req.params.userId;

    // ✅ CRITICAL FIX: Validate userId
    if (!userId || userId.trim().length === 0) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    // ✅ CRITICAL FIX: Validate at least one field is provided
    if (!fullName && !email && !phone && !password && !req.file) {
      return res.status(400).json({ error: "No fields to update" });
    }

    // ✅ CRITICAL FIX: Validate email format if provided
    if (email && (!email.includes("@") || !email.includes("."))) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    // ✅ CRITICAL FIX: Validate password strength if provided
    if (password && password.length < 8) {
      return res
        .status(400)
        .json({ error: "Password must be at least 8 characters" });
    }

    //Checking file (image)
    if (req.file && password) {
      const photoPath = `/uploads/${req.file.filename}`;

      //Hashing the password before updating
      bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Error hashing password" });
        }

        const sqlUpdate = `UPDATE e_voting_db.admin SET fullName = ?, email = ?, phone =?,
         password = ?, photo = ? WHERE userId = ?`;
        db.query(
          sqlUpdate,
          [fullName, email, phone, hashedPassword, photoPath, userId],
          (err) => {
            if (err) {
              console.error("Database operation failed");
              return res.status(500).json({ error: "Unable to update user" });
            }

            res.status(201).json({ message: "User updated successfully" });
            //console.log(result);
          },
        );
      });
    } else if (password) {
      //Hashing the password before updating
      bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Error hashing password" });
        }

        const sqlUpdate = `UPDATE e_voting_db.admin SET fullName = ?, email = ?, phone = ?,
         password = ? WHERE userId = ? `;
        db.query(
          sqlUpdate,
          [fullName, email, phone, hashedPassword, userId],
          (err) => {
            if (err) {
              console.error("Database operation failed");
              return res.status(500).json({ error: "Unable to update user" });
            }

            res.status(201).json({ message: "User updated successfully" });
            //console.log(result);
          },
        );
      });
    } else if (req.file) {
      const photoPath = `/uploads/${req.file.filename}`;

      const sqlUpdate = `UPDATE e_voting_db.admin SET fullName = ?, email = ?, phone =?, photo = ?
         WHERE userId = ? `;
      db.query(
        sqlUpdate,
        [fullName, email, phone, photoPath, userId],
        (err) => {
          if (err) {
            console.error("Database operation failed");
            return res.status(500).json({ error: "Unable to update user" });
          }

          res.status(201).json({ message: "User updated successfully" });
          //console.log(result);
        },
      );
    } else {
      const sqlUpdate = `UPDATE e_voting_db.admin SET fullName = ?, email = ?, phone =?
         WHERE userId = ?`;
      db.query(sqlUpdate, [fullName, email, phone, userId], (err) => {
        if (err) {
          console.error("Database operation failed");
          return res.status(500).json({ error: "Unable to update user" });
        }

        res.status(201).json({ message: "User updated successfully" });
        //console.log(result);
      });
    }
  });
};
export default updateUserRoute;
