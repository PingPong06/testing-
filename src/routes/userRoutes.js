const express = require("express");

const router = express.Router();

const verifyToken =
  require("../middleware/authMiddleware");

const isSuperAdmin =
  require("../middleware/adminMiddleware");



const {
  createUser,
  getUsers,
  deleteUser,
  updateUsername,
  updateUserPassword,
   updateUserEmail,
} = require("../controllers/userController");

router.get(
  "/",
  verifyToken,
  isSuperAdmin,
  getUsers
);

router.delete(
  "/:id",
  verifyToken,
  isSuperAdmin,
  deleteUser
);

router.post(
  "/",
  verifyToken,
  isSuperAdmin,
  createUser
);

router.put(
  "/:id/username",
  verifyToken,
  isSuperAdmin,
  updateUsername
);

router.put(
  "/:id/password",
  verifyToken,
  isSuperAdmin,
  updateUserPassword
);

router.put(
  "/:id/email",
  verifyToken,
  updateUserEmail
);

module.exports = router;