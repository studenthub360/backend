const express = require('express')
const {queryAsync} = require('../../conn')
router = express.Router()

router.get('/', async(req, res) =>{
    try {
        const groups = await queryAsync('SELECT * FROM netgrp');
        res.status(200).json(groups);

    } catch (error) {
        console.error("Error fetching tasks:", error);
        res.status(500).json({ error: "Internal server error", message : error });
    }
})
router.post('/', async (req, res) => {
    try {
        // const userId = req.user.id;
        const { groupName, description, groupLink} = req.body;

        if (!groupName || !description || !groupLink) {
            return res.status(400).json({ message: "All fields required" });
        }

        const newGroup = {
            groupName : groupName,
            groupDescription : description,
            groupLink : groupLink
        };

        await queryAsync('INSERT INTO netgrp SET ?', newGroup);

        res.status(201).json({ message: "Networking Group created successfully", task: newGroup });
    } catch (error) {
        console.error("Error from the task endpoint:", error);
        res.status(500).json({ error: "Internal server error", message : error });
    }
});


module.exports = router