// seedProducts.js
const mongoose = require('mongoose');
const Product = require('./models/Product');
const dotenv = require('dotenv');
const express = require('express');
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import connectDB from "./config/db.js";
import productRoutes from "./routes/productRoutes.js";
import authRoutes from "./routes/auth.js";
import uploadRoutes from "./routes/upload.js";
import orderRoutes from "./routes/order.js";
import cartRoutes from "./routes/cart.js";

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
