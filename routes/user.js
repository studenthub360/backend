const express = require('express');
const { connection } = require('../conn'); // Import the database connection

const router = express.Router();

router.get('/:userID', async (req, res) => {
  const userID = req.params.userID;
  console.log(userID)

  connection.query(
    'SELECT username FROM user WHERE userID = ?', userID, (err,results) =>{
      if (err) {
        console.error('Error fetching user details:', err);
        res.status(500).json({ error: 'Internal server error' });
        return;
      }
      if (results.length === 0) {
        res.status(404).json({ error: 'User not found' });
        return;
      }
      const username = results[0].username;
      res.json({ username });
    }
  )
});

module.exports = router;
