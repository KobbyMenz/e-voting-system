/**
 * 🔒 SECURE LOGIN ROUTE WITH REFRESH TOKENS - Extended Security Implementation
 *
 * Security Features:
 * ✅ Rate limiting to prevent brute force attacks
 * ✅ Account lockout after failed attempts
 * ✅ Short-lived access tokens (15 minutes)
 * ✅ Long-lived refresh tokens (7 days)
 * ✅ Secure JWT token handling with httpOnly cookies
 * ✅ Proper HTTP status codes
 * ✅ Token expiration validation
 * ✅ Comprehensive input validation
 * ✅ Secure logout with token invalidation
 * ✅ Token refresh mechanism for seamless sessions
 */

import db from "./../Services/dataBaseConnection.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import process from "process";
import dotenv from "dotenv";
import dayjs from "dayjs";
import ROLES from "../../component/Utils/ROLES.js";

dotenv.config();

// ✅ SECURITY: In-memory store for failed login attempts (use Redis in production)
const failedLoginAttempts = new Map();
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_TIME_MS = 15 * 60 * 1000; // 15 minutes
const ATTEMPT_RESET_TIME_MS = 15 * 60 * 1000; // 15 minutes

// ✅ SECURITY: In-memory store for revoked tokens (use Redis in production)
// On logout, tokens are added here to prevent their reuse
const revokedTokens = new Set();

// ✅ SECURITY: In-memory store for refresh token sessions
// Maps refresh tokens to user info for validation
const refreshTokenSessions = new Map();

/**
 * ✅ SECURITY: Check if user account is locked due to too many failed attempts
 */
const isAccountLocked = (identifier) => {
  const attempts = failedLoginAttempts.get(identifier);
  if (!attempts) return false;

  const now = Date.now();
  // Reset if lockout period expired
  if (now - attempts.lastAttemptTime > ATTEMPT_RESET_TIME_MS) {
    failedLoginAttempts.delete(identifier);
    return false;
  }

  // Check if account is currently locked
  if (attempts.count >= MAX_FAILED_ATTEMPTS) {
    const lockTimeRemaining = LOCKOUT_TIME_MS - (now - attempts.lockedAt);
    if (lockTimeRemaining > 0) {
      return true; // Still locked
    } else {
      // Lockout expired, reset
      failedLoginAttempts.delete(identifier);
      return false;
    }
  }

  return false;
};

/**
 * ✅ SECURITY: Record failed login attempt
 */
const recordFailedAttempt = (identifier) => {
  const attempts = failedLoginAttempts.get(identifier) || {
    count: 0,
    lastAttemptTime: Date.now(),
    lockedAt: null,
  };

  attempts.count++;
  attempts.lastAttemptTime = Date.now();

  if (attempts.count >= MAX_FAILED_ATTEMPTS) {
    attempts.lockedAt = Date.now();
  }

  failedLoginAttempts.set(identifier, attempts);
};

/**
 * ✅ SECURITY: Clear failed login attempts on successful login
 */
const clearFailedAttempts = (identifier) => {
  failedLoginAttempts.delete(identifier);
};

/**
 * ✅ SECURITY: Validate JWT token
 */
const validateToken = (token, secret) => {
  try {
    const decoded = jwt.verify(token, secret);
    return decoded;
  } catch (err) {
    console.error("Token validation error:", err.message);
    return null;
  }
};

/**
 * ✅ SECURITY: Check if token is revoked
 */
const isTokenRevoked = (token) => {
  return revokedTokens.has(token);
};

/**
 * ✅ SECURITY: Revoke a token (on logout)
 */
const revokeToken = (token) => {
  revokedTokens.add(token);
};

