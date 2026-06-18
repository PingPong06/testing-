const express = require('express');
const router = express.Router();

const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  // searchProducts
} = require('../controllers/productController');

router.post('/', createProduct);

router.get('/', getAllProducts);

router.get('/:id', getProductById);

router.put('/:id', updateProduct);

router.delete('/:id', deleteProduct);

module.exports = router;