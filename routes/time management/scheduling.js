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

router.get('/all', async (req, res) => {
  try {
    const userId = req.user.id;
      const schedule = await queryAsync('SELECT * FROM schedule WHERE user_id=?', [userId]);
      res.status(200).json(schedule);
  } catch (error) {
      console.error("Error fetching events:", error);
      res.status(500).json({ error: "Internal server error", message : error });
  }
});

router.get('/', async (req, res) => {
  try {
    const userId = req.user.id;
      const schedule = await queryAsync('SELECT * FROM schedule WHERE user_id=?'[userId]);

      res.status(200).json(schedule);
  } catch (error) {
      console.error("Error fetching events:", error);
      res.status(500).json({ error: "Internal server error", message : error });
  }
});

router.get('/:id', async (req, res) => {
  try {
      const scheduleId = req.params.id; 
      const userId = req.user.id;
      const scheduleDetail = await queryAsync('SELECT * FROM schedule where id = ? AND user_id = ?', [scheduleId, userId]);
      res.status(200).json(scheduleDetail);
      if(res.status === 404){
        res.json({message : 'You have no such schedule'})
      }
  } catch (error) {
      console.error("Error fetching events:", error);
      res.status(500).json({ error: "Internal server error", message : error });
  }
});

module.exports = router