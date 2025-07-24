// controllers/productController.js
const Product = require('../models/Product');

// Add single product from form/upload
const addProduct = async (req, res) => {
  try {
    const imagePaths = req.files?.map(file => `/uploads/${file.filename}`); // if using local uploads
    const productData = {
      ...req.body,
      images: imagePaths || req.body.images, // for cloudinary or local
    };

    const newProduct = new Product(productData);
    await newProduct.save();
    res.status(201).json({ success: true, message: 'Product added', product: newProduct });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get all products
const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  addProduct,
  getProducts,
};
