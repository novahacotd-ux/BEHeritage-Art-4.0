'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert('regions', [
            {
                region_id: 1,
                name: 'Miền Bắc'
            },
            {
                region_id: 2,
                name: 'Miền Trung'
            },
            {
                region_id: 3,
                name: 'Miền Nam'
            }
        ], {});
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('regions', null, {});
    }
};
