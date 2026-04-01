import db from "./../Services/dataBaseConnection.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
// import cookieParser from "cookie-parser";
import process from "process";
import dotenv from "dotenv";
import dayjs from "dayjs";
import ROLES from "../../component/Utils/ROLES.js";
dotenv.config(); //Loading environment variables

const loginRoute = (app) => {
  app.post("/api/login", (req, res) => {
    // app.use(cookieParser());

    const { username, password, role } = req.body; // ✅ NEW: Added role parameter

    //Query to fetch user data
    try {
      if (role === ROLES.ADMIN) {
        const sqlQuery = `SELECT * FROM e_voting_db.admin WHERE ((email = ? OR userId = ?) AND status = "Enabled")`;
        db.query(sqlQuery, [username, username], (err, result) => {
          if (err) {
            console.error("Database error: ", err);
            return res.status(500).json({ error: "Database error" });
          }

          //Checking if user does not exist
          if (result.length === 0) {
            // console.error("user not found");
            return res.status(402).json({
              message: "Wrong credentials!",
            });
          }

          if (result.length > 0) {
            const user = result[0];

            //Comparing entered password with the hashed password
            const hashedPassword = user.password;
            bcrypt.compare(password, hashedPassword, (err, isMatch) => {
              if (err) {
                console.log("Error comparing passwords");
                return res
                  .status(500)
                  .json({ message: "Error comparing passwords" });
              }

              if (isMatch) {
                //Generate JWT token with user ID and email
                const expiresIn = 10 * 60 * 60 * 1000; // 10 hours
                const token = jwt.sign(
                  {
                    userId: user.userId,
                    email: user.email,
                    role: user.role,
                  }, // Include role in token payload
                  process.env.VITE_JWT_SECRET,
                  { expiresIn: expiresIn },
                );

                //Updating last login timestamp  (YYYY-MM-DD, dddd - h:mm:ss a)
                const currentDate = dayjs().format("YYYY-MM-DDTHH:mm:ss");
                // UPDATED: Use correct column name for voters

                const sqlUpdateQuery = `UPDATE e_voting_db.admin SET lastLogin = ? WHERE userId = ?`;
                db.query(sqlUpdateQuery, [currentDate, user.userId], (err) => {
                  if (err) {
                    console.log("Error updating last login timestamp: ", err);
                    // return res
                    //   .status(500)
                    //   .json({ error: "Error updating last login timestamp" });
                  }
                });

                //Checking if password matches with user authentication
                return res.json({
                  user: {
                    //userId: userId, // ✅ UPDATED: Use correct ID
                    userId: user.userId, // ✅ NEW: Include voterId for voters
                    fullName: user.fullName,
                    photo: user.photo,
                    email: user.email,
                    phone: user.phone,
                    status: user.status,
                    role: user.role, // Include role in response
                    dateCreated: user.dateCreated,
                    lastLogin: user.lastLogin,
                  },

                  token: token,
                  expiresIn: expiresIn,
                });
              } else {
                res.status(401).json({ message: "Wrong credentials!" });
                //console.log("Invalid username or password");
              }
            });
          } else {
            res.status(404).json({ message: "User not found!" });
            //console.log("User not found!");
          }
        });

        //========checking for voter login ============
      } else if (role === ROLES.VOTER) {
        const sqlQuery = `SELECT * FROM e_voting_db.voter WHERE voterId = ?`;
        db.query(sqlQuery, [username], (err, result) => {
          if (err) {
            console.error("Database error: ", err);
            return res.status(500).json({ error: "Database error" });
          }

          //Checking if user does not exist
          if (result.length === 0) {
            // console.error("user not found");
            return res.status(402).json({
              message: "Wrong credentials!",
            });
          }

          if (result.length > 0) {
            const user = result[0];

            //Comparing entered password with the hashed password
            const hashedPassword = user.password;
            bcrypt.compare(password, hashedPassword, (err, isMatch) => {
              if (err) {
                console.log("Error comparing passwords");
                return res
                  .status(500)
                  .json({ message: "Error comparing passwords" });
              }

              //Checking if password matches with user authentication
              if (isMatch) {
                //Generate JWT token with user ID and email
                const expiresIn = 10 * 60 * 60 * 1000; // 10 hours
                const token = jwt.sign(
                  {
                    userId: user.userId,
                    role: user.role,
                  }, // Include role in token payload
                  process.env.VITE_JWT_SECRET,
                  { expiresIn: expiresIn },
                );

                return res.json({
                  user: {
                    userId: user.voterId, // ✅ NEW: Include voterId for voters
                    fullName: user.fullName,
                    photo: user.photo,
                    role: user.role, // Include role in response
                  },

                  token: token,
                  expiresIn: expiresIn,
                });
              } else {
                res.status(401).json({ message: "Wrong credentials!" });
                //console.log("Invalid username or password");
              }
            });
          } else {
            res.status(404).json({ message: "User not found!" });
            //console.log("User not found!");
          }
        });
      }
    } catch (err) {
      console.error(err);
    }
  });
};
export default loginRoute;
