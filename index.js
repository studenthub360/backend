require("dotenv").config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { connectToDatabase } = require('./conn');
const authRoutes = require('./routes/auth');
const regRoutes = require('./routes/reg');
const userRoutes = require('./routes/user');

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors()); // Enable CORS
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to the database
connectToDatabase();

app.get('/', (req, res) => {
    console.log('This is a route handler');
    res.send('everybody scream!');
  });

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/reg", regRoutes);
app.use("/api/user", userRoutes);
// Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
