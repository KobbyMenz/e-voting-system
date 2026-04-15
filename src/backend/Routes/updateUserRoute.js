import db from "../Services/dataBaseConnection.js";
import staticStorage from "../Services/staticStorage.js";
import bcrypt from "bcryptjs";
import { deleteImageFile } from "../Services/fileDeleteService.js";

const updateUserRoute = (app) => {
  const upload = staticStorage();

  app.put(
    "/api/updateUser/:userId",
    upload.single("photo"),
    async (req, res) => {
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

      try {
        // ✅ Helper function to delete old photo when updating with new one
        const handlePhotoUpdate = async () => {
          if (req.file) {
            // Fetch current photo to delete it
            const sqlSelect =
              "SELECT photo FROM e_voting_db.admin WHERE userId = ?";
            return new Promise((resolve) => {
              db.query(sqlSelect, [userId], async (err, result) => {
                if (result && result.length > 0 && result[0].photo) {
                  const deleteResult = await deleteImageFile(result[0].photo);
                  if (!deleteResult.success) {
                    console.warn(
                      `⚠️ Old photo deletion warning: ${deleteResult.message}`,
                    );
                  }
                }
                resolve();
              });
            });
          }
        };

        // Checking file (image) AND password
        if (req.file && password) {
          const photoPath = `/uploads/${req.file.filename}`;

          // ✅ Delete old photo first
          await handlePhotoUpdate();

          //Hashing the password before updating
          bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) {
              console.error(err);
              return res.status(500).json({ error: "Error hashing password" });
            }

            const sqlUpdate = `UPDATE e_voting_db.admin SET fullName = ?, email = ?, phone = ?,
           password = ?, photo = ? WHERE userId = ?`;
            db.query(
              sqlUpdate,
              [fullName, email, phone, hashedPassword, photoPath, userId],
              (err) => {
                if (err) {
                  console.error("Database operation failed:", err);
                  return res
                    .status(500)
                    .json({ error: "Unable to update user" });
                }

                res.status(200).json({
                  success: true,
                  message: "User updated successfully",
                  photoUpdated: true,
                });
              },
            );
          });
        } else if (password) {
          // Password only (no photo change)
          //Hashing the password before updating
          bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) {
              console.error(err);
              return res.status(500).json({ error: "Error hashing password" });
            }

            const sqlUpdate = `UPDATE e_voting_db.admin SET fullName = ?, email = ?, phone = ?,
           password = ? WHERE userId = ?`;
            db.query(
              sqlUpdate,
              [fullName, email, phone, hashedPassword, userId],
              (err) => {
                if (err) {
                  console.error("Database operation failed:", err);
                  return res
                    .status(500)
                    .json({ error: "Unable to update user" });
                }

                res.status(200).json({
                  success: true,
                  message: "User updated successfully",
                  photoUpdated: false,
                });
              },
            );
          });
        } else if (req.file) {
          // Photo only (no password change)
          const photoPath = `/uploads/${req.file.filename}`;

          // ✅ Delete old photo first
          await handlePhotoUpdate();

          const sqlUpdate = `UPDATE e_voting_db.admin SET fullName = ?, email = ?, phone = ?, photo = ?
           WHERE userId = ?`;
          db.query(
            sqlUpdate,
            [fullName, email, phone, photoPath, userId],
            (err) => {
              if (err) {
                console.error("Database operation failed:", err);
                return res.status(500).json({ error: "Unable to update user" });
              }

              res.status(200).json({
                success: true,
                message: "User updated successfully",
                photoUpdated: true,
              });
            },
          );
        } else {
          // No photo, no password (update other fields only)
          const sqlUpdate = `UPDATE e_voting_db.admin SET fullName = ?, email = ?, phone = ?
           WHERE userId = ?`;
          db.query(sqlUpdate, [fullName, email, phone, userId], (err) => {
            if (err) {
              console.error("Database operation failed:", err);
              return res.status(500).json({ error: "Unable to update user" });
            }

            res.status(200).json({
              success: true,
              message: "User updated successfully",
              photoUpdated: false,
            });
          });
        }
      } catch (error) {
        console.error("Error in updateUserRoute:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    },
  );
};
export default updateUserRoute;
