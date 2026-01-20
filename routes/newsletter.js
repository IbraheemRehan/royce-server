const express = require("express");
const router = express.Router();
const Newsletter = require("../models/Newsletter");
const Resend = require("resend");

// Initialize Resend with API key from env
const resend = new Resend(process.env.RESEND_API_KEY);

// POST /api/newsletter
router.post("/", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    // Check if already subscribed
    const existing = await Newsletter.findOne({ email });
    if (existing) {
      return res.status(400).json({
        message: "You are already subscribed to Royce Threads newsletter"
      });
    }

    // Save email to DB
    const subscription = new Newsletter({ email });
    await subscription.save();

    // Send welcome email using Resend
    await resend.emails.send({
      from: process.env.RESEND_EMAIL,   // e.g., "newsletter@roycethreads.com"
      to: email,
      subject: "🎉 Welcome to Royce Threads Newsletter!",
      html: `
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
      `
    });

    res.status(200).json({
      message: "Subscribed successfully. Please check your email!"
    });

  } catch (error) {
    console.error("Newsletter Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
