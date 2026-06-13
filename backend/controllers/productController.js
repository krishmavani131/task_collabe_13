import asyncHandler from '../middleware/asyncHandler.js';
import Product from '../models/productModel.js';

// Get All Products
const getProducts = asyncHandler(async (req, res) => {
  const page = Number(req.query.pageNumber) || 1;
  const limit = Number(process.env.PAGINATION_LIMIT);

  const searchFilter = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: 'i',
        },
      }
    : {};

  const totalProducts = await Product.countDocuments(searchFilter);

  const products = await Product.find(searchFilter)
    .skip((page - 1) * limit)
    .limit(limit);

  res.json({
    products,
    page,
    pages: Math.ceil(totalProducts / limit),
  });
});

// Get Product By Id
const getProductById = asyncHandler(async (req, res) => {
  const foundProduct = await Product.findById(req.params.id);

  if (!foundProduct) {
    res.status(404);
    throw new Error('Product not found');
  }

  res.json(foundProduct);
});

// Create Product
const createProduct = asyncHandler(async (req, res) => {
  const sampleProduct = await Product.create({
    user: req.user._id,
    name: 'Sample name',
    image: '/images/sample.jpg',
    brand: 'Sample brand',
    category: 'Sample category',
    description: 'Sample description',
    price: 0,
    countInStock: 0,
    numReviews: 0,
  });

  res.status(201).json(sampleProduct);
});

// Update Product
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const {
    name,
    price,
    description,
    image,
    brand,
    category,
    countInStock,
  } = req.body;

  Object.assign(product, {
    name,
    price,
    description,
    image,
    brand,
    category,
    countInStock,
  });

  const updatedProduct = await product.save();

  res.json(updatedProduct);
});

// Delete Product
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  await product.deleteOne();

  res.json({
    message: 'Product removed',
  });
});

// Create Review
const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const reviewExists = product.reviews.some(
    (review) =>
      review.user.toString() === req.user._id.toString()
  );

  if (reviewExists) {
    res.status(400);
    throw new Error('Product already reviewed');
  }

  product.reviews.push({
    name: req.user.name,
    rating: Number(rating),
    comment,
    user: req.user._id,
  });

  product.numReviews = product.reviews.length;

  product.rating =
    product.reviews.reduce(
      (total, review) => total + review.rating,
      0
    ) / product.reviews.length;

  await product.save();

  res.status(201).json({
    message: 'Review added',
  });
});

// Get Top Rated Products
const getTopProducts = asyncHandler(async (req, res) => {
  const topProducts = await Product.find()
    .sort({ rating: -1 })
    .limit(3);

  res.json(topProducts);
});

export {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getTopProducts,
};