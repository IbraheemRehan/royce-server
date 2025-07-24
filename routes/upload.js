const router = require('express').Router();
const multer = require('multer');
const cloudinary = require('../utils/cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const storage = new CloudinaryStorage({
  cloudinary,
  params: { folder: 'products' },
});
const upload = multer({ storage });

router.post('/', upload.single('image'), (req, res) => {
  res.json({ url: req.file.path });
});

module.exports = router;
