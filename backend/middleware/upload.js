const fs = require('fs');
const path = require('path');
const multer = require('multer');

const billsDir = path.join(__dirname, '..', 'uploads', 'bills');

function ensureBillsDir() {
  fs.mkdirSync(billsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination(_req, _file, cb) {
    ensureBillsDir();
    cb(null, billsDir);
  },
  filename(_req, file, cb) {
    const ext = path.extname(file.originalname || '').toLowerCase() || '.jpg';
    const safeExt = ['.jpg', '.jpeg', '.png', '.webp', '.heic'].includes(ext) ? ext : '.jpg';
    cb(null, `${Date.now()}-${Math.random().toString(36).slice(2, 10)}${safeExt}`);
  }
});

const uploadBill = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter(_req, file, cb) {
    const ok = /^image\/(jpeg|jpg|png|webp|heic|heif)$/i.test(file.mimetype || '');
    if (!ok) return cb(new Error('Please upload a photo (JPG, PNG or WEBP).'));
    cb(null, true);
  }
});

module.exports = { uploadBill, billsDir, ensureBillsDir };
