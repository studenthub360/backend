const jwt = require('jsonwebtoken');

const generateJwt = (userID, res) => {
    const token = jwt.sign({ id: userID }, process.env.JWT_SECRET, {
        expiresIn: '15d'
    });

    res.cookie('jwt', token, {
        maxAge: 15 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure : true,
        sameSite: 'strict',
        Domain : studenthub360.software
    });
};

module.exports = { generateJwt };
