const jwt = require('jsonwebtoken');

const generateJwt = (userID, res) => {
    try {
        const token = jwt.sign({ id: userID }, process.env.JWT_SECRET, {
            expiresIn: '15d'
        });

        res.cookie('jwt', token, {
            maxAge: 15 * 24 * 60 * 60 * 1000,
            // httpOnly: true,
            // secure: true,
            // sameSite: 'strict' // This will help prevent the cookie from being stolen by malicious scripts
            // domain: 'studenthub360.software'
        });
    } catch (error) {
        console.error('Error generating JWT:', error);
        res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
};

module.exports = { generateJwt };
