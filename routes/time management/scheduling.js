const express = require('express')
const { connection } = require('../conn');

const router = express.router()
const queryAsync = (sql, values) => {
    return new Promise((resolve, reject) => {
      connection.query(sql, values, (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  };

router.post('/', async (req, res) => {
    try {
        const { scheduleName, description, update, time, date} = req.body

        if (!taskName || !description || !update || !time || !date){
            res.status(400).json({message : "All fields required please"})
        }
        const newSchedule = {
            scheduleName : scheduleName,
            description : description,
            time : time,
            date : date,
        }

        await queryAsync ('INSERT INTO schedule set ?', newSchedule)
    } catch (error) {
        
    }

})