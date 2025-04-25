const express = require("express");
const path = require("path");
const mongoose = require("./db");
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const appRoutes = require('./routes/appRoutes');
const docRoutes = require('./routes/documentRoutes');


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/public", express.static(path.join(__dirname, "public")));

app.use('/uploads', express.static('uploads'));
app.use('/api', userRoutes);  // Make sure this is correct
app.use('/api/auth', authRoutes); 
app.use('/api/applications', appRoutes);
app.use('/api/documents', docRoutes);
mongoose.connection.once("open", () => {
  console.log("Server running on http://localhost:3000");
  app.listen(3000);  // Listening on port 3000
});