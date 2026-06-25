  const express = require('express');

  const verifyToken =
    require("../middleware/authMiddleware");



  const router = express.Router();

  const {
    stockIn,
    stockOut,
    getInventorySummary,
    getTransactionHistory,
    getLowStockItems,
    getInventoryHistory,
    exportActivityHistoryExcel
  } = require('../controllers/inventoryController');

  router.post(
    "/in",
    verifyToken,
    stockIn
  );

  router.post(
    "/out",
    verifyToken,
    stockOut
  );

  router.get(
    "/",
    verifyToken,
    getInventorySummary
  );

  router.get(
    "/history",
    verifyToken,
    getTransactionHistory
  );

  router.get(
    "/low-stock",
    verifyToken,
    getLowStockItems
  );

  router.get(
    "/activity-history",
    verifyToken,
    getInventoryHistory
  );

   router.get(
    "/activity-history/excel",
    verifyToken,
    exportActivityHistoryExcel
  );


  module.exports = router;
