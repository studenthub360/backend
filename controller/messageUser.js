const { queryAsync } = require("../conn");

const messageUser = async (req, res) => {
    const currentUser = req.user.id;
    console.log('I am', currentUser);

    try {
        const query = `SELECT receiver_id FROM conversation WHERE sender_id = ?`;

        const availableFriends = await queryAsync(query, [currentUser]);

        // Extract receiver IDs from the results
        const receiverIds = availableFriends.map(row => row.receiver_id);

        res.status(200).json({ "These are your available friends": receiverIds });
        console.log("These are your available friends", receiverIds);
    } catch (error) {
        console.error("Error fetching available friends:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = messageUser;
