const jwt = require('jsonwebtoken');

const generateJwt = (userID, res) => {
    const token = jwt.sign({ id: userID }, process.env.JWT_SECRET, {
        expiresIn: '15d'
    });

    res.cookie('jwt', token, {
        maxAge: 15 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: 'strict'
    });
};

module.exports = { generateJwt };
