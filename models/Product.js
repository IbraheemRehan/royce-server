// models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  id: Number,
  name: String,
  price: String,
  images: [String],
  category: String,
  subcategory: String,
  description: String,
  stock: Number,
  isTrending: Boolean
});

module.exports = mongoose.model('Product', productSchema);
