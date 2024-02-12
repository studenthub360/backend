const express = require('express')
const {queryAsync} = require('../../conn')
router = express.Router()

router.get('/', async(req, res) =>{
    try {
        const groups = await queryAsync('SELECT * FROM management');
        res.status(200).json(groups);

    } catch (error) {
        console.error("Error fetching tasks:", error);
        res.status(500).json({ error: "Internal server error", message : error });
    }
})
router.post('/', async (req, res) => {
    try {
        const userId = req.user.id;
        const { technique, link} = req.body;

        if (!technique || !link) {
            return res.status(400).json({ message: "All fields required" });
        }

        const newManagement = {
            name : technique,
            link : link,
            user_id : userId
        };

        await queryAsync('INSERT INTO management SET ?', newManagement);

        res.status(201).json({ message: "Networking Event created successfully", managementTechnique: newManagement });
    } catch (error) {
        console.error("Error from the task endpoint:", error);
        res.status(500).json({ error: "Internal server error", message : error });
    }
});


module.exports = router