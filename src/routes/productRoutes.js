  const express = require('express');
  const router = express.Router();

  const verifyToken =
    require("../middleware/authMiddleware");

  const {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    // searchProducts
  } = require('../controllers/productController');

  router.post(
    '/',
    verifyToken,
    createProduct
  );

  router.get(
    '/',
    verifyToken,
    getAllProducts
  );

  router.get(
    '/:id',
    verifyToken,
    getProductById
  );

  router.put(
    '/:id',
    verifyToken,
    updateProduct
  );

  router.delete(
    '/:id',
    verifyToken,
    deleteProduct
  );

  module.exports = router;