const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/db");

const ForumCategory= sequelize.define(
    'forum_category',
    {
        category_id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    }, {
    tableName: 'forum_category',
    timestamps: false
}
)
module.exports= ForumCategory