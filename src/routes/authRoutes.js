const express = require("express");

const router = express.Router();

const {
  login,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");

router.post("/login", login);

router.post(
  "/forgot-password",
  forgotPassword
);

router.post(
  "/reset-password/:token",
  resetPassword
);

// router.put("/:id/username", verifyToken, isSuperAdmin, updateUsername);

// router.put("/:id/email", verifyToken, isSuperAdmin, updateEmail);

// router.put("/:id/password", verifyToken, isSuperAdmin, updatePassword);

// router.delete("/:id", verifyToken, isSuperAdmin, deleteUser);

module.exports = router;