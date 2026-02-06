'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const [columns] = await queryInterface.sequelize.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'media_assets' 
      AND table_schema = 'public'
      AND column_name = 'display_order'
    `);

    if (columns.length === 0) {
      await queryInterface.addColumn('media_assets', 'display_order', {
        type: Sequelize.INTEGER,
        allowNull: true,
      });
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('media_assets', 'display_order');
  }
};
