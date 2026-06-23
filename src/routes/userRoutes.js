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

module.exports = router;