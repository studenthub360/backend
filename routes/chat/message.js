const express = require('express');
const { sendMessage, getMessages } = require('../../controller/messageController');
const protectRoute = require('../../middleware/protection');
// const get
// import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();

router.get("/:id",protectRoute, getMessages);
router.post("/send/:id",protectRoute, sendMessage);

module.exports = router