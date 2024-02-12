require("dotenv").config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const protectRoute = require('./middleware/protection')
const { connectToDatabase } = require('./conn');
const authRoutes = require('./routes/authentication/auth');
const regRoutes = require('./routes/authentication/reg');
const userRoutes = require('./routes/authentication/user');
const taskRoutes = require('./routes/time management/task')
const eventRoutes = require('./routes/time management/event')
const scheduleRoutes = require('./routes/time management/scheduling')
const messageRoutes = require('./routes/chat/message');
const cookieParser = require( 'cookie-parser' );

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors()); // Enable CORS
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser())

// Connect to the database
connectToDatabase();

app.get('/', (req, res) => {
    console.log('This is a route handler');
    res.send('everybody scream!');
  });

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/reg", regRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/user", protectRoute, userRoutes);
app.use("/api/task", protectRoute, taskRoutes);
app.use("/api/event", protectRoute, eventRoutes);
app.use("/api/schedule", protectRoute, scheduleRoutes);
// Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
