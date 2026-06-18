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


const app = express();

app.use(cors());
app.use(express.json());

app.use('/products', productRoutes);
app.use('/inventory', inventoryRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/reports', reportRoutes);


module.exports = app;