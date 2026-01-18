// server/routes/productRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const {
  addProduct,
  getProducts,
  getProductById,   
  updateProduct,
  deleteProduct
} = require('../controllers/productController');

//  Multer setup
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// ✅ Add new product
router.post('/add', upload.array('images', 3), addProduct);

// ✅ Get all products
router.get('/', getProducts);

// ✅ Get single product by ID
router.get('/:id', getProductById);  // <-- Added route

// ✅ Update product by ID
router.put('/:id', upload.array('images', 3), updateProduct);

// ✅ Delete product by ID
router.delete('/:id', deleteProduct);

module.exports = router;
