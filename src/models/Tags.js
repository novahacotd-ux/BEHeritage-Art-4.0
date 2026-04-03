const { DataTypes } = require("sequelize")
const { sequelize } = require("../../config/db")

const Tags= sequelize.define('tags',{
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    }
    },{
    tableName: 'tags',
    timestamps: false,
    })

    module.exports=Tags