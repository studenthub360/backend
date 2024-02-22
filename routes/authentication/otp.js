const express = require('express');
// const bcrypt = require('bcrypt');
// const { v4: uuidv4 } = require('uuid');
const { queryAsync } = require('../../conn');

const router = express.Router();
// function sendOTP(email, otp) {
//     // Set up nodemailer transport
//     const transporter = nodemailer.createTransport({
//       service: 'your_email_service',
//       auth: {
//         user: 'your_email',
//         pass: 'your_email_password'
//       }
//     });
  
//     const mailOptions = {
//       from: 'your_email',
//       to: email,
//       subject: 'Password Reset OTP',
//       text: `Your OTP for password reset is: ${otp}`
//     };
  
//     transporter.sendMail(mailOptions, (error, info) => {
//       if (error) {
//         console.log('Error occurred while sending email: ' + error);
//       } else {
//         console.log('Email sent: ' + info.response);
//       }
//     });
//   }

router.post('/', async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: 'Please enter your email' });
        }
        const query = 'SELECT * FROM user WHERE email = ?';

        const results = await queryAsync(query, [email]);

        if (results.length === 0) {
            return res.status(404).json({ error: 'Email is not registered' });
        } else {

            //  const otp = generateOTP(); 
            // await sendResetEmail(email, otp); 

            // await storeOTPInDatabase(email, otp);

    // Send response
    return res.status(200).json({ message: 'OTP sent successfully, please check your mail' });
        }
    } catch (error) {
        console.error('Error querying the database:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
