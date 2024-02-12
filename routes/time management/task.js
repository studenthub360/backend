const express = require('express');
const { queryAsync } = require('../../conn');

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const { taskName, description} = req.body;

        if (!taskName || !description) {
            return res.status(400).json({ message: "All fields required" });
        }

        const newTask = {
            taskName : taskName,
            description : description
        };

        // Insert the new task into the database
        await queryAsync('INSERT INTO task SET ?', newTask);

        // Send a success response
        res.status(201).json({ message: "Task created successfully", task: newTask });
    } catch (error) {
        console.error("Error from the task endpoint:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.put('/:taskId', async (req, res) => {
  try {
      const { taskId } = req.params;

      const [task] = await queryAsync('SELECT updateTask FROM task WHERE id = ?', [taskId]);
      
      const newUpdateTaskValue = task.updateTask === 1 ? 0 : 1;

      await queryAsync('UPDATE task SET updateTask = ? WHERE id = ?', [newUpdateTaskValue, taskId]);

      res.status(200).json({ message: "Task updated successfully" });
  } catch (error) {
      console.error("Error updating task:", error);
      res.status(500).json({ error: "Internal server error" });
  }
});


router.delete('/:taskId', async (req, res) => {
  try {
      const { taskId } = req.params;

      await queryAsync('DELETE FROM task WHERE id = ?', [taskId]);

      res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
      console.error("Error deleting task:", error);
      res.status(500).json({ error: "Internal server error" });
  }
});

// Endpoint to fetch all tasks
router.get('/', async (req, res) => {
  try {
      // Fetch all tasks from the database
      const tasks = await queryAsync('SELECT * FROM task');

      // Send the tasks as a response
      res.status(200).json(tasks);
  } catch (error) {
      console.error("Error fetching tasks:", error);
      res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
