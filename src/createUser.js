  const pool = require("./config/db");
const bcrypt = require("bcryptjs");

const createUser = async () => {
  try {

    const username = "user1";
    const password = "user123";
    const role = "USER";

    const hashedPassword =
      await bcrypt.hash(password, 10);

    await pool.query(
      `
      INSERT INTO users
      (
        username,
        password,
        role
      )
      VALUES
      (
        $1,
        $2,
        $3
      )
      `,
      [
        username,
        hashedPassword,
        role,
      ]
    );

    console.log(
      `${username} created successfully`
    );

    process.exit();

  } catch (error) {

    console.error(error);

    process.exit();

  }
};

createUser();