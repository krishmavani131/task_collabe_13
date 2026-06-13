import { Router } from 'express';

import {
  addOrderItems,
  getMyOrders,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getOrders,
} from '../controllers/orderController.js';

import {
  protect,
  admin,
} from '../middleware/authMiddleware.js';

const router = Router();

// Create order & Get all orders
router.post('/', protect, addOrderItems);
router.get('/', protect, admin, getOrders);

// Get logged in user's orders
router.get('/mine', protect, getMyOrders);

// Get single order by id
router.get('/:id', protect, getOrderById);

// Update order payment status
router.put('/:id/pay', protect, updateOrderToPaid);

// Update delivery status
router.put(
  '/:id/deliver',
  protect,
  admin,
  updateOrderToDelivered
);

export default router;