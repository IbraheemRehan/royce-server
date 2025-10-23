// ✅ DO NOT put `console.log(req.headers.origin)` here — req is undefined

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
  "http://localhost:3000",
  "https://l.instagram.com",
  'https://www.instagram.com',
  'capacitor://localhost', 
  "https://www.google.com"
];

app.use(cors({
  origin: function (origin, callback) {
    console.log("🌐 Incoming request origin:", origin);
    if (!origin) return callback(null, true);

    if (
      allowedOrigins.includes(origin) ||
      origin.endsWith(".vercel.app") ||
      origin.includes("royce-client") ||
      origin.includes("instagram.com") ||
      origin.includes("google.com")
    ) {
      callback(null, true);
    } else {
      console.log("❌ Blocked by CORS:", origin);
      callback(new Error("Blocked by CORS: " + origin));
    }
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false // OK if you don't use cookies
}));



app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.get("/", (req, res) => {
  console.log("✅ Request to / from origin:", req.headers.origin);
  res.send("Royce Threads API is running");
});



// Routes
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/orders', require('./routes/order'));
app.use('/api/cart', require('./routes/cart'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
