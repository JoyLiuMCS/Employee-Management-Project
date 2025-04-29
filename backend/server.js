require('dotenv').config();
const cors = require('cors');
const express = require("express");
const path = require("path");
const mongoose = require("./db");
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const docRoutes = require('./routes/documentRoutes');
const appRoutes = require('./routes/appRoutes'); // 🔥 这个虽然保留着，但后面合并到onboardingRoutes了
const applicationRoutes = require('./routes/applicationRoutes');
const emailRoutes = require('./routes/emailRoutes');
const onboardingRoutes = require('./routes/onboardingRoutes'); // ⭐新加的
const errorHandler = require('./middleware/errorHandler');

const app = express();

// ⭐允许前端跨域访问
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/public", express.static(path.join(__dirname, "public")));
app.use('/uploads', express.static('uploads')); // ⭐上传文件也要能访问

console.log('Mounting application routes at /api/...');

// ⭐规范化所有接口
app.use('/api/applications', applicationRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/documents', docRoutes);
app.use('/api/email', emailRoutes);

// 🔥🔥这里改了：统一onboarding相关功能
app.use('/api/onboarding', onboardingRoutes);

// 错误处理
app.use(errorHandler);

// 连接MongoDB
mongoose.connection.once("open", () => {
  console.log("Server running on http://localhost:3000");
  app.listen(3000);
});
