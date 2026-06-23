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

app.use(cors());
app.use(express.json());

app.use('/products', productRoutes);
app.use('/inventory', inventoryRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/reports', reportRoutes);
app.use("/auth", authRoutes);
app.use("/users", userRoutes);


module.exports = app;