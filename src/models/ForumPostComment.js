const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/db");

const ForumPostComment = sequelize.define(
  "ForumPostComment",
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
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    parent_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    content: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 255],
      },
    },
    likes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    created_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "forum_post_comments",
    timestamps: false,
  }
);

module.exports = ForumPostComment;
