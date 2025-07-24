const mongoose = require('mongoose');

// Item subdocument schema
const itemSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be at least 1']
  },
  price: {
    type: Number,
    required: true,
    min: [0, 'Price cannot be negative']
  }
}, { _id: false });

// Main order schema
const orderSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: [true, 'Customer name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true
  },
  address: {
    shipping: {
      type: String,
      required: [true, 'Shipping address is required'],
      trim: true
    },
    billing: {
      type: String,
      required: [true, 'Billing address is required'],
      trim: true
    }
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['Card', 'COD'] // helpful to restrict input
  },
  items: {
    type: [itemSchema],
    validate: [arrayLimit, 'Order must contain at least one item']
  },
  totalPrice: {
    type: Number,
    required: true,
    min: [0, 'Total price cannot be negative']
  },
  status: {
    type: String,
    default: 'Pending',
    enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Helper: Validate items array not empty
function arrayLimit(val) {
  return val.length > 0;
}

module.exports = mongoose.model('Order', orderSchema);
