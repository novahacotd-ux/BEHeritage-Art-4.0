'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert('products', [
            {
                product_id: 1,
                category_id: 1,
                topic_id: 6,
                style_id: 5,
                name: 'Đông Hồ Folk Painting - Prosperity',
                price: 1500000,
                image: 'https://example.com/dong-ho-prosperity.jpg',
                stock_quantity: 15,
                status: 'Active',
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                product_id: 2,
                category_id: 1,
                topic_id: 3,
                style_id: 1,
                name: 'Lacquer Painting - Lotus Pond',
                price: 3500000,
                image: 'https://example.com/lacquer-lotus.jpg',
                stock_quantity: 8,
                status: 'Active',
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                product_id: 3,
                category_id: 2,
                topic_id: 2,
                style_id: 1,
                name: 'Traditional Calligraphy - Peace',
                price: 800000,
                image: 'https://example.com/calligraphy-peace.jpg',
                stock_quantity: 20,
                status: 'Active',
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                product_id: 4,
                category_id: 3,
                topic_id: 2,
                style_id: 1,
                name: 'Bronze Buddha Statue',
                price: 5000000,
                image: 'https://example.com/bronze-buddha.jpg',
                stock_quantity: 5,
                status: 'Active',
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                product_id: 5,
                category_id: 4,
                topic_id: 1,
                style_id: 1,
                name: 'Bat Trang Ceramic Vase',
                price: 1200000,
                image: 'https://example.com/bat-trang-vase.jpg',
                stock_quantity: 25,
                status: 'Active',
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                product_id: 6,
                category_id: 5,
                topic_id: 4,
                style_id: 4,
                name: 'Silk Embroidery - Four Seasons',
                price: 2800000,
                image: 'https://example.com/silk-four-seasons.jpg',
                stock_quantity: 10,
                status: 'Active',
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                product_id: 7,
                category_id: 6,
                topic_id: 5,
                style_id: 4,
                name: 'Hand-carved Wooden Panel',
                price: 4200000,
                image: 'https://example.com/wooden-panel.jpg',
                stock_quantity: 6,
                status: 'Active',
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                product_id: 8,
                category_id: 1,
                topic_id: 3,
                style_id: 1,
                name: 'Silk Painting - Mountain Landscape',
                price: 2500000,
                image: 'https://example.com/silk-mountain.jpg',
                stock_quantity: 12,
                status: 'Active',
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                product_id: 9,
                category_id: 4,
                topic_id: 5,
                style_id: 4,
                name: 'Ceramic Tea Set - Dragon Pattern',
                price: 950000,
                image: 'https://example.com/ceramic-tea-set.jpg',
                stock_quantity: 30,
                status: 'Active',
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                product_id: 10,
                category_id: 2,
                topic_id: 1,
                style_id: 6,
                name: 'Calligraphy Set - Premium',
                price: 1800000,
                image: 'https://example.com/calligraphy-set.jpg',
                stock_quantity: 18,
                status: 'Active',
                created_at: new Date(),
                updated_at: new Date()
            }
        ], {});
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('products', null, {});
    }
};
