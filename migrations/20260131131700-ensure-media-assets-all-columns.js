'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const requiredColumns = [
      { name: 'id', type: Sequelize.UUID, allowNull: false, primaryKey: true },
      { name: 'location_id', type: Sequelize.UUID, allowNull: false },
      { name: 'type', type: Sequelize.STRING(50), allowNull: true },
      { name: 'cloudinary_url', type: Sequelize.TEXT, allowNull: true },
      { name: 'cloudinary_public_id', type: Sequelize.TEXT, allowNull: true },
      { name: 'display_order', type: Sequelize.INTEGER, allowNull: true },
      { name: 'created_at', type: Sequelize.DATE, allowNull: false }
    ];

    for (const col of requiredColumns) {
      const [columns] = await queryInterface.sequelize.query(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'media_assets' 
        AND table_schema = 'public'
        AND column_name = '${col.name}'
      `);

      if (columns.length === 0) {
        if (col.primaryKey) {
          continue;
        }
        await queryInterface.addColumn('media_assets', col.name, {
          type: col.type,
          allowNull: col.allowNull,
        });
      }
    }
  },

  async down (queryInterface, Sequelize) {
  }
};
