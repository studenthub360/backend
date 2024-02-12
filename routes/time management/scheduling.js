const express = require('express')
const { queryAsync } = require('../../conn');

const router = express.Router()

router.post('/', async (req, res) => {
    try {
      const userId = req.user.id;
        const { scheduleName, description, time, date} = req.body

        if (!scheduleName || !description || !time || !date){
            res.status(400).json({message : "All fields required please"})
        }
        const newSchedule = {
            scheduleName : scheduleName,
            description : description,
            time : time,
            date : date,
            user_id : userId
        }

        await queryAsync ('INSERT INTO schedule set ?', newSchedule)
        res.status(201).json({message : "Schedule created sucessfully", schedule : newSchedule})
    } catch (error) {
      console.log('error from the scheduling is: ',  error)
      throw error
    }

})

router.get('/', async (req, res) => {
  try {
      // Fetch all events from the database
      const schedule = await queryAsync('SELECT * FROM schedule');

      // Send the events as a response
      res.status(200).json(schedule);
  } catch (error) {
      console.error("Error fetching events:", error);
      res.status(500).json({ error: "Internal server error" });
  }
});

router.get('/all', async (req, res) => {
  try {
    const userId = req.user.id;
      // Fetch all events from the database
      const schedule = await queryAsync('SELECT * FROM schedule WHERE user_id=?'[userId]);

      // Send the events as a response
      res.status(200).json(schedule);
  } catch (error) {
      console.error("Error fetching events:", error);
      res.status(500).json({ error: "Internal server error" });
  }
});

router.get('/:id', async (req, res) => {
  try {
      const scheduleId = req.params.id; 
      
      const scheduleDetail = await queryAsync('SELECT * FROM event where id = ?', [scheduleId]);

      res.status(200).json(scheduleDetail);
  } catch (error) {
      console.error("Error fetching events:", error);
      res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router