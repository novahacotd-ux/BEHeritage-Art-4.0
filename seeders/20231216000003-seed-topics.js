'use strict';
const { v4: uuidv4 } = require('uuid');

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert('topics', [
            {
                topic_id: uuidv4(),
                name: 'Vietnamese Heritage',
                status: 'Active',
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                topic_id: uuidv4(),
                name: 'Buddhism & Spirituality',
                status: 'Active',
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                topic_id: uuidv4(),
                name: 'Nature & Landscape',
                status: 'Active',
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                topic_id: uuidv4(),
                name: 'Daily Life & Culture',
                status: 'Active',
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                topic_id: uuidv4(),
                name: 'Mythology & Legends',
                status: 'Active',
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                topic_id: uuidv4(),
                name: 'Prosperity & Fortune',
                status: 'Active',
                created_at: new Date(),
                updated_at: new Date()
            }
        ], {});
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('topics', null, {});
    }
};
