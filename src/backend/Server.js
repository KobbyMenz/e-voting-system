import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
dotenv.config(); //Loading environment variables
//import { console } from "inspector";
import process from "process";
import createBackup from "./Services/createBackup.js";
//import cron from "node-cron";

// 🔒 Security Middleware Imports
import {
  securityHeaders,
  securityAuditLog,
  securityCORS,
} from "./Middleware/securityHeaders.js";
import { rateLimit } from "./Middleware/rateLimitMiddleware.js";
// 🔒 SECURITY: Use secure login route with refresh tokens
import loginRoute from "./Routes/loginRoute.REFRESH.js";

import getAllUsersRoute from "./Routes/getAllUsersRoute.js";
import insertUserRoute from "./Routes/insertUserRoute.js";
import updateUserRoute from "./Routes/updateUserRoute.js";
import updateUserStatusRoute from "./Routes/updateUserStatusRoute.js";
import deleteUserRoute from "./Routes/deleteUserRoute.js";
import getUserProfilePicture from "./Routes/getUserProfilePicture.js";
import insertVoterRoute from "./Routes/insertVoterRoute.js";
import getAllVotersRoute from "./Routes/getAllVotersRoute.js";
import deleteVoterRoute from "./Routes/deleteVoterRoute.js";
import updateVoterRoute from "./Routes/updateVoterRoute.js";
import deleteProfilePhotoRoute from "./Routes/deleteProfilePhotoRoute.js";
import insertElectionRoute from "./Routes/insertElectionRoute.js";
import getAllElectionsRoute from "./Routes/getAllElectionsRoute.js";
import updateElectionRoute from "./Routes/updateElectionRoute.js";
import getNoOfVotersRoute from "./Routes/getNoOfVotersRoute.js";
import deleteElectionRoute from "./Routes/deleteElectionRoute.js";
import updateElectionStatusRoute from "./Routes/updateElectionStatusRoute.js";
import insertCandidateRoute from "./Routes/insertCandidateRoute.js";
import updateCandidateRoute from "./Routes/updateCandidateRoute.js";
import deleteCandidateRoute from "./Routes/deleteCandidateRoute.js";
import insertVoteRoute from "./Routes/insertVoteRoute.js";
import fileManagementRoute from "./Routes/fileManagementRoute.js";

const app = express();

/*
===============================================
🔒 SECURITY MIDDLEWARE - Apply to all routes
===============================================*/
// ✅ SECURITY: Add security headers to all responses
app.use(securityHeaders);

// ✅ SECURITY: Log security-relevant requests
app.use(securityAuditLog);

/*
======================================
Setting up cross-origin requests (CORS)
======================================*/
// ✅ SECURITY: Enhanced CORS configuration
app.use(cors(securityCORS));

//  Middleware
/*=========================*/
app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());
////////////////////////////////////////////////////////////////

/*
  LOGIN - 🔒 Secure Login with Rate Limiting
===================================*/
// ✅ Apply rate limiting middleware to login endpoint
app.post("/api/login", rateLimit("login"));

// Use the secure login route with proper async handling and security features
loginRoute(app);

/*
==============================
USERS MANAGEMENT
=============================*/
getAllUsersRoute(app);

insertUserRoute(app);

updateUserRoute(app);

updateUserStatusRoute(app);

deleteUserRoute(app);

getUserProfilePicture(app);

deleteProfilePhotoRoute(app);

/*

==============================
VOTERS MANAGEMENT
=============================*/
insertVoterRoute(app);

getAllVotersRoute(app);

deleteVoterRoute(app);

updateVoterRoute(app);

/*

==============================
VOTES MANAGEMENT
=============================*/
insertVoteRoute(app);

/*

==============================
ELECTION MANAGEMENT
=============================*/
insertElectionRoute(app);

getAllElectionsRoute(app);

updateElectionRoute(app);

deleteElectionRoute(app);

updateElectionStatusRoute(app);

/*

==============================
CANDIDATE MANAGEMENT
=============================*/
insertCandidateRoute(app);

updateCandidateRoute(app);

deleteCandidateRoute(app);

/*

==============================
FILE MANAGEMENT
=============================*/
fileManagementRoute(app);

/*

==============================
DASHBOARD MANAGEMENT
=============================*/
getNoOfVotersRoute(app);

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
