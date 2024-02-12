const express = require('express');
const { connection } = require('../../conn');

const router = express.Router();

router.get('/', async (req, res) => {
  const userId = req.user.id;

  connection.query(
    'SELECT * FROM user WHERE id = ?', [userId], (err,results) =>{
      if (err) {
        console.error('Error fetching user details:', err);
        res.status(500).json({ error: 'Internal server error' });
        return;
      }
      if (results.length === 0) {
        res.status(404).json({ error: 'User not found' });
        return;
      }
      const result = results[0];
      res.json({ result });
    }
  )
});

module.exports = router;
