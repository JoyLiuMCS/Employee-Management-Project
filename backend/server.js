require('dotenv').config();
const cors = require('cors');
const express = require("express");
const path = require("path");
const mongoose = require("./db");
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const docRoutes = require('./routes/documentRoutes');
const appRoutes = require('./routes/appRoutes');
const applicationRoutes = require('./routes/applicationRoutes');

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',  
  credentials: true                 
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/public", express.static(path.join(__dirname, "public")));

console.log('Mounting application routes at /api/applications');

app.use('/api/applications', applicationRoutes);
app.use('/api/users', userRoutes);
app.use('/api/submitApp', appRoutes);
app.use('/uploads', express.static('uploads'));
app.use('/api/auth', authRoutes); 
app.use('/api/documents', docRoutes);

mongoose.connection.once("open", () => {
  console.log("Server running on http://localhost:3000");
  app.listen(3000);
});
