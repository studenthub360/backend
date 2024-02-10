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
        const {taskName, description, update} = req.body

        if (!taskName || !description || !update){
            res.status(400).json({message : "All fields required please"})
        }
        const newTask = {
            taskName : taskName,
            description : description,
            updateTask : update,
        }

        await queryAsync ('INSERT INTO task set ?', newTask)
    } catch (error) {
        
    }

})