const router = require('express').Router();
const Cart = require('../models/Cart');

// Save cart
router.post('/', async (req, res) => {
  const cart = new Cart(req.body);
  await cart.save();
  res.status(201).json(cart);
});

// Get user's cart
router.get('/:userId', async (req, res) => {
  const cart = await Cart.findOne({ userId: req.params.userId });
  res.json(cart);
});

module.exports = router;
