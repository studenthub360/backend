const express = require('express')
const {queryAsync} = require('../../conn')
router = express.Router()

router.get('/', async(req, res) =>{
    try {
        const type = 1
        const resources = await queryAsync('SELECT * FROM resources WHERE type = ?', type);
        res.status(200).json(resources);

    } catch (error) {
        console.error("Error fetching resources:", error);
        res.status(500).json({ error: "Internal server error", message : error });
    }
})
router.post('/', async (req, res) => {
    try {
        const userId = req.user.id;
        const { name, image, link} = req.body;

        if (!name || !image || !link) {
            return res.status(400).json({ message: "All fields required" });
        }

        const newResources = {
            name : groupName,
            image : image,
            link : link,
            user_id : userId,
            type : 1
        };

        await queryAsync('INSERT INTO resources SET ?', newResources);

        res.status(201).json({ message: "Resources created successfully", Resources: newResources });
    } catch (error) {
        console.error("Error from the resources endpoint:", error);
        res.status(500).json({ error: "Internal server error", message : error });
    }
});


module.exports = router