'use strict';
const { v4: uuidv4 } = require('uuid');

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert('categories', [
            {
                category_id: uuidv4(),
                name: 'Traditional Paintings',
                status: 'Active',
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                category_id: uuidv4(),
                name: 'Calligraphy',
                status: 'Active',
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                category_id: uuidv4(),
                name: 'Sculptures',
                status: 'Active',
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                category_id: uuidv4(),
                name: 'Ceramics',
                status: 'Active',
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                category_id: uuidv4(),
                name: 'Textiles',
                status: 'Active',
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                category_id: uuidv4(),
                name: 'Woodwork',
                status: 'Active',
                created_at: new Date(),
                updated_at: new Date()
            }
        ], {});
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('categories', null, {});
    }
};
