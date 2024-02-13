const express = require('express');
const bcrypt = require('bcrypt');
const { connection } = require('../../conn');
const { generateJwt } = require('../../utils/jwtGenerator');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { email, password } = req.body;
    if(!email || !password){
      res.status(404).json({message : 'Fields cannot be empty'})
    }
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
          // Generate JWT token
          const token = generateJwt(user.unique_id);

          // Send response with token
          res.status(200).json({ message: 'Login Successful', token });
        } else {
          res.status(401).json({ error: 'Invalid Password' });
        }
      } else {
        res.status(401).json({ error: 'Email does not exist' });
      }
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});

module.exports = router;
