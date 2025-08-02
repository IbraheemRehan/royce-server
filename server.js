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

// ✅ Define allowed origins
const allowedOrigins = [
  "https://royce-client.vercel.app",
  "https://www.roycethreads.com",
  "https://roycethreads.com",
  "http://localhost:3000"
];

// ✅ CORS config
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || origin === "null") {
      console.log("✔ Allowed: No origin (likely from Google/Instagram)");
      return callback(null, true);
    }

    const isAllowed = allowedOrigins.some(o => origin.startsWith(o));
    if (isAllowed) {
      return callback(null, true);
    }

    console.log("❌ Blocked by CORS:", origin);
    callback(new Error(`Blocked by CORS: ${origin}`));
  },
  credentials: true,
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
};

// ✅ Apply CORS middleware
app.use(cors(corsOptions));

// ✅ Handle preflight OPTIONS for all routes
app.options('*', cors(corsOptions));

// Body parser
app.use(express.json());

// Serve uploads (if needed)
app.use('/uploads', express.static('uploads'));

// Health check
app.get("/", (req, res) => {
  res.send("Royce Threads API is running");
});

// API Routes
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/orders', require('./routes/order'));
app.use('/api/cart', require('./routes/cart'));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
