'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        // Get the admin user ID (assuming it's 1 from the existing seed)
        const users = await queryInterface.sequelize.query(
            `SELECT id FROM users LIMIT 1;`,
            { type: queryInterface.sequelize.QueryTypes.SELECT }
        );

        if (users.length > 0) {
            const userId = users[0].id;

            await queryInterface.bulkInsert('addresses', [
                {
                    address_id: 1,
                    user_id: userId,
                    address: '123 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh',
                    phone: '+84901234567',
                    is_default: true,
                    status: 'Active',
                    created_at: new Date(),
                    updated_at: new Date()
                },
                {
                    address_id: 2,
                    user_id: userId,
                    address: '456 Lê Lợi, Quận Hoàn Kiếm, Hà Nội',
                    phone: '+84907654321',
                    is_default: false,
                    status: 'Active',
                    created_at: new Date(),
                    updated_at: new Date()
                }
            ], {});
        }
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('addresses', null, {});
    }
};
