const { executeQuery } = require('../conn');

const sendMessage = async (req, res) => {
    console.log('message sent');
    try {
        const { message } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user.id;

        // Check if conversation exists
        const conversationQuery = `
            SELECT * FROM conversation 
            WHERE (sender_id = ? AND receiver_id = ?) 
            OR (sender_id = ? AND receiver_id = ?)
        `;
        const [existingConversation] = await executeQuery(conversationQuery, [senderId, receiverId, receiverId, senderId]);

        let conversationId;
        if (!existingConversation) {
            // Create conversation if it doesn't exist
            const insertConversationQuery = `
                INSERT INTO conversation (sender_id, receiver_id) 
                VALUES (?, ?)
            `;
            const result = await executeQuery(insertConversationQuery, [senderId, receiverId]);
            conversationId = result.insertId;
        } else {
            conversationId = existingConversation.id;
        }

        const insertMessageQuery = `
            INSERT INTO messages (sender_id, receiver_id, msg) 
            VALUES (?, ?, ?)
        `;
        const result = await executeQuery(insertMessageQuery, [senderId, receiverId, message]);
        const messageId = result.insertId;

        const newMessage = { id: messageId, senderId, receiverId, message };
        res.status(201).json(newMessage);
    } catch (error) {
        console.log("Error in sendMessage controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

const getMessages = async (req, res) => {
    try {
        const { receiverId } = req.params;
        const senderId = req.user.id;

        // Check if conversation exists
        const conversationQuery = `
            SELECT * FROM conversation 
            WHERE (sender_id = ? AND receiver_id = ?) 
            OR (sender_id = ? AND receiver_id = ?)
        `;
        const [existingConversation] = await executeQuery(conversationQuery, [senderId, receiverId, receiverId, senderId]);

        let conversationId;
        if (!existingConversation) {
            // Create conversation if it doesn't exist
            const insertConversationQuery = `
                INSERT INTO conversation (sender_id, receiver_id) 
                VALUES (?, ?)
            `;
            const result = await executeQuery(insertConversationQuery, [senderId, receiverId]);
            conversationId = result.insertId;
        } else {
            conversationId = existingConversation.id;
        }

        // Fetch messages if conversation exists
        if (conversationId) {
            const getMessagesQuery = `
                SELECT * FROM messages
                WHERE conversation_id = ?
            `;
            const messages = await executeQuery(getMessagesQuery, [conversationId]);
            res.status(200).json(messages);
        } else {
            res.status(200).json([]);
        }
    } catch (error) {
        console.log("Error in getMessages controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = { sendMessage, getMessages };
