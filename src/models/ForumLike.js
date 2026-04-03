const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/db");

const forumReactions = sequelize.define(
  "forumReactions",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
          model: "users",
          key: "id",
        },
    },
    target_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    target_type: {
      type: DataTypes.ENUM("POST", "COMMENT"),
      allowNull: false,
    },
    reaction_type: {
      type: DataTypes.ENUM("LIKE", "DISLIKE"),
      allowNull: false,
    },
    created_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "forum_reactions",
    timestamps: false,
    indexes: [{
      unique: true,
      fields: ["user_id", "target_id", "target_type"]
    }]
  }
);

module.exports = forumReactions;
