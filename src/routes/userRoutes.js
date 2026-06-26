const express = require("express");

const router = express.Router();

const verifyToken =
  require("../middleware/authMiddleware");

const isAdmin =
  require("../middleware/adminMiddleware");



const {
  createUser,
  getUsers,
  deleteUser,
   updateUserEmail,
} = require("../controllers/userController");

router.get(
  "/",
  verifyToken,
  isAdmin,
  getUsers
);

router.delete(
  "/:id",
  verifyToken,
  isAdmin,
  deleteUser
);

router.post(
  "/",
  verifyToken,
  isAdmin,
  createUser
);

router.put(
  "/:id/email",
  verifyToken,
  updateUserEmail
);

module.exports = router;