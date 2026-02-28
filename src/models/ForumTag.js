const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/db");

const ForumTag= sequelize.define('forum_tag', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
    },
    tag_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'tags',
            key:'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    },
    post_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'forum_posts',
            key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    } 
}, {
        tableName: "forum_tag", 
        timestamps: false
})
module.exports= ForumTag