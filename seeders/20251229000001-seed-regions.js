'use strict';
const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert('regions', [
            {
                region_id: uuidv4(),
                name: 'Mián Báºc'
            },
            {
                region_id: uuidv4(),
                name: 'Mián Trung'
            },
            {
                region_id: uuidv4(),
                name: 'Mián Nam'
            }
        ], {});
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('regions', null, {});
    }
};

