'use strict';
const { v4: uuidv4 } = require('uuid');

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
                    address_id: uuidv4(),
                    user_id: userId,
                    address: '123 Nguyán Huá, Quáºn 1, TP. Há" ChÃ Minh',
                    phone: '+84901234567',
                    is_default: true,
                    status: 'Active',
                    created_at: new Date(),
                    updated_at: new Date()
                },
                {
                    address_id: uuidv4(),
                    user_id: userId,
                    address: '456 LÃª Lái, Quáºn HoÃ n Kiáºm, HÃ  Nái',
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

