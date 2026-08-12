const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

pool.query("SELECT current_database(), current_user")
  .then(result => {
    console.log("Database:", result.rows[0]);
  })
  .catch(err => {
    console.error("Database connection check failed:", err);
  });

// const pool = new Pool({
  
//   connectionString: process.env.DATABASE_URL,

//   ssl:
//     process.env.NODE_ENV === "production"
//       ? {
//           rejectUnauthorized: false,
//         }
//       : false,
// });

// console.log(
//   "Connected to DB:",
//   process.env.DATABASE_URL
// );

module.exports = pool;