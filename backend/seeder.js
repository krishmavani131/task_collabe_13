import mongoose from 'mongoose';
import dotenv from 'dotenv';
import colors from 'colors';

import users from './data/users.js';
import products from './data/products.js';

import User from './models/userModel.js';
import Product from './models/productModel.js';
import Order from './models/orderModel.js';

import connectDB from './config/db.js';

dotenv.config();

connectDB();

const importData = async () => {
  try {
    await Promise.all([
      Order.deleteMany(),
      Product.deleteMany(),
      User.deleteMany(),
    ]);

    const createdUsers = await User.insertMany(users);

    const adminUser = createdUsers[0]._id;

    const sampleProducts = products.map((product) => ({
      ...product,
      user: adminUser,
    }));

    await Product.insertMany(sampleProducts);

    console.log('Data Imported!'.green.inverse);

    process.exit(0);
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Promise.all([
      Order.deleteMany(),
      Product.deleteMany(),
      User.deleteMany(),
    ]);

    console.log('Data Destroyed!'.red.inverse);

    process.exit(0);
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

process.argv[2] === '-d' ? destroyData() : importData();