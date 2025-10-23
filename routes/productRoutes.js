// server/routes/ProductRoutes.js
import express from "express";
const express = require('express');
const router = express.Router();
const {
  addProduct,
  getProducts,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Add new product
router.post('/add', upload.array('images', 3), addProduct);

// Get all products
router.get('/', getProducts);

// Update product by ID
router.put('/:id', upload.array('images', 3), updateProduct);

// Delete product by ID
router.delete('/:id', deleteProduct);

module.exports = router;
