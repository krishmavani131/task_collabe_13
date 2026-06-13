import asyncHandler from '../middleware/asyncHandler.js';
import generateToken from '../utils/generateToken.js';
import User from '../models/userModel.js';

// Login User
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const existingUser = await User.findOne({ email });

  if (!existingUser || !(await existingUser.matchPassword(password))) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  generateToken(res, existingUser._id);

  res.json({
    _id: existingUser._id,
    name: existingUser.name,
    email: existingUser.email,
    isAdmin: existingUser.isAdmin,
  });
});

// Register User
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    res.status(400);
    throw new Error('User already exists');
  }

  const newUser = await User.create({
    name,
    email,
    password,
  });

  generateToken(res, newUser._id);

  res.status(201).json({
    _id: newUser._id,
    name: newUser.name,
    email: newUser.email,
    isAdmin: newUser.isAdmin,
  });
});

// Logout User
const logoutUser = (req, res) => {
  res.clearCookie('jwt');
  res.json({
    message: 'Logged out successfully',
  });
};

// User Profile
const getUserProfile = asyncHandler(async (req, res) => {
  const profile = await User.findById(req.user._id);

  if (!profile) {
    res.status(404);
    throw new Error('User not found');
  }

  res.json({
    _id: profile._id,
    name: profile.name,
    email: profile.email,
    isAdmin: profile.isAdmin,
  });
});

// Update Profile
const updateUserProfile = asyncHandler(async (req, res) => {
  const profile = await User.findById(req.user._id);

  if (!profile) {
    res.status(404);
    throw new Error('User not found');
  }

  profile.name = req.body.name ?? profile.name;
  profile.email = req.body.email ?? profile.email;

  if (req.body.password) {
    profile.password = req.body.password;
  }

  const savedUser = await profile.save();

  res.json({
    _id: savedUser._id,
    name: savedUser.name,
    email: savedUser.email,
    isAdmin: savedUser.isAdmin,
  });
});

// Get All Users
const getUsers = asyncHandler(async (req, res) => {
  const userList = await User.find();
  res.json(userList);
});

// Delete User
const deleteUser = asyncHandler(async (req, res) => {
  const targetUser = await User.findById(req.params.id);

  if (!targetUser) {
    res.status(404);
    throw new Error('User not found');
  }

  if (targetUser.isAdmin) {
    res.status(400);
    throw new Error('Can not delete admin user');
  }

  await targetUser.deleteOne();

  res.json({
    message: 'User removed',
  });
});

// Get User By ID
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  res.json(user);
});

// Update User
const updateUser = asyncHandler(async (req, res) => {
  const targetUser = await User.findById(req.params.id);

  if (!targetUser) {
    res.status(404);
    throw new Error('User not found');
  }

  targetUser.name = req.body.name ?? targetUser.name;
  targetUser.email = req.body.email ?? targetUser.email;
  targetUser.isAdmin = !!req.body.isAdmin;

  const savedUser = await targetUser.save();

  res.json({
    _id: savedUser._id,
    name: savedUser.name,
    email: savedUser.email,
    isAdmin: savedUser.isAdmin,
  });
});

export {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
};