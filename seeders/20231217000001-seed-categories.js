'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert('categories', [
            {
                category_id: 1,
                name: 'Traditional Paintings',
                status: 'Active',
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                category_id: 2,
                name: 'Calligraphy',
                status: 'Active',
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                category_id: 3,
                name: 'Sculptures',
                status: 'Active',
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                category_id: 4,
                name: 'Ceramics',
                status: 'Active',
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                category_id: 5,
                name: 'Textiles',
                status: 'Active',
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                category_id: 6,
                name: 'Woodwork',
                status: 'Active',
                created_at: new Date(),
                updated_at: new Date()
            }
        ], {});

        // Update the sequence to start from 7 (after the last inserted ID)
        await queryInterface.sequelize.query(
            "SELECT setval('categories_category_id_seq', (SELECT MAX(category_id) FROM categories));"
        );
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('categories', null, {});
    }
};
