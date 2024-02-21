const express = require('express')
const {queryAsync} = require('../../conn')
router = express.Router()
// const cloudinary = require("../utils/cloudinary");
// const upload = require("../middleware/multerConfig");
// const upload = require('../../middleware/multerConfig')

router.get('/', async(req, res) =>{
    try {
        const resources = await queryAsync('SELECT * FROM resources');
        res.status(200).json(resources);

    } catch (error) {
        console.error("Error fetching tasks:", error);
        res.status(500).json({ error: "Internal server error", message : error });
    }
})
router.post('/', async (req, res) => {
    try {
        // if (!req.file) {
        //     return res.status(400).json({ message: 'No image uploaded' });
        //   }
        const userId = req.user.id;
        const { name, description, link} = req.body;
        // const image = req.file.filename; 

        if (!name || !description || !link || !description) {
            return res.status(400).json({ message: "All fields required" });
        }

        const newResources = {
            name : name,
            // image : image,
            link : link,
            description : description,
            user_id : userId
        };

        await queryAsync('INSERT INTO resources SET ?', newResources);

        res.status(201).json({ message: "Resources created successfully", Resources: newResources });
    } catch (error) {
        console.error("Error from the resources endpoint:", error);
        res.status(500).json({ error: "Internal server error", message : error });
    }
});


module.exports = router