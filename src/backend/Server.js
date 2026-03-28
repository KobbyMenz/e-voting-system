import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config(); //Loading environment variables
//import { console } from "inspector";
import process from "process";
import createBackup from "./Services/createBackup.js";
//import cron from "node-cron";
import loginRoute from "./Routes/loginRoute.js";
import getAllUsersRoute from "./Routes/getAllUsersRoute.js";
import insertUserRoute from "./Routes/insertUserRoute.js";
import updateUserRoute from "./Routes/updateUserRoute.js";
import updateUserStatusRoute from "./Routes/updateUserStatusRoute.js";
import deleteUserRoute from "./Routes/deleteUserRoute.js";

const app = express();
/*
======================================
Setting up cross-origin requests (COR)
======================================*/
app.use(
  cors({
    origin: process.env.VITE_APP_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);

//  Middleware
/*=========================*/
app.use(express.json());
app.use(bodyParser.json());
////////////////////////////////////////////////////////////////

/*
              LOGIN
===================================*/
//Login Route
// loginRoute(app);
loginRoute(app);

getAllUsersRoute(app);

insertUserRoute(app);

updateUserRoute(app);

updateUserStatusRoute(app);

deleteUserRoute(app);

/*Schedule a backup every 1 hour
==================================*/
// cron.schedule("0 * * * *", () => {
//   console.log("Running scheduled hourly backup...");
//   try {
//     const result = createBackup();

//     if (result && result.success) {
//       console.log("Scheduled backup succeeded:", result.message, result.path);
//     } else {
//       console.error("Scheduled backup reported failure:", result);
//     }
//   } catch (err) {
//     console.error("Scheduled backup failed:", err);
//   }
// });

/* Manual trigger backup by clicking React button
==================================================*/
app.get("/api/backup", async (req, res) => {
  try {
    const result = await createBackup();
    if (result) {
      console.log("Backup created successfully");
      return res.json({
        message: result,
      });
    }
  } catch (err) {
    console.error("Manual backup failed:", err);
    // err may be an object with success:false
    if (err) {
      console.log("Backup failed with error message");
      return res.json({
        message: `Backup failed with error message: ${err}`,
      });
    }
  }
});
//////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////

/*

==================================
STARTING SERVER 
==================================
*/
const port = process.env.VITE_PORT;
app.listen(port, () => {
  console.log(`Server running on port http://localhost:${port}`);
});
