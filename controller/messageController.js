const { queryAsync } = require('../conn');

const sendMessage = async (req, res) => {
    try {
        const message = req.body.message;
        const receiverId = req.params.id;
        const senderId = req.user.id;

        // Check if conversation exists
        const conversationQuery = `
            SELECT * FROM conversation 
            WHERE (sender_id = ? AND receiver_id = ?) 
            OR (sender_id = ? AND receiver_id = ?)
        `;
        const [existingConversation] = await queryAsync(conversationQuery, [senderId, receiverId, receiverId, senderId]);

        let conversationId;
        if (!existingConversation) {
            // Create conversation if it doesn't exist
            const insertConversationQuery = `
                INSERT INTO conversation (sender_id, receiver_id) 
                VALUES (?, ?)
            `;
            const result = await queryAsync(insertConversationQuery, [senderId, receiverId]);
            conversationId = result.insertId;
        } else {
            conversationId = existingConversation.id;
        }

        // Insert message
        const insertMessageQuery = `
            INSERT INTO messages (sender_id, receiver_id, msg, conversation_id) 
            VALUES (?, ?, ?, ?)
        `;
        const messageResult = await queryAsync(insertMessageQuery, [senderId, receiverId, message, conversationId]);
        const messageId = messageResult.insertId;

        // Update message with conversation ID
        const updateMessageQuery = `
            UPDATE messages 
            SET conversation_id = ? 
            WHERE msg_id = ?
        `;
        await queryAsync(updateMessageQuery, [conversationId, messageId]);

        const newMessage = { id: messageId, senderId, receiverId, message, conversationId };
        res.status(201).json(newMessage);
    } catch (error) {
        console.log("Error in sendMessage controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};


const getMessages = async (req, res) => {
    try {
        const receiverId = req.params.id; 
        const senderId = req.user.id;
        console.log(receiverId)
        console.log(senderId)
        // Check if conversation exists
        const conversationQuery = `
            SELECT * FROM conversation 
            WHERE (sender_id = ? AND receiver_id = ?) 
            OR (sender_id = ? AND receiver_id = ?)
        `;
        const [existingConversation] = await queryAsync(conversationQuery, [senderId, receiverId, receiverId, senderId]);

        let conversationId;
        if (!existingConversation) {
            // Create conversation if it doesn't exist
            const insertConversationQuery = `
                INSERT INTO conversation (sender_id, receiver_id) 
                VALUES (?, ?)
            `;
            const result = await queryAsync(insertConversationQuery, [senderId, receiverId]);
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
            const messages = await queryAsync(getMessagesQuery, [conversationId]);
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
