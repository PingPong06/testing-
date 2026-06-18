const express = require('express');

const router = express.Router();

const {
  stockIn,
  stockOut,
  getInventorySummary,
  getTransactionHistory,
  getLowStockItems,
  getInventoryHistory
} = require('../controllers/inventoryController');

router.post('/in', stockIn);

router.post('/out', stockOut);

router.get('/', getInventorySummary);

router.get('/history', getTransactionHistory);

router.get('/low-stock', getLowStockItems);

router.get('/activity-history', getInventoryHistory);

module.exports = router;