// Updated authRoutes.js
const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  registerUser,
  loginUser,
  getUserInfo,
  getAllUsers, // Add this import
} = require("../controllers/authController");

const router = express.Router();

// Daftar dan Login sekarang tanpa password
router.post("/register", registerUser);
router.post("/login", loginUser);

// Mendapatkan profil, tetap butuh JWT
router.get("/profile", protect, getUserInfo);

// Get all users (for participant selection)
router.get("/users", protect, getAllUsers);

module.exports = router;