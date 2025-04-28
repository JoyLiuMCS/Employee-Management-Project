// middleware/upload.js
const multer = require('multer');
const path = require('path');

// 设置文件存储路径和文件名
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');  // 文件保存的目录
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));  // 使用时间戳命名文件
  }
});

// 文件过滤：只允许上传特定类型的文件
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];  // 允许的文件类型
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);  // 允许上传
  } else {
    cb(new Error('Invalid file type'), false);  // 不允许上传
  }
};

// 使用Multer设置上传中间件
const upload = multer({
  storage,
  fileFilter,
});

module.exports = upload;
