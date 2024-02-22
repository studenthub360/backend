require("dotenv").config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const protectRoute = require('./middleware/protection')
const { connectToDatabase } = require('./conn');

//Authentication
const authRoutes = require('./routes/authentication/auth');
const regRoutes = require('./routes/authentication/reg');

//user
const userRoutes = require('./routes/authentication/user');
const updateUserRoutes = require('./routes/authentication/updateDetails');
const sendOtp = require('./routes/authentication/otp');

//task management
const taskRoutes = require('./routes/time management/task')
const eventRoutes = require('./routes/time management/event')
const scheduleRoutes = require('./routes/time management/scheduling')

//networking
const netWorkGroupRoutes = require('./routes/social networking/netGroups')
const netWorkEventRoutes = require('./routes/social networking/newEvents')

//well-being
const playlistRoutes = require('./routes/well-being/playlist')
// const copingRoutes = require('./routes/well-being/coping')
const stressMangRoutes = require('./routes/well-being/stressManagement')
const mentalHealthRoutes = require('./routes/well-being/well-being-resc')

//Academic
const rescRoutes = require('./routes/academic/resources')
const tutoringRoutes = require('./routes/academic/tutoring')
// const notesRoutes = require('./routes/academic/notes')

const messageRoutes = require('./routes/chat/message');
const cookieParser = require( 'cookie-parser' );

//feedback
const feedbackAcad = require('./routes/academic/feedbackaca')
const feedbackSoc = require('./routes/social networking/feedback')
const feedbacktime = require('./routes/time management/feedback')
const feedbackwell = require('./routes/well-being/feedback')


// ...imports

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors()); // Enable CORS
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Connect to the database
connectToDatabase();

// Routes
app.get('/', (req, res) => {
    console.log('This is a route handler');
    res.send('everybody scream!');
});

//Authentication and verification
app.use("/api/auth", authRoutes);
app.use("/api/reg", regRoutes);

//message route
app.use("/api/message", messageRoutes);

//user route
app.use("/api/user", protectRoute, userRoutes);
app.use("/api/edit", protectRoute, updateUserRoutes);
app.use("/api/otp", protectRoute, sendOtp);

//task management
app.use("/api/task", protectRoute, taskRoutes);
app.use("/api/event", protectRoute, eventRoutes);
app.use("/api/schedule", protectRoute, scheduleRoutes);

// //networking
app.use("/api/netgrp", protectRoute, netWorkGroupRoutes);
app.use("/api/netevents", protectRoute, netWorkEventRoutes);

// //well-being
app.use("/api/playlist", protectRoute, playlistRoutes);
// app.use("/api/coping", protectRoute, copingRoutes);
app.use("/api/stress", protectRoute, stressMangRoutes);
app.use("/api/mental", protectRoute, mentalHealthRoutes);
app.use("/api/resources", protectRoute, rescRoutes);
app.use("/api/tutoring", protectRoute, tutoringRoutes);


//feedback
app.use("/api/feedback/acad", protectRoute, feedbackAcad);
app.use("/api/feedback/social", protectRoute, feedbackSoc);
app.use("/api/feedback/time", protectRoute, feedbacktime);
app.use("/api/feedback/well", protectRoute, feedbackwell);

// Global Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
