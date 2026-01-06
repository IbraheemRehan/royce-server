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
  "https://www.google.com",
  "*"
];

app.use(cors({
  origin: [
    "http://localhost:5173",   
    "http://localhost:3000",   
    "https://royce-client.vercel.app",
    "https://roycethreads.com",
    "https://www.roycethreads.com",
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
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
