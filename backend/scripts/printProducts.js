import dotenv from 'dotenv';
import mongoose from 'mongoose';
dotenv.config();
import Product from '../models/productModel.js';

const DB = process.env.MONGO_URI || 'mongodb://localhost:27017/proshop';

const run = async () => {
  await mongoose.connect(DB);
  const products = await Product.find({}).limit(10).lean();
  for (const p of products) {
    console.log(p._id.toString(), p.name, '->', p.image);
  }
  process.exit(0);
};

run().catch((e) => { console.error(e); process.exit(1); });
