// server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const path = require('path');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve uploaded files (local or from Cloudinary)
app.use('/uploads', express.static('uploads'));

// Test API route
app.get('/', (req, res) => res.send('API is running'));

// Main API Routes
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/upload', require('./routes/upload')); // Local or Cloudinary image upload
app.use('/api/orders', require('./routes/order'));
app.use('/api/cart', require('./routes/cart'));



// Cloudinary config (optional)
// If you're uploading to Cloudinary from server
// make sure your `.env` contains CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET

// const cloudinary = require('cloudinary').v2;
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
