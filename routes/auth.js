const express = require('express');
const bcrypt = require('bcrypt');
const { connection } = require('../conn'); // Import the database connection

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { email, password } = req.body;
    const query = 'SELECT * FROM user WHERE email = ?';
    
    connection.query(query, [email], async (error, results) => {
      if (error) {
        console.error('Error querying the database:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      if (results.length > 0) {
        const user = results[0];
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (passwordMatch) {
          res.json({ message: 'Login successful' });
        } else {
          res.status(401).json({ error: 'Invalid credentials' });
        }
      } else {
        res.status(401).json({ error: 'Invalid credentials' });
      }
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
