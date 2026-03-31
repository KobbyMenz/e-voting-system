import db from "./../Services/dataBaseConnection.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import process from "process";
import dotenv from "dotenv";
import dayjs from "dayjs";
import ROLES from "../../component/Utils/ROLES.js";
dotenv.config(); //Loading environment variables

const loginRoute = (app) => {
  app.post("/api/login", (req, res) => {
    const { email, password, role } = req.body; // ✅ NEW: Added role parameter

    //  Determine which table to query based on role parameter
    const table =
      role === ROLES.VOTER ? "e_voting_db.voter" : "e_voting_db.admin";
    //  FIXED: Use correct ID column for each table
    const idColumn = role === ROLES.VOTER ? "voterId" : "userId";
    //   Only add status check for admin table
    const statusCheck = role === ROLES.VOTER ? "" : ' AND status = "Enabled"';

    //Use correct column for email/user identification based on role
    const col = role === ROLES.VOTER ? "voterId" : "email"; // ✅ NEW: Column to select for user ID

    //Query to fetch user data
    try {
      // Dynamic query based on role - use correct ID column
      const sqlQuery = `SELECT * FROM ${table} WHERE ((${col} = ? OR ${idColumn} = ?) ${statusCheck})`;
      db.query(sqlQuery, [email, email], (err, result) => {
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
          // ✅ NEW: Get userId or voterId depending on role
          const userId =
            role === ROLES.VOTER ? user.voterId || user.userId : user.userId;

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
                { userId: userId, email: user.email },
                process.env.VITE_JWT_SECRET,
                { expiresIn: expiresIn },
              );

              if (role === ROLES.ADMIN) {
                //Updating last login timestamp  (YYYY-MM-DD, dddd - h:mm:ss a)
                const currentDate = dayjs().format("YYYY-MM-DDTHH:mm:ss");
                // UPDATED: Use correct column name for voters
                const idColumn = role === ROLES.VOTER ? "voterId" : "userId";
                const sqlUpdateQuery = `UPDATE ${table} SET lastLogin = ? WHERE ${idColumn} = ?`;
                db.query(sqlUpdateQuery, [currentDate, userId], (err) => {
                  if (err) {
                    console.log("Error updating last login timestamp: ", err);
                    // return res
                    //   .status(500)
                    //   .json({ error: "Error updating last login timestamp" });
                  }
                  //console.log("Last login timestamp updated successfully");
                  // console.log("Result: " + result);
                });
              }

              //Checking if password matches with user authentication
              return res.json({
                user: {
                  userId: userId, // ✅ UPDATED: Use correct ID
                  voterId: role === ROLES.VOTER ? user.voterId : undefined, // ✅ NEW: Include voterId for voters
                  fullName: user.fullName,
                  photo: user.photo,
                  email: user.email,
                  phone: user.phone,
                  status: user.status,
                  role: role, // ✅ NEW: Include role in response
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
    } catch (err) {
      console.error(err);
    }
  });
};
export default loginRoute;
