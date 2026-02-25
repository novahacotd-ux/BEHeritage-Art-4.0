const { Friendship, User } = require('../models');
const { Op } = require('sequelize');

/**
 * Send friend request
 */
const sendFriendRequest = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { friend_id } = req.body;

    if (!friend_id) {
      return res.status(400).json({
        success: false,
        message: 'Friend ID is required'
      });
    }

    if (userId === friend_id) {
      return res.status(400).json({
        success: false,
        message: 'Cannot send friend request to yourself'
      });
    }

    // Check if friend exists
    const friendUser = await User.findByPk(friend_id);
    if (!friendUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if friendship already exists
    const existingFriendship = await Friendship.findOne({
      where: {
        [Op.or]: [
          { user_id: userId, friend_id },
          { user_id: friend_id, friend_id: userId }
        ]
      }
    });

    if (existingFriendship) {
      return res.status(409).json({
        success: false,
        message: 'Friend request already exists'
      });
    }

    // Create friend request
    const friendship = await Friendship.create({
      user_id: userId,
      friend_id,
      status: 'pending'
    });

    res.status(201).json({
      success: true,
      message: 'Friend request sent successfully',
      data: { friendship }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Accept friend request
 */
const acceptFriendRequest = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { friendship_id } = req.body;

    const friendship = await Friendship.findByPk(friendship_id);

    if (!friendship) {
      return res.status(404).json({
        success: false,
        message: 'Friend request not found'
      });
    }

    // Check if user is the recipient
    if (friendship.friend_id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to accept this request'
      });
    }

    if (friendship.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Friend request already processed'
      });
    }

    await friendship.update({ status: 'accepted' });

    res.status(200).json({
      success: true,
      message: 'Friend request accepted',
      data: { friendship }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Reject friend request
 */
const rejectFriendRequest = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { friendship_id } = req.body;

    const friendship = await Friendship.findByPk(friendship_id);

    if (!friendship) {
      return res.status(404).json({
        success: false,
        message: 'Friend request not found'
      });
    }

    // Check if user is the recipient
    if (friendship.friend_id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to reject this request'
      });
    }

    await friendship.destroy();

    res.status(200).json({
      success: true,
      message: 'Friend request rejected'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get friends list
 */
const getFriends = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const friendships = await Friendship.findAll({
      where: {
        [Op.or]: [
          { user_id: userId, status: 'accepted' },
          { friend_id: userId, status: 'accepted' }
        ]
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email', 'avatar', 'intro']
        },
        {
          model: User,
          as: 'friend',
          attributes: ['id', 'name', 'email', 'avatar', 'intro']
        }
      ]
    });

    // Extract friend data
    const friends = friendships.map(f => {
      if (f.user_id === userId) {
        return f.friend;
      } else {
        return f.user;
      }
    });

    res.status(200).json({
      success: true,
      data: { friends }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get pending friend requests (received)
 */
const getPendingRequests = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const requests = await Friendship.findAll({
      where: {
        friend_id: userId,
        status: 'pending'
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email', 'avatar', 'intro']
        }
      ]
    });

    res.status(200).json({
      success: true,
      data: { requests }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get friend suggestions
 */
const getFriendSuggestions = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Get all users who are not friends and not the current user
    const friendships = await Friendship.findAll({
      where: {
        [Op.or]: [
          { user_id: userId },
          { friend_id: userId }
        ]
      }
    });

    const friendIds = friendships.map(f =>
      f.user_id === userId ? f.friend_id : f.user_id
    );

    const suggestions = await User.findAll({
      where: {
        id: {
          [Op.notIn]: [...friendIds, userId]
        },
        status: 'Active'
      },
      attributes: ['id', 'name', 'email', 'avatar', 'intro'],
      limit: 10
    });

    res.status(200).json({
      success: true,
      data: { suggestions }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Remove friend
 */
const removeFriend = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { friend_id } = req.params;

    const friendship = await Friendship.findOne({
      where: {
        [Op.or]: [
          { user_id: userId, friend_id },
          { user_id: friend_id, friend_id: userId }
        ]
      }
    });

    if (!friendship) {
      return res.status(404).json({
        success: false,
        message: 'Friendship not found'
      });
    }

    await friendship.destroy();

    res.status(200).json({
      success: true,
      message: 'Friend removed successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  getFriends,
  getPendingRequests,
  getFriendSuggestions,
  removeFriend
};
