'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert('topics', [
            {
                topic_id: 1,
                name: 'Vietnamese Heritage',
                status: 'Active',
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                topic_id: 2,
                name: 'Buddhism & Spirituality',
                status: 'Active',
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                topic_id: 3,
                name: 'Nature & Landscape',
                status: 'Active',
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                topic_id: 4,
                name: 'Daily Life & Culture',
                status: 'Active',
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                topic_id: 5,
                name: 'Mythology & Legends',
                status: 'Active',
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                topic_id: 6,
                name: 'Prosperity & Fortune',
                status: 'Active',
                created_at: new Date(),
                updated_at: new Date()
            }
        ], {});

        // Update the sequence to start from 7 (after the last inserted ID)
        await queryInterface.sequelize.query(
            "SELECT setval('topics_topic_id_seq', (SELECT MAX(topic_id) FROM topics));"
        );
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('topics', null, {});
    }
};
