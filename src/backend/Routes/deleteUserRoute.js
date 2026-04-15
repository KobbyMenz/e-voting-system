import db from "./../Services/dataBaseConnection.js";
import { deleteImageFile } from "../Services/fileDeleteService.js";

const deleteUserRoute = (app) => {
  app.delete("/api/deleteUser/:id", async (req, res) => {
    const id = req.params.id;
    console.log(`\n👤 deleteUserRoute called for userId: ${id}`);

    // ✅ CRITICAL FIX: Validate id parameter
    if (!id || id.trim().length === 0) {
      console.error("❌ Invalid user ID");
      return res.status(400).json({ error: "Invalid user ID" });
    }

    try {
      // ✅ STEP 1: Fetch user data to get profile photo path
      const sqlSelect =
        "SELECT userId, photo FROM e_voting_db.admin WHERE userId = ?";

      console.log(`📋 Querying database for user: ${id}`);
      
      db.query(sqlSelect, [id], async (err, result) => {
        if (err) {
          console.error("❌ Database error:", err);
          return res.status(500).json({ error: "Unable to retrieve user" });
        }

        if (!result || result.length === 0) {
          console.error(`❌ User not found: ${id}`);
          return res.status(404).json({ error: "User not found" });
        }

        const userPhoto = result[0].photo;
        console.log(`📷 User photo path: ${userPhoto || "NO PHOTO"}`);

        // ✅ STEP 2: Delete physical image file if exists
        if (userPhoto) {
          console.log(`🗑️ Starting file deletion for: ${userPhoto}`);
          const deleteResult = await deleteImageFile(userPhoto);
          console.log(`📊 File deletion result:`, deleteResult);
          
          if (!deleteResult.success) {
            console.warn(`⚠️ File deletion warning: ${deleteResult.message}`);
            // Continue with database deletion even if file deletion fails
          }
        } else {
          console.log(`ℹ️ No photo to delete for this user`);
        }

        // ✅ STEP 3: Delete user from database
        const sqlDelete = `DELETE FROM e_voting_db.admin WHERE userId = ?`;
        console.log(`💾 Deleting user from database...`);

        db.query(sqlDelete, [id], (err) => {
          if (err) {
            console.error("❌ Database operation failed:", err);
            return res.status(500).json({ error: "Unable to delete user" });
          }

          console.log(`✅ User deleted successfully from database`);
          res.status(200).json({
            success: true,
            message: "User deleted successfully",
            fileDeleted: userPhoto ? true : false,
          });
        });
      });
    } catch (error) {
      console.error("❌ Error in deleteUserRoute:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
};

export default deleteUserRoute;
