const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/db");

const EventRegister = sequelize.define(
  "EventRegister",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    event_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "events",
        key: "id",
      },
    },
    image_url: {
      type: DataTypes.STRING(500),
      allowNull: true,
      validate: {
        isUrl: true,
      },
    },
    created_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: "created_date",
    },
  },
  {
    tableName: "event_registers",
    timestamps: false,
  }
);

module.exports = EventRegister;
