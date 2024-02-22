const express = require('express');
const { queryAsync } = require('../../conn');
const cloudinary = require('../../utils/cloudinary');
const upload = require("../../middleware/multerConfig"); // Import cloudinary
const router = express.Router();

router.get('/', async(req, res) =>{
    try {
        const groups = await queryAsync('SELECT * FROM netgrp');
        const groupsWithImageURLs = await Promise.all(groups.map(async (group) => {
            const imageUrl = await cloudinary.url(group.image); // Fetch image URL
            return { ...group, imageUrl }; // Append imageUrl to group object
        }));
        res.status(200).json(groupsWithImageURLs);
    } catch (error) {
        console.error("Error fetching tasks:", error);
        res.status(500).json({ error: "Internal server error", message: error.message });
    }

})
router.post('/', upload.single("image"), async (req, res) => {
    try {
        // const userId = req.user.id;
        const { groupName, description, groupLink} = req.body;

        if (!groupName || !description || !groupLink) {
            return res.status(400).json({ message: "All fields required" });
        }
        if (!req.file) {
            return res.status(400).json({ message: "Image required" });
        }
        const result = await cloudinary.uploader.upload(req.file.path);
        const newGroup = {
            groupName : groupName,
            groupDescription : description,
            groupLink : groupLink,
            image : result.public_id
        };

        await queryAsync('INSERT INTO netgrp SET ?', newGroup);

        res.status(201).json({ message: "Networking Group created successfully", task: newGroup });
    } catch (error) {
        console.error("Error from the task endpoint:", error);
        res.status(500).json({ error: "Internal server error", message : error });
    }
});


module.exports = router