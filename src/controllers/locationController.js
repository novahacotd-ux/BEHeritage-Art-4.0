const { Location, LocationTag, MediaAsset, LocationInteraction } = require('../models');
const { Op } = require('sequelize');

const getAllLocations = async (req, res, next) => {
  try {
    const { period_id, region_id, location_type, location_category, search } = req.query;

    const whereClause = {
      status: 'active'
    };
    
    if (location_type) {
      whereClause.location_type = location_type;
    }
    
    if (location_category) {
      whereClause.location_category = location_category;
    }
    
    if (search) {
      whereClause[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { address: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const includeOptions = [
      {
        model: LocationTag,
        as: 'tags',
        required: false,
        attributes: ['period_id', 'region_id']
      }
    ];

    if (period_id || region_id) {
      includeOptions[0].where = {};
      if (period_id) includeOptions[0].where.period_id = period_id;
      if (region_id) includeOptions[0].where.region_id = region_id;
      includeOptions[0].required = true;
    }

    const locations = await Location.findAll({
      where: whereClause,
      attributes: ['id', 'name', 'address', 'latitude', 'longitude', 'location_type', 'location_category'],
      include: includeOptions,
      order: [['created_at', 'DESC']]
    });

    res.status(200).json({
      success: true,
      data: locations
    });
  } catch (error) {
    next(error);
  }
};

const getLocationById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid location ID format'
      });
    }

    const location = await Location.findOne({
      where: {
        id: id,
        status: 'active'
      },
      include: [
        {
          model: LocationTag,
          as: 'tags',
          required: false,
        },
        {
          model: MediaAsset,
          as: 'mediaAssets',
          required: false,
          separate: true,
          order: [['display_order', 'ASC']]
        }
      ]
    });

    if (!location) {
      return res.status(404).json({
        success: false,
        message: 'Location not found'
      });
    }

    location.view_count = (location.view_count || 0) + 1;
    await location.save();

    if (req.user) {
      await LocationInteraction.findOrCreate({
        where: {
          user_id: req.user.id,
          location_id: id,
          action_type: 'view'
        },
        defaults: {
          user_id: req.user.id,
          location_id: id,
          action_type: 'view'
        }
      });
    }

    res.status(200).json({
      success: true,
      data: location
    });
  } catch (error) {
    next(error);
  }
};

const createLocation = async (req, res, next) => {
  try {
    const { name, address, description, latitude, longitude, location_type, location_category, year_built, status, period_id, region_id } = req.body;

    if (latitude !== undefined && latitude !== null) {
      const latNum = parseFloat(latitude);
      if (isNaN(latNum)) {
        return res.status(400).json({
          success: false,
          message: 'Latitude must be a number'
        });
      }
    }

    if (longitude !== undefined && longitude !== null) {
      const lngNum = parseFloat(longitude);
      if (isNaN(lngNum)) {
        return res.status(400).json({
          success: false,
          message: 'Longitude must be a number'
        });
      }
    }

    if (year_built !== undefined && year_built !== null) {
      const yearNum = parseInt(year_built);
      if (isNaN(yearNum)) {
        return res.status(400).json({
          success: false,
          message: 'Year built must be an integer'
        });
      }
    }

    const locationStatus = status || (name && name.trim().length > 0 ? 'active' : 'draft');
    
    const location = await Location.create({
      name: name ? name.trim() : null,
      address: address ? address.trim() : null,
      description: description ? description.trim() : null,
      latitude: latitude !== undefined && latitude !== null ? parseFloat(latitude) : null,
      longitude: longitude !== undefined && longitude !== null ? parseFloat(longitude) : null,
      location_type: location_type ? location_type.trim() : null,
      location_category: location_category ? location_category.trim() : null,
      year_built: year_built !== undefined && year_built !== null ? parseInt(year_built) : null,
      status: locationStatus,
      is_verified: false,
      view_count: 0
    });

    if (period_id || region_id) {
      const existingTag = await LocationTag.findOne({
        where: { location_id: location.id }
      });

      if (existingTag) {
        existingTag.period_id = period_id || null;
        existingTag.region_id = region_id || null;
        await existingTag.save();
      } else {
        await LocationTag.create({
          location_id: location.id,
          period_id: period_id || null,
          region_id: region_id || null
        });
      }
    }

    const locationWithTags = await Location.findByPk(location.id, {
      include: [
        {
          model: LocationTag,
          as: 'tags',
          required: false
        },
        {
          model: MediaAsset,
          as: 'mediaAssets',
          required: false
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Location created successfully',
      data: locationWithTags
    });
  } catch (error) {
    next(error);
  }
};

const updateLocation = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, address, description, latitude, longitude, location_type, location_category, year_built, is_verified, status, period_id, region_id } = req.body;

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

    if (latitude !== undefined && latitude !== null) {
      const latNum = parseFloat(latitude);
      if (isNaN(latNum)) {
        return res.status(400).json({
          success: false,
          message: 'Latitude must be a number'
        });
      }
    }

    if (longitude !== undefined && longitude !== null) {
      const lngNum = parseFloat(longitude);
      if (isNaN(lngNum)) {
        return res.status(400).json({
          success: false,
          message: 'Longitude must be a number'
        });
      }
    }

    if (year_built !== undefined && year_built !== null) {
      const yearNum = parseInt(year_built);
      if (isNaN(yearNum)) {
        return res.status(400).json({
          success: false,
          message: 'Year built must be an integer'
        });
      }
    }

    if (name !== undefined) location.name = name ? name.trim() : null;
    if (address !== undefined) location.address = address ? address.trim() : null;
    if (description !== undefined) location.description = description ? description.trim() : null;
    if (latitude !== undefined) location.latitude = latitude !== null ? parseFloat(latitude) : null;
    if (longitude !== undefined) location.longitude = longitude !== null ? parseFloat(longitude) : null;
    if (location_type !== undefined) location.location_type = location_type ? location_type.trim() : null;
    if (location_category !== undefined) location.location_category = location_category ? location_category.trim() : null;
    if (year_built !== undefined) location.year_built = year_built !== null ? parseInt(year_built) : null;
    if (is_verified !== undefined) location.is_verified = is_verified;
    if (status !== undefined) location.status = status;
    else if (name !== undefined && name && name.trim().length > 0) location.status = 'active';

    await location.save();

    if (period_id !== undefined || region_id !== undefined) {
      const existingTag = await LocationTag.findOne({
        where: { location_id: id }
      });

      if (existingTag) {
        if (period_id !== undefined) existingTag.period_id = period_id || null;
        if (region_id !== undefined) existingTag.region_id = region_id || null;
        await existingTag.save();
      } else if (period_id || region_id) {
        await LocationTag.create({
          location_id: id,
          period_id: period_id || null,
          region_id: region_id || null
        });
      }
    }

    const locationWithTags = await Location.findByPk(id, {
      include: [
        {
          model: LocationTag,
          as: 'tags',
          required: false
        },
        {
          model: MediaAsset,
          as: 'mediaAssets',
          required: false
        }
      ]
    });

    res.status(200).json({
      success: true,
      message: 'Location updated successfully',
      data: locationWithTags
    });
  } catch (error) {
    next(error);
  }
};

const deleteLocation = async (req, res, next) => {
  try {
    const { id } = req.params;

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

    await location.destroy();

    res.status(200).json({
      success: true,
      message: 'Location deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllLocations,
  getLocationById,
  createLocation,
  updateLocation,
  deleteLocation,
};

