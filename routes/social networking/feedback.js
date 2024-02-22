const express = require('express')
const { queryAsync } = require('../../conn');

const router = express.Router()

router.post('/', async (req, res) => {
  try {
      const { title, description } = req.body;
      if (!title || !description) {
          return res.status(400).json({ message: "All fields required please" });
      }

      const userId = req.user.id;

      const newFeedback = {
          title: title,
          description: description,
          module: 'social',
          user_id: userId 
      };

      await queryAsync('INSERT INTO feedback SET ?', newFeedback);
      res.status(201).json({ message: 'Your feedback is well recieved', event: newFeedback });
  } catch (error) {
      console.log("Error from the feeback endpoint is: ", error);
      res.status(500).json({ error: "Internal server error", message : error });
  }
});


module.exports = router