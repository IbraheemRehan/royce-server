const Product = require('../models/Product');
const fs = require('fs');
const path = require('path');


//  Get single product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (err) {
    console.error("❌ Error fetching product:", err);
    res.status(500).json({ message: "Server error" });
  }
};



// Add new product
const addProduct = async (req, res) => {
  try {
    const imagePaths = req.files?.map(file => `/uploads/${file.filename}`);
    const productData = {
      ...req.body,
      images: imagePaths || req.body.images,
    };

    const newProduct = new Product(productData);
    await newProduct.save();
    res.status(201).json({ success: true, message: 'Product added', product: newProduct });
  } catch (err) {
    console.error(err);
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

// Update product by ID
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const imagePaths = req.files?.map(file => `/uploads/${file.filename}`);

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { ...req.body, ...(imagePaths?.length ? { images: imagePaths } : {}) },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({ success: true, message: 'Product updated', product: updatedProduct });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Delete product by ID
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Product.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({ success: true, message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  addProduct,
  getProducts,
  getProductById,  
  updateProduct,
  deleteProduct
};
