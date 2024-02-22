const express = require('express');
const { queryAsync } = require('../../conn');
const cloudinary = require('../../utils/cloudinary');
const upload = require("../../middleware/multerConfig"); // Import cloudinary
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const groups = await queryAsync('SELECT * FROM netevents');
        
        // Map over the groups to fetch image URLs from Cloudinary
        const groupsWithImageURLs = await Promise.all(groups.map(async (group) => {
            const imageUrl = await cloudinary.url(group.image); // Fetch image URL
            return { ...group, imageUrl }; // Append imageUrl to group object
        }));

        res.status(200).json(groupsWithImageURLs);
    } catch (error) {
        console.error("Error fetching tasks:", error);
        res.status(500).json({ error: "Internal server error", message: error.message });
    }
});
router.get('/:id', async (req, res) => {
    const eventId = req.params.id;
    try {
        const event = await queryAsync('SELECT * FROM netevents WHERE id = ?', [eventId]);
        
        if (event.length === 0) {
            return res.status(404).json({ error: "Event not found" });
        }
        
        const imageUrl = await cloudinary.url(event[0].image);
        const eventWithImageUrl = { ...event[0], imageUrl };
        
        res.status(200).json(eventWithImageUrl);
    } catch (error) {
        console.error("Error fetching event:", error);
        res.status(500).json({ error: "Internal server error", message: error.message });
    }
});


router.post('/', upload.single("image"), async (req, res) => {
    try {
        const { groupName, details, eventContact, date, time } = req.body;

        if (!groupName || !details || !eventContact || !date || !time) {
            return res.status(400).json({ message: "All fields required" });
        }

        if (!req.file) {
            return res.status(400).json({ message: "Image required" });
        }

        const result = await cloudinary.uploader.upload(req.file.path);

        const newEvent = {
            groupName: groupName,
            details: details,
            eventContact: eventContact,
            date: date,
            time: time,
            image: result.public_id
        };

        await queryAsync('INSERT INTO netevents SET ?', newEvent);

        res.status(201).json({ message: "Networking Event created successfully", event: newEvent });
    } catch (error) {
        console.error("Error inserting event into the database:", error);
        res.status(500).json({ error: "Internal server error", message: error.message });
    }
});

module.exports = router;
