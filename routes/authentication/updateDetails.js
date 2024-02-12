const express = require('express');
const bcrypt = require('bcrypt');
const { connection, queryAsync } = require('../../conn');
const { generateJwt } = require('../../utils/jwtGenerator');

const router = express.Router();

router.patch('/', async (req, res) => {
  try {
    const userId = req.user.id; // Assuming user ID is available in the request object

    // Destructure the fields from the request body
    const { email, department, level, university, fullName } = req.body;
    
    // Construct an object with the fields to be updated
    const updateFields = {};
    if (department) updateFields.department = department;
    if (level) updateFields.level = level;
    if (university) updateFields.university = university;
    if (fullName) updateFields.full_name = fullName;
    if (email) updateFields.email = email;

    // Execute the update query
    const updateResult = await queryAsync('UPDATE user SET ? WHERE id = ?', [updateFields, userId]);

    // Check if any rows were affected by the update
    if (updateResult.affectedRows > 0) {
        res.status(200).json({ message: 'Successfully updated user' });
    } else {
        res.status(404).json({ message: 'User not found or no changes applied' });
    }

  } catch (error) {
    console.error('Error during update:', error);
    res.status(500).json({ error: 'Internal Server Error', message: error });
  }
});

module.exports = router;
