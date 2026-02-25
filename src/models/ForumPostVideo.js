const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/db");

const ForumPostVideo = sequelize.define(
  "ForumPostVideo",
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
    video_url: {
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
    tableName: "forum_post_videos",
    timestamps: false,
  }
);

module.exports = ForumPostVideo;
