const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
  try {

    const { username, password } = req.body;

    const result = await pool.query(
      `
      SELECT *
      FROM users
      WHERE username = $1
      `,
      [username]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        message: "Invalid Credentials",
      });
    }

    const user = result.rows[0];

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid Credentials",
      });
    }

   const token = jwt.sign(
  {
    id: user.id,
    username: user.username,
    role: user.role,
  },
  process.env.JWT_SECRET,
  {
    expiresIn: "1d",
  }
);
    res.json({
  token,
  userId: user.id,
  username: user.username,
  role: user.role,
});

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });

  }
};

module.exports = {
  login,
};