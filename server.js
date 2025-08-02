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

const allowedOrigins = [
  "https://royce-client.vercel.app",
  "https://roycethreads.com",
  "https://www.roycethreads.com",
  "http://localhost:3000"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) {
      return callback(null, true); // allow requests like Postman or curl
    }

    const allowedOrigins = [
      "https://royce-client.vercel.app",
      "https://roycethreads.com",
      "https://www.roycethreads.com",
      "http://localhost:3000"
    ];

    if (
      allowedOrigins.includes(origin) ||
      origin.endsWith(".vercel.app") || // allow all Vercel previews
      origin.includes("royce-client")   // fallback for dynamic subdomains
    ) {
      callback(null, true);
    } else {
      console.log("❌ Blocked by CORS:", origin);
      callback(new Error("Blocked by CORS: " + origin));
    }
  },
  credentials: false // ⚠️ Set to false if you're not using cookies/sessions
}));



app.use(express.json());

// Serve uploaded files (if local)
app.use('/uploads', express.static('uploads'));

// ✅ Health check route for Railway
app.get("/", (req, res) => {
  res.send("Royce Threads API is running");
});

// Main API Routes
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/orders', require('./routes/order'));
app.use('/api/cart', require('./routes/cart'));

// Start the server with Railway-compatible PORT
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

