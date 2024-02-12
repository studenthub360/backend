const express = require('express');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const { queryAsync } = require('../conn');
const { generateJwt } = require('../utils/jwtGenerator');

const router = express.Router();

router.post('/', async (req, res) => {
  const { email, password, fullName, university } = req.body;

  if (!email || !password || !fullName || !university) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUsers = await queryAsync('SELECT * FROM user WHERE email = ?', [
      email,
    ]);

    if (existingUsers.length > 0) {
      return res.status(409).json({ message: 'Username or email already taken' });
    }

    const newUser = {
      unique_id: uuidv4(), 
      full_name: fullName,
      email: email,
      university: university,
      password: hashedPassword,
    };

    await queryAsync('INSERT INTO user SET ?', newUser);

    // Generate JWT after inserting the user into the database
    generateJwt(newUser.unique_id, res);

    res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (error) {
    console.error('Error during user registration:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
