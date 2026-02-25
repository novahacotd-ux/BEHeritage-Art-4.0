'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        // Add status column to site_images table
        await queryInterface.addColumn('site_images', 'status', {
            type: Sequelize.ENUM('pending', 'approved', 'rejected'),
            allowNull: false,
            defaultValue: 'pending',
            after: 'media_type' // Put it after media_type column
        });

        // Set all existing images to 'approved' for backward compatibility
        await queryInterface.sequelize.query(
            "UPDATE site_images SET status = 'approved' WHERE status = 'pending'"
        );

        // Add index on status field for better query performance
        await queryInterface.addIndex('site_images', ['status'], {
            name: 'idx_site_images_status'
        });
    },

    async down(queryInterface, Sequelize) {
        // Remove index first
        await queryInterface.removeIndex('site_images', 'idx_site_images_status');

        // Remove status column
        await queryInterface.removeColumn('site_images', 'status');
    }
};
