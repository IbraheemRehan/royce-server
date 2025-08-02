const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const nodemailer = require('nodemailer');

const BASE_URL = process.env.BASE_URL || 'https://royce-client.vercel.app';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS
  }
});
// Simple email format validator
const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

// @route   POST /api/orders
// @desc    Create new order
router.post('/', async (req, res) => {
  try {
    const {
      customerName,
      email,
      items,
      totalPrice,
      address,
      phone,
      paymentMethod
    } = req.body;
    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'Please enter a valid email address.' });
    }
    // Validate required fields
    if (
      !customerName ||
      !email ||
      !items || !Array.isArray(items) || items.length === 0 ||
      !totalPrice ||
      !address || !address.shipping || !address.billing ||
      !phone ||
      !paymentMethod
    ) {
      return res.status(400).json({
        error: 'Please fill all required fields: name, email, shipping and billing address, phone, payment method, and at least one item.'
      });
    }

    const newOrder = new Order({
      customerName,
      email,
      items,
      totalPrice,
      address, // includes both billing and shipping
      phone,
      paymentMethod,
      status: 'Pending'
    });

    const savedOrder = await newOrder.save();

    // 🔗 Construct product links
    const itemsHtml = items.map(item => {
      const link = `${BASE_URL}/ProductDetails.html?productId=${item.productId}`;
      return `<li>
    ${item.name} (Size: ${item.size}) x${item.quantity} - Rs.${item.price} <br>
    <a href="${link}" target="_blank">🔗 View Product</a>
  </li>`;
    }).join('');


    // Email to Admin
    const adminMailOptions = {
      from: process.env.GMAIL_USER,
      to: process.env.ADMIN_EMAIL,
      subject: '📦 New Order Received',
      html: `
        <h3>New Order by ${customerName}</h3>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Shipping Address:</strong> ${address.shipping}</p>
        <p><strong>Billing Address:</strong> ${address.billing}</p>
        <p><strong>Payment Method:</strong> ${paymentMethod}</p>
        <p><strong>Total:</strong> Rs.${totalPrice}</p>
        <h4>Items Ordered:</h4>
        <ul>${itemsHtml}</ul>
      `
    };

    // Email to Customer
    const customerMailOptions = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: '✅ Order Confirmation - Royce Threads',
      html: `
        <h2>Hi ${customerName},</h2>
        <p>Thanks for your order with <strong>Royce Threads</strong>!</p>
        <p>We’ve received your order of Rs.${totalPrice} and will contact you shortly.</p>
        <p><strong>Shipping Address:</strong> ${address.shipping}</p>
        <p><strong>Billing Address:</strong> ${address.billing}</p>
        <h4>Your Order:</h4>
        <ul>${itemsHtml}</ul>
        <p>Stay stylish,</p>
        <p><strong>Royce Threads</strong></p>
      `
    };

    await transporter.sendMail(adminMailOptions);
    await transporter.sendMail(customerMailOptions);

    res.status(201).json(savedOrder);
  } catch (err) {
    console.error("❌ Order placement failed:", err); 
    res.status(500).json({ error: 'Failed to place order', message: err.message });
  }

});

module.exports = router;
