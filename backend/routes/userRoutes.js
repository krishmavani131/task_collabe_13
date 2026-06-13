import { Router } from 'express';

import {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
} from '../controllers/userController.js';

import {
  protect,
  admin,
} from '../middleware/authMiddleware.js';

const router = Router();

// Register User
router.post('/', registerUser);

// Get All Users
router.get('/', protect, admin, getUsers);

// Login User
router.post('/auth', authUser);

// Logout User
router.post('/logout', logoutUser);

// User Profile
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);

// User By ID
router.get('/:id', protect, admin, getUserById);

// Update User
router.put('/:id', protect, admin, updateUser);

// Delete User
router.delete('/:id', protect, admin, deleteUser);

export default router;