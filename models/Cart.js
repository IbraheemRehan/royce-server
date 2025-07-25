const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  items: [
    {
      productId: {
        type: String,
        required: true
      },
      size: {
        type: String,      //  NEW: Add size to each item
        required: true
      },
      quantity: {
        type: Number,
        required: true,
        min: [1, 'Quantity must be at least 1']
      }
    }
  ]
});

module.exports = mongoose.model('Cart', cartSchema);
