'use strict';
const { v4: uuidv4 } = require('uuid');


module.exports = {
    async up(queryInterface, Sequelize) {
        const categories = await queryInterface.sequelize.query(
            'SELECT category_id, name FROM categories;',
            { type: Sequelize.QueryTypes.SELECT }
        );
        const topics = await queryInterface.sequelize.query(
            'SELECT topic_id, name FROM topics;',
            { type: Sequelize.QueryTypes.SELECT }
        );
        const styles = await queryInterface.sequelize.query(
            'SELECT style_id, name FROM styles;',
            { type: Sequelize.QueryTypes.SELECT }
        );

        const categoryMap = Object.fromEntries(categories.map((c) => [c.name, c.category_id]));
        const topicMap = Object.fromEntries(topics.map((t) => [t.name, t.topic_id]));
        const styleMap = Object.fromEntries(styles.map((s) => [s.name, s.style_id]));

        await queryInterface.bulkInsert('products', [
            {
                product_id: uuidv4(),
                category_id: categoryMap['Traditional Paintings'],
                topic_id: topicMap['Prosperity & Fortune'],
                style_id: styleMap['Folk Art'],
                name: 'ÄÃ´ng Há»“ Folk Painting - Prosperity',
                price: 1500000,
                image: 'https://example.com/dong-ho-prosperity.jpg',
                stock_quantity: 15,
                status: 'Active',
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                product_id: uuidv4(),
                category_id: categoryMap['Traditional Paintings'],
                topic_id: topicMap['Nature & Landscape'],
                style_id: styleMap['Traditional'],
                name: 'Lacquer Painting - Lotus Pond',
                price: 3500000,
                image: 'https://example.com/lacquer-lotus.jpg',
                stock_quantity: 8,
                status: 'Active',
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                product_id: uuidv4(),
                category_id: categoryMap['Calligraphy'],
                topic_id: topicMap['Buddhism & Spirituality'],
                style_id: styleMap['Traditional'],
                name: 'Traditional Calligraphy - Peace',
                price: 800000,
                image: 'https://example.com/calligraphy-peace.jpg',
                stock_quantity: 20,
                status: 'Active',
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                product_id: uuidv4(),
                category_id: categoryMap['Sculptures'],
                topic_id: topicMap['Buddhism & Spirituality'],
                style_id: styleMap['Traditional'],
                name: 'Bronze Buddha Statue',
                price: 5000000,
                image: 'https://example.com/bronze-buddha.jpg',
                stock_quantity: 5,
                status: 'Active',
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                product_id: uuidv4(),
                category_id: categoryMap['Ceramics'],
                topic_id: topicMap['Vietnamese Heritage'],
                style_id: styleMap['Traditional'],
                name: 'Bat Trang Ceramic Vase',
                price: 1200000,
                image: 'https://example.com/bat-trang-vase.jpg',
                stock_quantity: 25,
                status: 'Active',
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                product_id: uuidv4(),
                category_id: categoryMap['Textiles'],
                topic_id: topicMap['Daily Life & Culture'],
                style_id: styleMap['Ornate'],
                name: 'Silk Embroidery - Four Seasons',
                price: 2800000,
                image: 'https://example.com/silk-four-seasons.jpg',
                stock_quantity: 10,
                status: 'Active',
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                product_id: uuidv4(),
                category_id: categoryMap['Woodwork'],
                topic_id: topicMap['Mythology & Legends'],
                style_id: styleMap['Ornate'],
                name: 'Hand-carved Wooden Panel',
                price: 4200000,
                image: 'https://example.com/wooden-panel.jpg',
                stock_quantity: 6,
                status: 'Active',
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                product_id: uuidv4(),
                category_id: categoryMap['Traditional Paintings'],
                topic_id: topicMap['Nature & Landscape'],
                style_id: styleMap['Traditional'],
                name: 'Silk Painting - Mountain Landscape',
                price: 2500000,
                image: 'https://example.com/silk-mountain.jpg',
                stock_quantity: 12,
                status: 'Active',
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                product_id: uuidv4(),
                category_id: categoryMap['Ceramics'],
                topic_id: topicMap['Mythology & Legends'],
                style_id: styleMap['Ornate'],
                name: 'Ceramic Tea Set - Dragon Pattern',
                price: 950000,
                image: 'https://example.com/ceramic-tea-set.jpg',
                stock_quantity: 30,
                status: 'Active',
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                product_id: uuidv4(),
                category_id: categoryMap['Calligraphy'],
                topic_id: topicMap['Vietnamese Heritage'],
                style_id: styleMap['Royal Court'],
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


