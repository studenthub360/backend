const jwt = require('jsonwebtoken');

const generateJwt = (userID) => {
    try {
        const token = jwt.sign({ id: userID }, process.env.JWT_SECRET, {
            expiresIn: '15d'
        });
        return token;
    } catch (error) {
        console.error('Error generating JWT:', error);
        throw new Error('Internal Server Error');
    }
};

module.exports = { generateJwt };
