'use strict';
const { v4: uuidv4 } = require('uuid');


/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const regions = await queryInterface.sequelize.query(
            'SELECT region_id, name FROM regions;',
            { type: Sequelize.QueryTypes.SELECT }
        );
        const periods = await queryInterface.sequelize.query(
            'SELECT period_id, name FROM historical_periods;',
            { type: Sequelize.QueryTypes.SELECT }
        );

        const regionMap = Object.fromEntries(regions.map((r) => [r.name, r.region_id]));
        const periodMap = Object.fromEntries(periods.map((p) => [p.name, p.period_id]));

        await queryInterface.bulkInsert('historical_sites', [
            {
                site_id: uuidv4(),
                name: 'ChÃ¹a Má»™t Cá»™t',
                province: 'HÃ  Ná»™i',
                description: 'ChÃ¹a Má»™t Cá»™t hay ChÃ¹a DiÃªn Há»±u lÃ  má»™t ngÃ´i chÃ¹a lá»‹ch sá»­ cá»§a Viá»‡t Nam, náº±m trong khu vá»±c HoÃ ng ThÃ nh ThÄƒng Long táº¡i phá»‘ Ã”ng Ãch KhiÃªm, HÃ  Ná»™i.',
                lat: 21.0357,
                lng: 105.8342,
                year_built: 1049,
                region_id: regionMap['Miá»n Báº¯c'],
                period_id: periodMap['Triá»u Ä‘áº¡i LÃ½'],
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                site_id: uuidv4(),
                name: 'VÄƒn Miáº¿u - Quá»‘c Tá»­ GiÃ¡m',
                province: 'HÃ  Ná»™i',
                description: 'VÄƒn Miáº¿u - Quá»‘c Tá»­ GiÃ¡m lÃ  má»™t di tÃ­ch lá»‹ch sá»­ vÄƒn hÃ³a ná»•i tiáº¿ng cá»§a HÃ  Ná»™i vÃ  cáº£ nÆ°á»›c, náº±m á»Ÿ phÃ­a Nam ThÄƒng Long.',
                lat: 21.0277,
                lng: 105.8355,
                year_built: 1070,
                region_id: regionMap['Miá»n Báº¯c'],
                period_id: periodMap['Triá»u Ä‘áº¡i LÃ½'],
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                site_id: uuidv4(),
                name: 'Khu di tÃ­ch Cá»‘ Ä‘Ã´ Huáº¿',
                province: 'Thá»«a ThiÃªn Huáº¿',
                description: 'Quáº§n thá»ƒ di tÃ­ch Cá»‘ Ä‘Ã´ Huáº¿ lÃ  má»™t quáº§n thá»ƒ di tÃ­ch Ä‘áº·c sáº¯c, bao gá»“m kinh thÃ nh vÃ  nhiá»u lÄƒng táº©m, Ä‘á»n Ä‘Ã i, miáº¿u máº¡o khÃ¡c cá»§a triá»u Nguyá»…n.',
                lat: 16.4673,
                lng: 107.5905,
                year_built: 1802,
                region_id: regionMap['Miá»n Trung'],
                period_id: periodMap['Triá»u Ä‘áº¡i Nguyá»…n'],
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                site_id: uuidv4(),
                name: 'ThÃ¡nh Ä‘á»‹a Má»¹ SÆ¡n',
                province: 'Quáº£ng Nam',
                description: 'Má»¹ SÆ¡n lÃ  má»™t quáº§n thá»ƒ di tÃ­ch thÃ¡p Ä‘á»n Hindu cá»§a vÆ°Æ¡ng quá»‘c Champa cá»•, tá»a láº¡c táº¡i má»™t thung lÅ©ng cÃ³ Ä‘Æ°á»ng kÃ­nh khoáº£ng 2 km.',
                lat: 15.7647,
                lng: 108.1251,
                year_built: 400,
                region_id: regionMap['Miá»n Trung'],
                period_id: null,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                site_id: uuidv4(),
                name: 'ThÃ nh nhÃ  Há»“',
                province: 'Thanh HÃ³a',
                description: 'ThÃ nh nhÃ  Há»“ lÃ  má»™t di tÃ­ch lá»‹ch sá»­ Ä‘Æ°á»£c xÃ¢y dá»±ng trong thá»i nhÃ  Há»“, Ä‘Æ°á»£c UNESCO cÃ´ng nháº­n lÃ  di sáº£n vÄƒn hÃ³a tháº¿ giá»›i.',
                lat: 19.8956,
                lng: 105.5533,
                year_built: 1397,
                region_id: regionMap['Miá»n Báº¯c'],
                period_id: periodMap['Triá»u Ä‘áº¡i Tráº§n'],
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                site_id: uuidv4(),
                name: 'NhÃ  thá» Äá»©c BÃ  SÃ i GÃ²n',
                province: 'TP. Há»“ ChÃ­ Minh',
                description: 'NhÃ  thá» Äá»©c BÃ  SÃ i GÃ²n hay VÆ°Æ¡ng cung thÃ¡nh Ä‘Æ°á»ng ChÃ­nh tÃ²a Äá»©c Máº¹ VÃ´ Nhiá»…m NguyÃªn Tá»™i lÃ  má»™t nhÃ  thá» CÃ´ng giÃ¡o táº¡i trung tÃ¢m thÃ nh phá»‘ Há»“ ChÃ­ Minh.',
                lat: 10.7797,
                lng: 106.6990,
                year_built: 1880,
                region_id: regionMap['Miá»n Nam'],
                period_id: periodMap['Thá»i ká»³ PhÃ¡p thuá»™c'],
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ], {});
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('historical_sites', null, {});
    }
};


