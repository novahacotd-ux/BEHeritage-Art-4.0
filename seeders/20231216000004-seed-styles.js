'use strict';
const { v4: uuidv4 } = require('uuid');

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert('styles', [
            {
                style_id: uuidv4(),
                name: 'Traditional',
                status: 'Active',
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                style_id: uuidv4(),
                name: 'Contemporary',
                status: 'Active',
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                style_id: uuidv4(),
                name: 'Minimalist',
                status: 'Active',
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                style_id: uuidv4(),
                name: 'Ornate',
                status: 'Active',
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                style_id: uuidv4(),
                name: 'Folk Art',
                status: 'Active',
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                style_id: uuidv4(),
                name: 'Royal Court',
                status: 'Active',
                created_at: new Date(),
                updated_at: new Date()
            }
        ], {});
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('styles', null, {});
    }
};
