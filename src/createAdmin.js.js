const pool = require("./config/db");
const bcrypt = require("bcryptjs");

const createAdmin = async () => {
  try {

    const hashedPassword =
      await bcrypt.hash("admin123", 10);

    await pool.query(
      `
      INSERT INTO users
      (
        username,
        password
      )
      VALUES
      (
        $1,
        $2
      )
      `,
      [
        "admin",
        hashedPassword,
      ]
    );

    console.log("Admin created");

    process.exit();

  } catch (error) {

    console.error(error);

    process.exit();

  }
};

createAdmin();