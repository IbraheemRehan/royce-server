const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const axios = require('axios');

const BASE_URL = process.env.BASE_URL || 'https://royce-client.vercel.app';

// Simple email format validator
const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

// Function to send email via Resend API
const sendEmail = async (to, subject, html) => {
  try {
    const response = await axios.post(
      'https://api.resend.com/emails',
      {
        from: process.env.RESEND_EMAIL, // default sending email
        to,
        subject,
        html,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );
    console.log(`✅ Email sent to ${to}:`, response.data);
  } catch (err) {
    console.error(`❌ Email to ${to} failed:`, err.response?.data || err.message);
  }
};

// @route   POST /api/orders
// @desc    Create new order
router.post('/', async (req, res) => {
  try {
    console.log("🧭 Request from:", req.headers['user-agent']);
    console.log("📦 Order payload:", JSON.stringify(req.body, null, 2));

    const { customerName, email, items, totalPrice, address, phone, paymentMethod } = req.body;

    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'Please enter a valid email address.' });
    }

    if (
      !customerName ||
      !email ||
      !items || !Array.isArray(items) || items.length === 0 ||
      totalPrice === undefined || isNaN(totalPrice) ||
      !address || !address.shipping || !address.billing ||
      !phone ||
      !paymentMethod
    ) {
      return res.status(400).json({
        error: 'Please fill all required fields: name, email, shipping and billing address, phone, payment method, and at least one item.'
      });
    }

    // Save order in DB
    const newOrder = new Order({ customerName, email, items, totalPrice, address, phone, paymentMethod, status: 'Pending' });
    const savedOrder = await newOrder.save();

    const itemsHtml = items.map(item => {
      const link = `${BASE_URL}/ProductDetails.html?productId=${item.productId}`;
      return `<li>${item.name} (Size: ${item.size}) x${item.quantity} - Rs.${item.price} <br>
              <a href="${link}" target="_blank">🔗 View Product</a></li>`;
    }).join('');

    // Send emails
    await sendEmail(
      process.env.ADMIN_EMAIL,
      '📦 New Order Received',
      `<h3>New Order by ${customerName}</h3>
       <p><strong>Email:</strong> ${email}</p>
       <p><strong>Phone:</strong> ${phone}</p>
       <p><strong>Shipping Address:</strong> ${address.shipping}</p>
       <p><strong>Billing Address:</strong> ${address.billing}</p>
       <p><strong>Payment Method:</strong> ${paymentMethod}</p>
       <p><strong>Total:</strong> Rs.${totalPrice}</p>
       <h4>Items Ordered:</h4>
       <ul>${itemsHtml}</ul>`
    );

    await sendEmail(
      email,
      '✅ Order Confirmation - Royce Threads',
      `<h2>Hi ${customerName},</h2>
       <p>Thanks for your order with <strong>Royce Threads</strong>!</p>
       <p>We’ve received your order of Rs.${totalPrice} and will contact you shortly.</p>
       <p><strong>Shipping Address:</strong> ${address.shipping}</p>
       <p><strong>Billing Address:</strong> ${address.billing}</p>
       <h4>Your Order:</h4>
       <ul>${itemsHtml}</ul>
       <p>Stay stylish,</p>
       <p><strong>Royce Threads</strong></p>`
    );

    res.status(201).json(savedOrder);

  } catch (err) {
    console.error("❌ Order placement failed:", err);
    res.status(500).json({ error: 'Failed to place order', message: err.message });
  }
});

module.exports = router;
