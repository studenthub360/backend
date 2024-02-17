const express = require('express')
const { queryAsync } = require('../../conn');

const router = express.Router()

router.post('/', async (req, res) => {
  try {
      const { studyGroup, focus, mentor,application, link } = req.body;
      if (!studyGroup || !focus || !mentor || !application || !link) {
          return res.status(400).json({ message: "All fields required please" });
      }

      // const userId = req.user.id;

      const newTutorial = {
          studyGroup: studyGroup,
          focus: focus,
          mentor: mentor,
          application: application,
          link : link
      };

      await queryAsync('INSERT INTO tutorials SET ?', newTutorial);
      res.status(201).json({ message: 'Tutorial created Successfully', Tutorials: newTutorial });
  } catch (error) {
      console.log("Error from the tutorial endpoint is: ", error);
      res.status(500).json({ error: "Internal server error", message : error });
  }
});


router.get('/', async (req, res) => {
  try {
      const tutorials = await queryAsync('SELECT * FROM tutorials');

      res.status(200).json(tutorials);

  } catch (error) {

      console.error("Error fetching tutorials:", error);

      res.status(500).json({ error: "Internal server error", message : error });
  }
});




module.exports = router