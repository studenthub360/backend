const express = require('express')
const {queryAsync} = require('../../conn')
const upload = require('../../middleware/multerConfig')
router = express.Router()

router.get('/', async(req, res) =>{
    try {
        const groups = await queryAsync('SELECT * FROM netevents');
        res.status(200).json(groups);

    } catch (error) {
        console.error("Error fetching tasks:", error);
        res.status(500).json({ error: "Internal server error", message : error });
    }
})
router.post('/', upload.single('image'), async (req, res) => {
    try {
      const { groupName, details, eventContact, date, time } = req.body;
  
      if (!groupName || !details || !eventContact || !date || !time) {
        return res.status(400).json({ message: "All fields required" });
      }
  
      const image = req.file ? req.file.filename : null;
  
      const newEvent = {
        groupName: groupName,
        details: details,
        eventContact: eventContact,
        date: date,
        time: time,
        image: image 
      };
  
      await queryAsync('INSERT INTO netevents SET ?', newEvent);
  
      res.status(201).json({ message: "Networking Event created successfully", task: newEvent });
    } catch (error) {
      console.error("Error from the task endpoint:", error);
      res.status(500).json({ error: "Internal server error", message: error });
    }
  });
  
  module.exports = router;