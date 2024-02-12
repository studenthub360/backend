const express = require('express')
const { queryAsync } = require('../../conn');

const router = express.Router()

router.post('/', async (req, res) => {
  try {
      const { eventName, description, date, time, image } = req.body;
      if (!eventName || !description || !date || !time || !image) {
          return res.status(400).json({ message: "All fields required please" });
      }

      // Get user ID from the JWT token
      const userId = req.user.id;

      const newEvent = {
          eventName: eventName,
          description: description,
          date: date,
          time: time,
          image: image,
          user_id: userId  // Add user ID to the event data
      };

      await queryAsync('INSERT INTO event SET ?', newEvent);
      res.status(201).json({ message: 'Event created Successfully', event: newEvent });
  } catch (error) {
      console.log("Error from the event endpoint is: ", error);
      res.status(500).json({ error: "Internal server error" });
  }
});


// Endpoint to fetch all events
router.get('/all', async (req, res) => {
  try {

      const events = await queryAsync('SELECT * FROM event');

      // Send the events as a response
      res.status(200).json(events);
  } catch (error) {
      console.error("Error fetching events:", error);
      res.status(500).json({ error: "Internal server error" });
  }
});

// Endpoint to fetch all events
router.get('/', async (req, res) => {
  try {
    const userId = req.user.id;

      const events = await queryAsync('SELECT * FROM event WHERE user_id = ?', [userId]);

      // Send the events as a response
      res.status(200).json(events);
  } catch (error) {
      console.error("Error fetching events:", error);
      res.status(500).json({ error: "Internal server error" });
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
      res.status(500).json({ error: "Internal server error" });
  }
});


module.exports = router