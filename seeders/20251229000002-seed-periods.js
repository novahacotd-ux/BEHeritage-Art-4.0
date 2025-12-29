'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert('historical_periods', [
            {
                period_id: 1,
                name: 'Triều đại Lý',
                start_year: 1009,
                end_year: 1225
            },
            {
                period_id: 2,
                name: 'Triều đại Trần',
                start_year: 1226,
                end_year: 1400
            },
            {
                period_id: 3,
                name: 'Triều đại Lê',
                start_year: 1428,
                end_year: 1788
            },
            {
                period_id: 4,
                name: 'Triều đại Nguyễn',
                start_year: 1802,
                end_year: 1945
            },
            {
                period_id: 5,
                name: 'Thời kỳ Pháp thuộc',
                start_year: 1858,
                end_year: 1954
            }
        ], {});
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('historical_periods', null, {});
    }
};
