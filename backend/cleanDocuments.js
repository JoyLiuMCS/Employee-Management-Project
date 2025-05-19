const mongoose = require('mongoose');

const uri = 'mongodb+srv://dbUser:wrsalc2025%40@mycluster.sx43c.mongodb.net/?retryWrites=true&w=majority&appName=myCluster';

// 连接数据库
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('Connected to MongoDB Atlas');

    const Document = require('../models/Document');  // 根据实际路径调整

    const result = await Document.deleteMany({ type: { $exists: false } });
    console.log(`Deleted ${result.deletedCount} documents without a type field.`);

    mongoose.disconnect();
  })
  .catch(err => console.error('Connection error', err));
