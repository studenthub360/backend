const express = require('express')
const { queryAsync } = require('../../conn');

const router = express.Router()
const multer = require('multer');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '../../uploads'); 
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });
router.post('/', upload.single('image'), async (req, res) => {
  try {
      const { eventName, description, date, location, time } = req.body;
      const image = req.file.filename; 
      if (!eventName || !description || !location || !date || !time || !image) {
          return res.status(400).json({ message: "All fields required please" });
      }

      const userId = req.user.id;

      const newEvent = {
          eventName: eventName,
          description: description,
          date: date,
          time: time,
          location: location,
          image: image,
          user_id: userId
      };

      await queryAsync('INSERT INTO event SET ?', newEvent);
      res.status(201).json({ message: 'Event created Successfully', event: newEvent });
  } catch (error) {
      console.log("Error from the event endpoint is: ", error);
      res.status(500).json({ error: "Internal server error", message: error });
  }
});


router.get('/all', async (req, res) => {
  try {
    const type = 0
      const events = await queryAsync('SELECT * FROM event WHERE type = ?', type);

      res.status(200).json(events);

  } catch (error) {

      console.error("Error fetching events:", error);

      res.status(500).json({ error: "Internal server error", message : error });
  }
});

router.get('/', async (req, res) => {
  try {
    const userId = req.user.id;

      const events = await queryAsync('SELECT * FROM event WHERE user_id = ?', [userId]);

      // Send the events as a response
      res.status(200).json(events);
  } catch (error) {
      console.error("Error fetching events:", error);
      res.status(500).json({ error: "Internal server error", message : error });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const userId = req.user.id;
      const eventId = req.params.id; 
      
      const eventDetail = await queryAsync('SELECT * FROM event where user_id = ? AND id = ?',[userId, eventId]);
      if(eventDetail < 1){
        res.json({message : 'You have no such event'})
      }
      res.status(200).json({message : eventDetail});
  } catch (error) {
      console.error("Error fetching events:", error);
      res.status(500).json({ error: "Internal server error", message : error });
  }
});


module.exports = router