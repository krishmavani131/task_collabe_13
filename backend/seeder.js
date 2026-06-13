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
    await Order.deleteMany({});
    await Product.deleteMany({});
    await User.deleteMany({});

    const insertedUsers = await User.insertMany(users);

    const adminId = insertedUsers[0]._id;

    const productData = products.map((item) => ({
      ...item,
      user: adminId,
    }));

    await Product.insertMany(productData);

    console.log('Data Imported Successfully!'.green.inverse);
    process.exit(0);
  } catch (err) {
    console.error(`${err}`.red.inverse);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Order.deleteMany({});
    await Product.deleteMany({});
    await User.deleteMany({});

    console.log('Data Removed Successfully!'.red.inverse);
    process.exit(0);
  } catch (err) {
    console.error(`${err}`.red.inverse);
    process.exit(1);
  }
};

const action = process.argv[2];

action === '-d' ? destroyData() : importData();