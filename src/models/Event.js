const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/db");

const Event = sequelize.define(
  "Event",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    thumbnail_url: {
      type: DataTypes.STRING(500),
      allowNull: true,
      validate: {
        isUrl: true,
      },
    },
    content: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
    },
    duration: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    location: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    tag: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: false, // Assuming start_date is required as created_date was
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING(20),
      defaultValue: "Draft",
      validate: {
        isIn: [["Draft", "Published", "Cancelled", "Deleted"]],
      },
    },
  },
  {
    tableName: "events",
    timestamps: false,
  }
);

module.exports = Event;
