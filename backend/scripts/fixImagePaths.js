import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import fs from 'fs';

dotenv.config();

const DB = process.env.MONGO_URI || 'mongodb://localhost:27017/proshop';

import Product from '../models/productModel.js';

const fix = async () => {
  try {
    await mongoose.connect(DB);
    console.log('Connected to DB');

    const products = await Product.find({}).lean();
    let updated = 0;

    for (const p of products) {
      if (p.image && p.image.includes('\\')) {
        const fixed = p.image.replace(/\\\\/g, '/');
        await Product.updateOne({ _id: p._id }, { $set: { image: fixed } });
        updated++;
        console.log(`Fixed ${p._id}: ${p.image} -> ${fixed}`);
      }
    }

    console.log(`Done. Updated ${updated} products.`);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

fix();
