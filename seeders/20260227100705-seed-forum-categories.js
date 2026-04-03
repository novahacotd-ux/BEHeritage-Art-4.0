'use strict';
const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('forum_category', [
      {
        category_id: uuidv4(),
        name: 'Công nghệ',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        category_id: uuidv4(),
        name: 'Du lịch',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        category_id: uuidv4(),
        name: 'Thảo luận',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        category_id: uuidv4(),
        name: 'Giáo dục',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        category_id: uuidv4(),
        name: 'Di sản',
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {} )
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('forum_category', null, {});
  }
};
