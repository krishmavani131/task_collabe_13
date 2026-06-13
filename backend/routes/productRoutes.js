import { Router } from 'express';

import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getTopProducts,
} from '../controllers/productController.js';

import { protect, admin } from '../middleware/authMiddleware.js';
import checkObjectId from '../middleware/checkObjectId.js';

const router = Router();

// Get all products & Create product
router.get('/', getProducts);
router.post('/', protect, admin, createProduct);

// Get top rated products
router.get('/top', getTopProducts);

// Create product review
router.post(
  '/:id/reviews',
  protect,
  checkObjectId,
  createProductReview
);

// Get product by id
router.get(
  '/:id',
  checkObjectId,
  getProductById
);

// Update product
router.put(
  '/:id',
  protect,
  admin,
  checkObjectId,
  updateProduct
);

// Delete product
router.delete(
  '/:id',
  protect,
  admin,
  checkObjectId,
  deleteProduct
);

export default router;