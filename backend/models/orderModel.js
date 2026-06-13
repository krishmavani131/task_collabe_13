import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: Types.ObjectId,
      ref: 'User',
      required: true,
    },

    orderItems: [
      {
        name: String,
        qty: Number,
        image: String,
        price: Number,
        product: {
          type: Types.ObjectId,
          ref: 'Product',
          required: true,
        },
      },
    ],

    shippingAddress: {
      address: String,
      city: String,
      postalCode: String,
      country: String,
    },

    paymentMethod: {
      type: String,
      required: true,
    },

    paymentResult: {
      id: String,
      status: String,
      update_time: String,
      email_address: String,
    },

    itemsPrice: {
      type: Number,
      default: 0,
      required: true,
    },

    taxPrice: {
      type: Number,
      default: 0,
      required: true,
    },

    shippingPrice: {
      type: Number,
      default: 0,
      required: true,
    },

    totalPrice: {
      type: Number,
      default: 0,
      required: true,
    },

    isPaid: {
      type: Boolean,
      default: false,
    },

    paidAt: Date,

    isDelivered: {
      type: Boolean,
      default: false,
    },

    deliveredAt: Date,
  },
  {
    timestamps: true,
  }
);

export default model('Order', orderSchema);