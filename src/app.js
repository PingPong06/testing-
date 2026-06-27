const express = require('express');
const cors = require('cors');

const inventoryRoutes = 
require('./routes/inventoryRoutes');
const productRoutes =
require('./routes/productRoutes');
const dashboardRoutes =
require('./routes/dashboardRoutes');
const reportRoutes =
require('./routes/reportRoutes');
const authRoutes =
require("./routes/authRoutes");
const userRoutes =
require("./routes/userRoutes");



const app = express();

// app.use(cors());

// const cors = require("cors");

app.use(
  cors({
    origin: (origin, callback) => {

      const allowedOrigins = [
        "http://localhost:5173",
        process.env.FRONTEND_URL,
      ];

      if (
        !origin ||
        allowedOrigins.includes(origin) ||
        origin.endsWith(".vercel.app")
      ) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },

    credentials: true,
  })
);

console.log(
  "FRONTEND_URL:",
  process.env.FRONTEND_URL
);

app.use(express.json());

app.use('/products', productRoutes);
app.use('/inventory', inventoryRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/reports', reportRoutes);
app.use("/auth", authRoutes);
app.use("/users", userRoutes);


module.exports = app;