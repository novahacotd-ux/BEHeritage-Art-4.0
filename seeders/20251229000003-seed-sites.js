'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert('historical_sites', [
            {
                site_id: 1,
                name: 'Chùa Một Cột',
                province: 'Hà Nội',
                description: 'Chùa Một Cột hay Chùa Diên Hựu là một ngôi chùa lịch sử của Việt Nam, nằm trong khu vực Hoàng Thành Thăng Long tại phố Ông Ích Khiêm, Hà Nội.',
                lat: 21.0357,
                lng: 105.8342,
                year_built: 1049,
                region_id: 1,
                period_id: 1,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                site_id: 2,
                name: 'Văn Miếu - Quốc Tử Giám',
                province: 'Hà Nội',
                description: 'Văn Miếu - Quốc Tử Giám là một di tích lịch sử văn hóa nổi tiếng của Hà Nội và cả nước, nằm ở phía Nam Thăng Long.',
                lat: 21.0277,
                lng: 105.8355,
                year_built: 1070,
                region_id: 1,
                period_id: 1,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                site_id: 3,
                name: 'Khu di tích Cố đô Huế',
                province: 'Thừa Thiên Huế',
                description: 'Quần thể di tích Cố đô Huế là một quần thể di tích đặc sắc, bao gồm kinh thành và nhiều lăng tẩm, đền đài, miếu mạo khác của triều Nguyễn.',
                lat: 16.4673,
                lng: 107.5905,
                year_built: 1802,
                region_id: 2,
                period_id: 4,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                site_id: 4,
                name: 'Thánh địa Mỹ Sơn',
                province: 'Quảng Nam',
                description: 'Mỹ Sơn là một quần thể di tích tháp đền Hindu của vương quốc Champa cổ, tọa lạc tại một thung lũng có đường kính khoảng 2 km.',
                lat: 15.7647,
                lng: 108.1251,
                year_built: 400,
                region_id: 2,
                period_id: null,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                site_id: 5,
                name: 'Thành nhà Hồ',
                province: 'Thanh Hóa',
                description: 'Thành nhà Hồ là một di tích lịch sử được xây dựng trong thời nhà Hồ, được UNESCO công nhận là di sản văn hóa thế giới.',
                lat: 19.8956,
                lng: 105.5533,
                year_built: 1397,
                region_id: 1,
                period_id: 2,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                site_id: 6,
                name: 'Nhà thờ Đức Bà Sài Gòn',
                province: 'TP. Hồ Chí Minh',
                description: 'Nhà thờ Đức Bà Sài Gòn hay Vương cung thánh đường Chính tòa Đức Mẹ Vô Nhiễm Nguyên Tội là một nhà thờ Công giáo tại trung tâm thành phố Hồ Chí Minh.',
                lat: 10.7797,
                lng: 106.6990,
                year_built: 1880,
                region_id: 3,
                period_id: 5,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ], {});
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('historical_sites', null, {});
    }
};
