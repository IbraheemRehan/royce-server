const express = require("express");
const router = express.Router();
const Newsletter = require("../models/Newsletter");
const axios = require("axios");

// Helper: Simple email format validator
const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

// Function to send email via Resend API
const sendEmail = async (to, subject, html) => {
  try {
    const response = await axios.post(
      "https://api.resend.com/emails",
      {
        from: process.env.RESEND_EMAIL, // e.g., "newsletter@roycethreads.com"
        to,
        subject,
        html,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log(`✅ Newsletter email sent to ${to}:`, response.data);
  } catch (err) {
    console.error(`❌ Failed to send newsletter email to ${to}:`, err.response?.data || err.message);
  }
};

// POST /api/newsletter
router.post("/", async (req, res) => {
  try {
    const { email } = req.body;

    // Validate email
    if (!email || !isValidEmail(email)) {
      return res.status(400).json({ message: "Please provide a valid email." });
    }

    // Check if already subscribed
    const existing = await Newsletter.findOne({ email });
    if (existing) {
      return res.status(400).json({
        message: "You are already subscribed to Royce Threads newsletter",
      });
    }

    // Save email to DB
    const subscription = new Newsletter({ email });
    await subscription.save();

    // Send welcome email via Resend
    const htmlContent = `
      <div style="font-family: Arial; padding:20px;">
        <h2>Welcome to Royce Threads 👕✨</h2>
        <p>Thank you for subscribing to our newsletter.</p>
        <p>You will now receive:</p>
        <ul>
          <li>🔥 Exclusive sales</li>
          <li>🆕 New arrivals</li>
          <li>🎁 Special offers</li>
        </ul>
        <p>We’re glad to have you with us.</p>
        <strong>– Team Royce Threads</strong>
      </div>
    `;
    await sendEmail(email, "🎉 Welcome to Royce Threads Newsletter!", htmlContent);

    res.status(200).json({
      message: "Subscribed successfully. Please check your email!",
    });

  } catch (err) {
    console.error("❌ Newsletter subscription failed:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
