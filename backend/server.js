const express = require("express");
const path = require("path");
const mongoose = require("./db");
const cors = require("cors");  // ⭐️ 加了cors
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const appRoutes = require('./routes/appRoutes');
const docRoutes = require('./routes/documentRoutes');

const app = express();

// 跨域处理
app.use(cors());

// 请求体解析
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 静态资源托管
app.use("/public", express.static(path.join(__dirname, "public")));
app.use('/uploads', express.static('uploads'));

// 路由注册
app.use('/api', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/applications', appRoutes);
app.use('/api/documents', docRoutes);

// 连接MongoDB成功后，启动服务器
mongoose.connection.once("open", () => {
  console.log("Server running on http://localhost:3000");
  app.listen(3000);
});