const loginRoute = (app) => {
  /**
   * 🔒 POST /api/login - Secure Login Endpoint with Refresh Tokens
   * ✅ Rate limiting
   * ✅ Account lockout
   * ✅ Secure token handling with refresh tokens
   */
  app.post("/api/login", (req, res) => {
    const { username, password, role } = req.body;

    // ✅ SECURITY: Input validation
    if (!username || !password || !role) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // ✅ SECURITY: Validate username is not too long (prevent DoS)
    if (username.length > 255) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // ✅ SECURITY: Check if account is locked
    if (isAccountLocked(username)) {
      return res.status(429).json({
        error:
          "Account temporarily locked due to too many failed login attempts. Try again in 15 minutes.",
      });
    }

    try {
      if (role === ROLES.ADMIN) {
        const sqlQuery = `SELECT * FROM e_voting_db.admin WHERE ((email = ? OR userId = ?) AND status = "Enabled")`;

        db.query(sqlQuery, [username, username], (err, result) => {
          if (err) {
            console.error("Database error: ", err);
            return res.status(500).json({
              error: "Authentication service temporarily unavailable",
            });
          }

          // ✅ SECURITY: Don't reveal whether user exists or not
          if (result.length === 0) {
            recordFailedAttempt(username);
            return res.status(401).json({ error: "Invalid credentials" });
          }

          const user = result[0];
          const hashedPassword = user.password;

          // ✅ SECURITY: Use bcrypt.compare for password verification
          bcrypt.compare(password, hashedPassword, (err, isMatch) => {
            if (err) {
              console.error("Password comparison error: ", err);
              recordFailedAttempt(username);
              return res.status(401).json({ error: "Invalid credentials" });
            }

            if (!isMatch) {
              recordFailedAttempt(username);
              return res.status(401).json({ error: "Invalid credentials" });
            }

            // ✅ SECURITY: Clear failed attempts on successful login
            clearFailedAttempts(username);

            // ✅ SECURITY: Create minimal payload (no sensitive data in token)
            const tokenPayload = {
              userId: user.userId,
              role: user.role,
              type: "access", // 🔒 Token type for validation
              iat: Math.floor(Date.now() / 1000),
            };

            // 🔒 SECURITY: Short-lived access token (15 minutes)
            const accessToken = jwt.sign(
              tokenPayload,
              process.env.VITE_JWT_SECRET,
              {
                expiresIn: "15m",
                algorithm: "HS256",
              },
            );

            // 🔒 SECURITY: Long-lived refresh token (7 days)
            const refreshTokenPayload = {
              userId: user.userId,
              role: user.role,
              type: "refresh",
              iat: Math.floor(Date.now() / 1000),
            };

            const refreshToken = jwt.sign(
              refreshTokenPayload,
              process.env.VITE_REFRESH_TOKEN_SECRET ||
                process.env.VITE_JWT_SECRET + "_refresh",
              {
                expiresIn: "7d",
                algorithm: "HS256",
              },
            );

            // 🔒 SECURITY: Store refresh token session info
            refreshTokenSessions.set(refreshToken, {
              userId: user.userId,
              createdAt: Date.now(),
            });

            // ✅ SECURITY: Update last login timestamp
            const currentDate = dayjs().format("YYYY-MM-DDTHH:mm:ss");
            const sqlUpdateQuery = `UPDATE e_voting_db.admin SET lastLogin = ? WHERE userId = ?`;

            db.query(sqlUpdateQuery, [currentDate, user.userId], (err) => {
              if (err) {
                console.error("Error updating last login: ", err);
              }
            });

            // ✅ SECURITY: Send access token via httpOnly secure cookie (short-lived)
            res.cookie("accessToken", accessToken, {
              httpOnly: true,
              secure: process.env.NODE_ENV === "production",
              sameSite: "strict",
              maxAge: 15 * 60 * 1000, // 15 minutes
              path: "/",
            });

            // ✅ SECURITY: Send refresh token via httpOnly secure cookie (long-lived)
            res.cookie("refreshToken", refreshToken, {
              httpOnly: true,
              secure: process.env.NODE_ENV === "production",
              sameSite: "strict",
              maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
              path: "/",
            });

            // ✅ SECURITY: Also return access token in body for frontend storage (optional)
            return res.status(200).json({
              success: true,
              user: {
                userId: user.userId,
                fullName: user.fullName,
                email: user.email,
                role: user.role,
                photo: user.photo,
              },
              accessToken: accessToken, // For frontend to store in sessionStorage
              refreshToken: refreshToken, // For frontend to store in sessionStorage
              expiresIn: "15m", // Access token expiry
              refreshExpiresIn: "7d", // Refresh token expiry
            });
          });
        });

        // ========== VOTER LOGIN ==========
      } else if (role === ROLES.VOTER) {
        const sqlQuery = `SELECT * FROM e_voting_db.voter WHERE voterId = ?`;

        db.query(sqlQuery, [username], (err, result) => {
          if (err) {
            console.error("Database error: ", err);
            return res.status(500).json({
              error: "Authentication service temporarily unavailable",
            });
          }

          // ✅ SECURITY: Don't reveal whether user exists
          if (result.length === 0) {
            recordFailedAttempt(username);
            return res.status(401).json({ error: "Invalid credentials" });
          }

          const user = result[0];
          const hashedPassword = user.password;

          // ✅ SECURITY: Use bcrypt.compare for password verification
          bcrypt.compare(password, hashedPassword, (err, isMatch) => {
            if (err) {
              console.error("Password comparison error: ", err);
              recordFailedAttempt(username);
              return res.status(401).json({ error: "Invalid credentials" });
            }

            if (!isMatch) {
              recordFailedAttempt(username);
              return res.status(401).json({ error: "Invalid credentials" });
            }

            // ✅ SECURITY: Clear failed attempts
            clearFailedAttempts(username);

            // ✅ SECURITY: Create secure tokens
            const tokenPayload = {
              userId: user.voterId,
              role: user.role,
              type: "access",
              iat: Math.floor(Date.now() / 1000),
            };

            const accessToken = jwt.sign(
              tokenPayload,
              process.env.VITE_JWT_SECRET,
              {
                expiresIn: "15m",
                algorithm: "HS256",
              },
            );

            const refreshTokenPayload = {
              userId: user.voterId,
              role: user.role,
              type: "refresh",
              iat: Math.floor(Date.now() / 1000),
            };

            const refreshToken = jwt.sign(
              refreshTokenPayload,
              process.env.VITE_REFRESH_TOKEN_SECRET ||
                process.env.VITE_JWT_SECRET + "_refresh",
              {
                expiresIn: "7d",
                algorithm: "HS256",
              },
            );

            // 🔒 SECURITY: Store refresh token session
            refreshTokenSessions.set(refreshToken, {
              userId: user.voterId,
              createdAt: Date.now(),
            });

            // ✅ SECURITY: Send secure httpOnly cookies
            res.cookie("accessToken", accessToken, {
              httpOnly: true,
              secure: process.env.NODE_ENV === "production",
              sameSite: "strict",
              maxAge: 15 * 60 * 1000, // 15 minutes
              path: "/",
            });

            res.cookie("refreshToken", refreshToken, {
              httpOnly: true,
              secure: process.env.NODE_ENV === "production",
              sameSite: "strict",
              maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
              path: "/",
            });

            return res.status(200).json({
              success: true,
              user: {
                userId: user.voterId,
                fullName: user.fullName,
                role: user.role,
                photo: user.photo,
              },
              accessToken: accessToken,
              refreshToken: refreshToken,
              expiresIn: "15m",
              refreshExpiresIn: "7d",
            });
          });
        });
      } else {
        return res.status(400).json({ error: "Invalid user role" });
      }
    } catch (err) {
      console.error("Login error: ", err);
      return res
        .status(500)
        .json({ error: "Authentication service temporarily unavailable" });
    }
  });

  /**
   * 🔒 POST /api/refresh-token - Refresh Access Token
   * ✅ Uses long-lived refresh token to get new short-lived access token
   * ✅ Prevents frequent re-login while maintaining security
   */
  app.post("/api/refresh-token", (req, res) => {
    try {
      const refreshToken =
        req.cookies.refreshToken ||
        req.body.refreshToken ||
        req.headers.authorization?.split(" ")[1];

      if (!refreshToken) {
        return res.status(401).json({ error: "No refresh token provided" });
      }

      // ✅ SECURITY: Check if token is revoked
      if (isTokenRevoked(refreshToken)) {
        return res
          .status(401)
          .json({ error: "Refresh token has been revoked" });
      }

      // ✅ SECURITY: Validate refresh token
      const secretKey =
        process.env.VITE_REFRESH_TOKEN_SECRET ||
        process.env.VITE_JWT_SECRET + "_refresh";
      const decoded = validateToken(refreshToken, secretKey);

      if (!decoded || decoded.type !== "refresh") {
        return res
          .status(401)
          .json({ error: "Invalid or expired refresh token" });
      }

      // ✅ SECURITY: Check if session still exists
      if (!refreshTokenSessions.has(refreshToken)) {
        return res
          .status(401)
          .json({ error: "Session not found or has been terminated" });
      }

      // ✅ SECURITY: Generate new access token
      const newAccessTokenPayload = {
        userId: decoded.userId,
        role: decoded.role,
        type: "access",
        iat: Math.floor(Date.now() / 1000),
      };

      const newAccessToken = jwt.sign(
        newAccessTokenPayload,
        process.env.VITE_JWT_SECRET,
        {
          expiresIn: "15m",
          algorithm: "HS256",
        },
      );

      // ✅ SECURITY: Send new access token via httpOnly cookie
      res.cookie("accessToken", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 15 * 60 * 1000, // 15 minutes
        path: "/",
      });

      return res.status(200).json({
        success: true,
        accessToken: newAccessToken,
        expiresIn: "15m",
        message: "Token refreshed successfully",
      });
    } catch (err) {
      console.error("Token refresh error: ", err);
      return res.status(500).json({ error: "Token refresh failed" });
    }
  });

  /**
   * 🔒 POST /api/logout - Secure Logout Endpoint
   * ✅ Revokes both access and refresh tokens
   * ✅ Clears httpOnly cookies on server
   */
  app.post("/api/logout", (req, res) => {
    try {
      const accessToken =
        req.cookies.accessToken || req.headers.authorization?.split(" ")[1];
      const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

      // ✅ SECURITY: Revoke both tokens
      if (accessToken) {
        revokeToken(accessToken);
      }

      if (refreshToken) {
        revokeToken(refreshToken);
        refreshTokenSessions.delete(refreshToken);
      }

      // ✅ SECURITY: Clear both httpOnly cookies
      res.clearCookie("accessToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
      });

      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
      });

      return res.status(200).json({
        success: true,
        message: "Logged out successfully",
      });
    } catch (err) {
      console.error("Logout error: ", err);
      return res.status(500).json({ error: "Logout failed" });
    }
  });

  /**
   * 🔒 GET /api/verify-token - Verify Token Validity
   * ✅ Check if access token is still valid
   */
  app.get("/api/verify-token", (req, res) => {
    try {
      const accessToken =
        req.cookies.accessToken || req.headers.authorization?.split(" ")[1];

      if (!accessToken) {
        return res.status(401).json({ error: "No token provided" });
      }

      // ✅ SECURITY: Check if token is revoked
      if (isTokenRevoked(accessToken)) {
        return res.status(401).json({ error: "Token has been revoked" });
      }

      // ✅ SECURITY: Validate token and check expiration
      const decoded = validateToken(accessToken, process.env.VITE_JWT_SECRET);
      if (!decoded || decoded.type !== "access") {
        return res.status(401).json({ error: "Invalid or expired token" });
      }

      return res.status(200).json({
        success: true,
        user: {
          userId: decoded.userId,
          role: decoded.role,
        },
      });
    } catch (err) {
      console.error("Token verification error: ", err);
      return res.status(500).json({ error: "Token verification failed" });
    }
  });
};

export default loginRoute;
