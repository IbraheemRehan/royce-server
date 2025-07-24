const express = require('express');
const router = express.Router();
const { addProduct, getProducts } = require('../controllers/productController');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

router.post('/add', upload.array('images', 3), addProduct);
router.get('/', getProducts);

module.exports = router;
