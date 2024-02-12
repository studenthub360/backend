const express = require('express')
const { queryAsync } = require('../../conn');

const router = express.Router()

router.post('/', async (req, res) => {
  try {
      const { eventName, description, date,location, time, image } = req.body;
      if (!eventName || !description || !location || !date || !time || !image) {
          return res.status(400).json({ message: "All fields required please" });
      }

      const userId = req.user.id;

      const newEvent = {
          eventName: eventName,
          description: description,
          date: date,
          time: time,
          location : location,
          image: image,
          user_id: userId, 
          type: 1 
      };

      await queryAsync('INSERT INTO event SET ?', newEvent);
      res.status(201).json({ message: 'Tutorial created Successfully', event: newEvent });
  } catch (error) {
      console.log("Error from the tutorial endpoint is: ", error);
      res.status(500).json({ error: "Internal server error", message : error });
  }
});


router.get('/', async (req, res) => {
  try {
    const type = 1
      const tutorials = await queryAsync('SELECT * FROM event WHERE type = ?', type);

      res.status(200).json(tutorials);

  } catch (error) {

      console.error("Error fetching tutorials:", error);

      res.status(500).json({ error: "Internal server error", message : error });
  }
});




module.exports = router