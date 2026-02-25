const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/db");

const ForumPostImage = sequelize.define(
  "ForumPostImage",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    post_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    image_url: {
      type: DataTypes.STRING(500),
      allowNull: false,
      validate: {
        isUrl: true,
      },
    },
    created_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "forum_post_images",
    timestamps: false,
  }
);

module.exports = ForumPostImage;
