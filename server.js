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
  "http://localhost:3000",
  "https://www.roycethreads.com",
  "https://roycethreads.com"
];

app.use(cors({
  origin: function (origin, callback) {
    const allowedOrigins = [
      "https://royce-client.vercel.app",
      "https://www.roycethreads.com",
      "https://roycethreads.com"
    ];

    // ✅ Allow undefined, null or blank origin (Google, Instagram)
    if (!origin || origin === "null") {
      console.log("✔ Allowed: No origin (likely from Google/Instagram)");
      return callback(null, true);
    }

    // ✅ Allow if origin starts with allowed
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
}));


app.use(express.json());

app.options('*', cors());  // handles browser preflight requests
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

