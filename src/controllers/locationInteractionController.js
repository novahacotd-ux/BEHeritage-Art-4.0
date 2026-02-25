const { Location, LocationInteraction } = require('../models');

const createLocationInteraction = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { action_type } = req.body;

    if (!action_type) {
      return res.status(400).json({
        success: false,
        message: 'action_type is required'
      });
    }

    const validActions = ['like', 'favorite', 'view', 'share'];
    if (!validActions.includes(action_type)) {
      return res.status(400).json({
        success: false,
        message: `Invalid action_type. Must be one of: ${validActions.join(', ')}`
      });
    }

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid location ID format'
      });
    }

    const location = await Location.findByPk(id);
    if (!location) {
      return res.status(404).json({
        success: false,
        message: 'Location not found'
      });
    }

    const [interaction, created] = await LocationInteraction.findOrCreate({
      where: {
        user_id: req.user.id,
        location_id: id,
        action_type: action_type
      },
      defaults: {
        user_id: req.user.id,
        location_id: id,
        action_type: action_type
      }
    });

    if (!created) {
      await interaction.destroy();
      return res.status(200).json({
        success: true,
        message: 'Interaction removed',
        data: { action_type, removed: true }
      });
    }

    res.status(201).json({
      success: true,
      message: 'Interaction created successfully',
      data: interaction
    });
  } catch (error) {
    next(error);
  }
};

const getLocationInteractions = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { action_type, page = 1, limit = 10 } = req.query;

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid location ID format'
      });
    }

    const location = await Location.findByPk(id);
    if (!location) {
      return res.status(404).json({
        success: false,
        message: 'Location not found'
      });
    }

    const where = { location_id: id };
    if (action_type) {
      where.action_type = action_type;
    }

    const offset = (page - 1) * limit;
    const { count, rows } = await LocationInteraction.findAndCountAll({
      where,
      offset: parseInt(offset),
      limit: parseInt(limit),
      order: [['created_at', 'DESC']]
    });

    res.status(200).json({
      success: true,
      data: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

const updateLocationInteraction = async (req, res, next) => {
  try {
    const { id, interaction_id } = req.params;
    const { action_type } = req.body;

    if (!action_type) {
      return res.status(400).json({
        success: false,
        message: 'action_type is required'
      });
    }

    const validActions = ['like', 'favorite', 'view', 'share'];
    if (!validActions.includes(action_type)) {
      return res.status(400).json({
        success: false,
        message: `Invalid action_type. Must be one of: ${validActions.join(', ')}`
      });
    }

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id) || !uuidRegex.test(interaction_id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid ID format'
      });
    }

    const interaction = await LocationInteraction.findByPk(interaction_id);
    if (!interaction) {
      return res.status(404).json({
        success: false,
        message: 'Interaction not found'
      });
    }

    if (interaction.location_id !== id) {
      return res.status(400).json({
        success: false,
        message: 'Interaction does not belong to this location'
      });
    }

    if (interaction.user_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You can only update your own interactions'
      });
    }

    await interaction.update({ action_type });

    res.status(200).json({
      success: true,
      message: 'Interaction updated successfully',
      data: interaction
    });
  } catch (error) {
    next(error);
  }
};

const deleteLocationInteraction = async (req, res, next) => {
  try {
    const { id, interaction_id } = req.params;

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id) || !uuidRegex.test(interaction_id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid ID format'
      });
    }

    const interaction = await LocationInteraction.findByPk(interaction_id);
    if (!interaction) {
      return res.status(404).json({
        success: false,
        message: 'Interaction not found'
      });
    }

    if (interaction.location_id !== id) {
      return res.status(400).json({
        success: false,
        message: 'Interaction does not belong to this location'
      });
    }

    if (interaction.user_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own interactions'
      });
    }

    await interaction.destroy();

    res.status(200).json({
      success: true,
      message: 'Interaction deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createLocationInteraction,
  getLocationInteractions,
  updateLocationInteraction,
  deleteLocationInteraction
};