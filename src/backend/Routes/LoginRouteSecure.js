import db from "./../Services/dataBaseConnection.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
//import cookieParser from "cookie-parser";
import process from "process";
import dotenv from "dotenv";
import dayjs from "dayjs";
import ROLES from "../../component/Utils/ROLES.js";
dotenv.config(); //Loading environment variables

// Login endpoint
const loginRouteSecure = (app) => {
  //app.use(cookieParser());

  app.post("/api/login", (req, res) => {
    const { username, password, role } = req.body;

    //console.log("Body Request received: ", req.body);

    if (!role || !username || !password) {
      return;
      //res.status(400).json({ error: "Missing fields" });
    }

    let user;
    try {
      if (role === ROLES.VOTER) {
        db.query(
          "SELECT * FROM e_voting_db.voter WHERE voterId = ?",
          [username],
          (err, result) => {
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
              user = result[0];
            }
          },
        );
      } else if (role === ROLES.ADMIN) {
        db.query(
          `SELECT * FROM e_voting_db.admin WHERE ((email = ? OR userId = ?) AND status = "Enabled")`,
          [username, username],
          (err, result) => {
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
              user = result[0];
            }
          },
        );
      } else {
        return res.status(400).json({ error: "Invalid user type" });
      }
    } catch (err) {
      console.error("Database error: ", err);
      return res.status(500).json({ error: "Database error" });
    }

    // Check if user exists and password matches
    const hashedPassword = user.password;
    if (!user || !bcrypt.compare(password, hashedPassword)) {
      return res.status(401).json({ error: "Wrong credentials" });
    }

    // Create JWT payload
    const payload = {
      userId: role === ROLES.VOTER ? user.voterId : user.userId,
      role: role,
      // add other non‑sensitive data if needed
    };

    // Sign token (expires in 1 day)
    const token = jwt.sign(payload, process.env.VITE_JWT_SECRET, {
      expiresIn: "1d",
    });

    // Set httpOnly cookie
    res.cookie("token", token, {
      httpOnly: true, // prevents JavaScript access
      secure: process.env.NODE_ENV === "production", // only HTTPS in production
      sameSite: "strict", // prevents CSRF
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    if (role === ROLES.ADMIN) {
      //Updating last login timestamp  (YYYY-MM-DD, dddd - h:mm:ss a)
      const currentDate = dayjs().format("YYYY-MM-DDTHH:mm:ss");

      const sqlUpdateQuery = `UPDATE e_voting_db.admin SET lastLogin = ? WHERE userId = ?`;
      db.query(sqlUpdateQuery, [currentDate, user.userId], (err) => {
        if (err) {
          console.log("Error updating last login timestamp: ", err);
          // return res
          //   .status(500)
          //   .json({ error: "Error updating last login timestamp" });
        }
      });
    }

    // Send back user info (no token in body)
    res.json({
      user: {
        userId: role === ROLES.VOTER ? user.voterId : user.userId, // ✅ NEW: Include voterId for voters
        fullName: user.fullName,
        photo: user.photo,
        email: user.email,
        phone: user.phone,
        status: user.status,
        role: user.role, // Include role in response
        dateCreated: user.dateCreated,
        lastLogin: user.lastLogin,
      },
    });
  });

  // Example protected route: get current user
  // app.get("/api/me", async (req, res) => {
  //   const token = req.cookies.token;
  //   if (!token) return res.status(401).json({ error: "Not authenticated" });

  //   try {
  //     const decoded = jwt.verify(token, process.env.VITE_JWT_SECRET);
  //     // Optionally fetch fresh user data from DB
  //     res.json({ userId: decoded.userId, role: decoded.role });
  //   } catch (err) {
  //     console.error("JWT error: ", err);
  //     res.status(401).json({ error: "Invalid token" });
  //   }
  // });
};
export default loginRouteSecure;

// Logout endpoint
// app.post("/api/logout", (req, res) => {
//   res.clearCookie("token", { httpOnly: true, sameSite: "strict" });
//   res.json({ message: "Logged out" });
// });
