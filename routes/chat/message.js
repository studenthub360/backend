const express = require('express');
const { sendMessage, getMessages } = require('../../controller/messageController');
const protectRoute = require('../../middleware/protection');
const messageUser = require('../../controller/messageUser');

const router = express.Router();

// Route for retrieving messages
router.get("/:id", protectRoute, getMessages);

// Route for retrieving friends
router.get("/friends", protectRoute, messageUser);

// Route for sending messages
router.post("/send/:id", protectRoute, sendMessage);

module.exports = router;
