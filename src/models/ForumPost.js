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
      type: DataTypes.UUID,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
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
    dislikes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    category_id:{
      type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'forum_category',
            key: 'category_id'
        },
    },
    title:{
      type: DataTypes.STRING,
      allowNull: true
    },
    status: {
      type: DataTypes.STRING(20),
      defaultValue: "Pending",
      validate: {
        isIn: [["Pending","Active", "Deleted", "Hidden"]],
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
