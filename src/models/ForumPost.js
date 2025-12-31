const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/db");

const ForumPost = sequelize.define(
  "ForumPost",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
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
    tag: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING(20),
      defaultValue: "Active",
      validate: {
        isIn: [["Active", "Deleted", "Hidden"]],
      },
    },
    created_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "forum_posts",
    timestamps: false,
  }
);

module.exports = ForumPost;
