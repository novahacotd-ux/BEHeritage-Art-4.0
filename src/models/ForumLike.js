const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/db");

const ForumLike = sequelize.define(
  "ForumLike",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    target_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    target_type: {
      type: DataTypes.ENUM("POST", "COMMENT"),
      allowNull: false,
    },
    created_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "forum_likes",
    timestamps: false,
  }
);

module.exports = ForumLike;
