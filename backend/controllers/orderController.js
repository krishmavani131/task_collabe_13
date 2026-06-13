import asyncHandler from '../middleware/asyncHandler.js';
import Order from '../models/orderModel.js';
import Product from '../models/productModel.js';
import { calcPrices } from '../utils/calcPrices.js';
import {
  verifyPayPalPayment,
  checkIfNewTransaction,
} from '../utils/paypal.js';

// Create Order
const addOrderItems = asyncHandler(async (req, res) => {
  const { orderItems, shippingAddress, paymentMethod } = req.body;

  if (!orderItems?.length) {
    res.status(400);
    throw new Error('No order items');
  }

  const products = await Product.find({
    _id: { $in: orderItems.map((item) => item._id) },
  });

  const updatedItems = orderItems.map((item) => {
    const product = products.find(
      (p) => p._id.toString() === item._id
    );

    return {
      ...item,
      product: item._id,
      price: product.price,
      _id: undefined,
    };
  });

  const prices = calcPrices(updatedItems);

  const order = new Order({
    user: req.user._id,
    orderItems: updatedItems,
    shippingAddress,
    paymentMethod,
    ...prices,
  });

  const savedOrder = await order.save();

  res.status(201).json(savedOrder);
});

// Get Logged In User Orders
const getMyOrders = asyncHandler(async (req, res) => {
  const userOrders = await Order.find({
    user: req.user._id,
  });

  res.status(200).json(userOrders);
});

// Get Order By Id
const getOrderById = asyncHandler(async (req, res) => {
  const foundOrder = await Order.findById(req.params.id).populate(
    'user',
    'name email'
  );

  if (!foundOrder) {
    res.status(404);
    throw new Error('Order not found');
  }

  res.status(200).json(foundOrder);
});

// Update Order To Paid
const updateOrderToPaid = asyncHandler(async (req, res) => {
  const paymentInfo = await verifyPayPalPayment(req.body.id);

  if (!paymentInfo.verified) {
    throw new Error('Payment not verified');
  }

  const transactionIsNew = await checkIfNewTransaction(
    Order,
    req.body.id
  );

  if (!transactionIsNew) {
    throw new Error('Transaction has been used before');
  }

  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  if (order.totalPrice.toString() !== paymentInfo.value) {
    throw new Error('Incorrect amount paid');
  }

  order.isPaid = true;
  order.paidAt = Date.now();

  order.paymentResult = {
    id: req.body.id,
    status: req.body.status,
    update_time: req.body.update_time,
    email_address: req.body.payer.email_address,
  };

  const paidOrder = await order.save();

  res.json(paidOrder);
});

// Update Order To Delivered
const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  order.isDelivered = true;
  order.deliveredAt = Date.now();

  const deliveredOrder = await order.save();

  res.json(deliveredOrder);
});

// Get All Orders
const getOrders = asyncHandler(async (req, res) => {
  const allOrders = await Order.find().populate(
    'user',
    'id name'
  );

  res.json(allOrders);
});

export {
  addOrderItems,
  getMyOrders,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getOrders,
};