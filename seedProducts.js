// seedProducts.js
const mongoose = require('mongoose');
const Product = require('./models/Product');
const dotenv = require('dotenv');
const express = require('express');

dotenv.config();

const productData = require('./products.json'); // save your JSON as products.json in root

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Product.deleteMany(); // optional: remove old data
    await Product.insertMany(productData);
    console.log('Products inserted');
    process.exit();
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedDB();
