const pool = require("../config/db");
const bcrypt = require("bcryptjs");

const createUser = async (req, res) => {
  try {
    const { username, password, role } = req.body;

    if (!username || !password || !role) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const existingUser = await pool.query(
      `
      SELECT id
      FROM users
      WHERE username = $1
      `,
      [username]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        message: "Username already exists",
      });
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    const result = await pool.query(
      `
      INSERT INTO users
      (
        username,
        password,
        role
      )
      VALUES ($1,$2,$3)
      RETURNING
      id,
      username,
      role
      `,
      [
        username.trim(),
        hashedPassword,
        role,
      ]
    );

    res.status(201).json(result.rows[0]);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Error creating user",
    });

  }
};

const getUsers = async (req, res) => {
  try {

    const result = await pool.query(
      `
      SELECT
        id,
        username,
        role
      FROM users
      ORDER BY id
      `
    );

    res.json(result.rows);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Error fetching users",
    });

  }
};

const deleteUser = async (req, res) => {
  try {

    const { id } = req.params;

    const user = await pool.query(
      `
      SELECT *
      FROM users
      WHERE id = $1
      `,
      [id]
    );

    if (user.rows.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.rows[0].role === "ADMIN") {
      return res.status(400).json({
        message: "Admin account cannot be deleted",
      });
    }

    await pool.query(
      `
      DELETE FROM users
      WHERE id = $1
      `,
      [id]
    );

    res.json({
      message: "User deleted successfully",
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Error deleting user",
    });

  }
};

module.exports = {
  createUser,
getUsers,
deleteUser,

};