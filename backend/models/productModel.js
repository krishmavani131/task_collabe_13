import mongoose from 'mongoose';

const { Schema, model, Types } = mongoose;

const reviewSchema = new Schema(
  {
    name: String,
    rating: Number,
    comment: String,
    user: {
      type: Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const productSchema = new Schema(
  {
    user: {
      type: Types.ObjectId,
      ref: 'User',
      required: true,
    },

    name: {
      type: String,
      trim: true,
      required: true,
    },

    image: {
      type: String,
      required: true,
    },

    brand: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    reviews: {
      type: [reviewSchema],
      default: [],
    },

    rating: {
      type: Number,
      default: 0,
      required: true,
    },

    numReviews: {
      type: Number,
      default: 0,
      required: true,
    },

    price: {
      type: Number,
      default: 0,
      required: true,
    },

    countInStock: {
      type: Number,
      default: 0,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default model('Product', productSchema);