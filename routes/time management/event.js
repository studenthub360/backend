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
        const {eventName, description, date, time} = req.body
// could make events public or private
        if (!eventName || !description || !date || !time ){
            res.status(400).json({message : "All fields required please"})
        }
        const newEvent = {
            eventName : eventName,
            description : description,
            date : date,
            time : time
        }

        await queryAsync ('INSERT INTO event set ?', newEvent)
    } catch (error) {
        
    }

})