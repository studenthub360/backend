const express = require('express');
const { connection } = require('../../conn');

const router = express.Router();

router.get('/', async (req, res) => {
  const userId = req.user.id;
  console.log(userId)
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


router.get('/all', async (req, res) => {

  connection.query(
    'SELECT * FROM user', (err,results) =>{
      if (err) {
        console.error('Error fetching user details:', err);
        res.status(500).json({ error: 'Internal server error' });
        return;
      }
      if (results.length === 0) {
        res.status(404).json({ error: 'User not found' });
        return;
      }
      const result = results;
      res.json({ 'All users': result });
    }
  )
});


router.get('/other', async (req, res) => {
  const userId = req.user.id;
console.log(userId)
  connection.query(
    'SELECT * FROM user WHERE id != ?', [userId], (err,results) =>{
      if (err) {
        console.error('Error fetching user details:', err);
        res.status(500).json({ error: 'Internal server error' });
        return;
      }
      if (results.length === 0) {
        res.status(404).json({ error: 'User not found' });
        return;
      }
      const result = results;
      res.json({ 'All users except current user': result });
    }
  )
});

module.exports = router;
