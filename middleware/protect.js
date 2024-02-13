const jwt = require("jsonwebtoken");
const { queryAsync } = require('../conn'); 

const protectRoute = async (req, res, next) => {
    try {
        const authHeader = req.headers['Authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({ error: "Unauthorized - No Token Provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded) {
            return res.status(401).json({ error: "Unauthorized - Invalid Token" });
        }

        const getUserQuery = `
            SELECT * FROM user
            WHERE unique_id = ?
        `;

        const [user] = await queryAsync(getUserQuery, [decoded.id]);

        if (!user) {
            console.log(`User with ID ${decoded.id} not found`);
            return res.status(404).json({ error: "User not found" });
        }

        delete user.password;
        req.user = user;

        next();
    } catch (error) {
        console.log("Error in protectRoute middleware: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = protectRoute;
