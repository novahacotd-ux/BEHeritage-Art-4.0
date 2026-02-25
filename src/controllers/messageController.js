const { Message, User } = require('../models');
const { Op } = require('sequelize');

/**
 * Send message
 */
const sendMessage = async (req, res, next) => {
  try {
    const senderId = req.user.id;
    const { receiver_id, content } = req.body;

    if (!receiver_id || !content) {
      return res.status(400).json({
        success: false,
        message: 'Receiver ID and content are required'
      });
    }

    // Check if receiver exists
    const receiver = await User.findByPk(receiver_id);
    if (!receiver) {
      return res.status(404).json({
        success: false,
        message: 'Receiver not found'
      });
    }

    const message = await Message.create({
      sender_id: senderId,
      receiver_id,
      content
    });

    // Fetch message with sender info
    const messageWithSender = await Message.findByPk(message.id, {
      include: [
        {
          model: User,
          as: 'sender',
          attributes: ['id', 'name', 'avatar']
        },
        {
          model: User,
          as: 'receiver',
          attributes: ['id', 'name', 'avatar']
        }
      ]
    });

    // Note: Real-time message delivery is handled by socket.io event listener
    // in server.js when client emits 'send_message' event

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: { message: messageWithSender }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get conversation with a specific user
 */
const getConversation = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { friend_id } = req.params;
    const { limit = 50, offset = 0 } = req.query;

    const messages = await Message.findAll({
      where: {
        [Op.or]: [
          { sender_id: userId, receiver_id: friend_id },
          { sender_id: friend_id, receiver_id: userId }
        ]
      },
      include: [
        {
          model: User,
          as: 'sender',
          attributes: ['id', 'name', 'avatar']
        },
        {
          model: User,
          as: 'receiver',
          attributes: ['id', 'name', 'avatar']
        }
      ],
      order: [['created_at', 'ASC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    // Mark messages as read
    await Message.update(
      { is_read: true },
      {
        where: {
          sender_id: friend_id,
          receiver_id: userId,
          is_read: false
        }
      }
    );

    res.status(200).json({
      success: true,
      data: { messages }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all conversations (chat list)
 */
const getConversations = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Get unique conversation partners with their last message
    const messages = await Message.findAll({
      where: {
        [Op.or]: [
          { sender_id: userId },
          { receiver_id: userId }
        ]
      },
      include: [
        {
          model: User,
          as: 'sender',
          attributes: ['id', 'name', 'avatar']
        },
        {
          model: User,
          as: 'receiver',
          attributes: ['id', 'name', 'avatar']
        }
      ],
      order: [['created_at', 'DESC']]
    });

    // Group by conversation partner
    const conversationsMap = new Map();

    messages.forEach(msg => {
      const partnerId = msg.sender_id === userId ? msg.receiver_id : msg.sender_id;

      if (!conversationsMap.has(partnerId)) {
        conversationsMap.set(partnerId, {
          partner: msg.sender_id === userId ? msg.receiver : msg.sender,
          lastMessage: msg,
          unreadCount: 0
        });
      }

      // Count unread messages
      if (msg.receiver_id === userId && !msg.is_read) {
        conversationsMap.get(partnerId).unreadCount++;
      }
    });

    const conversations = Array.from(conversationsMap.values());

    res.status(200).json({
      success: true,
      data: { conversations }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete message
 */
const deleteMessage = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { message_id } = req.params;

    const message = await Message.findByPk(message_id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    // Only sender can delete
    if (message.sender_id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this message'
      });
    }

    await message.destroy();

    res.status(200).json({
      success: true,
      message: 'Message deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  sendMessage,
  getConversation,
  getConversations,
  deleteMessage
};
