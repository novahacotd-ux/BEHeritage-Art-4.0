const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db');

const SiteImage = sequelize.define('SiteImage', {
  image_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  img_url: {
    type: DataTypes.STRING, // Hoặc TEXT nếu url dài
    allowNull: false
  },
  caption: {
    type: DataTypes.STRING
  },
  is_featured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  media_type: {
    type: DataTypes.ENUM('image', 'video', 'vr3d'), // Dựa vào tên field media_type
    defaultValue: 'image'
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected'),
    defaultValue: 'pending',
    allowNull: false,
    validate: {
      isIn: [['pending', 'approved', 'rejected']]
    }
  },
  site_id: {
    type: DataTypes.INTEGER
  },
  user_id: {
    type: DataTypes.INTEGER // Người đăng ảnh
  }
}, {
  tableName: 'site_images',
  timestamps: true
});

module.exports = SiteImage;