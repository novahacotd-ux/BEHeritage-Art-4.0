'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert('styles', [
            {
                style_id: 1,
                name: 'Traditional',
                status: 'Active',
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                style_id: 2,
                name: 'Contemporary',
                status: 'Active',
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                style_id: 3,
                name: 'Minimalist',
                status: 'Active',
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                style_id: 4,
                name: 'Ornate',
                status: 'Active',
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                style_id: 5,
                name: 'Folk Art',
                status: 'Active',
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                style_id: 6,
                name: 'Royal Court',
                status: 'Active',
                created_at: new Date(),
                updated_at: new Date()
            }
        ], {});

        // Update the sequence to start from 7 (after the last inserted ID)
        await queryInterface.sequelize.query(
            "SELECT setval('styles_style_id_seq', (SELECT MAX(style_id) FROM styles));"
        );
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('styles', null, {});
    }
};
