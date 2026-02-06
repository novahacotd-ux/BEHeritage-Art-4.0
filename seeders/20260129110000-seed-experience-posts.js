'use strict';
const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Lấy danh sách locations và users từ DB
    const locations = await queryInterface.sequelize.query(
      'SELECT id FROM locations LIMIT 5;',
      { type: Sequelize.QueryTypes.SELECT }
    );

    const users = await queryInterface.sequelize.query(
      'SELECT id FROM users LIMIT 3;',
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (locations.length === 0 || users.length === 0) {
      console.log('⚠️  No locations or users found. Please seed locations and users first.');
      return;
    }

    // Tạo sample data cho experience_posts
    const experiencePosts = [
      {
        id: uuidv4(),
     
        user_id: users[0].id,
        caption: 'Tham quan di tích lịch sử tuyệt vời! Kiến trúc cổ kính và không gian yên bình. Rất đáng để ghé thăm.',
        type: 'image',
        cloudinary_url: 'https://res.cloudinary.com/demo/image/upload/v1/experience_posts/post_001.jpg',
        cloudinary_public_id: 'experience_posts/post_001',
        created_at: new Date('2026-01-15'),
        updated_at: new Date('2026-01-15')
      },
      {
        id: uuidv4(),
        user_id: users[1].id,
        caption: 'Nơi đây thật sự ấn tượng! Được tìm hiểu về lịch sử Việt Nam qua những di tích cổ này.',
        type: 'image',
        cloudinary_url: 'https://res.cloudinary.com/demo/image/upload/v1/experience_posts/post_002.jpg',
        cloudinary_public_id: 'experience_posts/post_002',
        created_at: new Date('2026-01-18'),
        updated_at: new Date('2026-01-18')
      },
      {
        id: uuidv4(),
        user_id: users[0].id,
        caption: 'Đi cùng gia đình vào dịp cuối tuần. Các bé rất thích và học được nhiều điều bổ ích.',
        type: 'image',
        cloudinary_url: 'https://res.cloudinary.com/demo/image/upload/v1/experience_posts/post_003.jpg',
        cloudinary_public_id: 'experience_posts/post_003',
        created_at: new Date('2026-01-20'),
        updated_at: new Date('2026-01-20')
      },
      {
        id: uuidv4(),
        user_id: users[2].id,
        caption: 'Buổi sáng tuyệt đẹp tại đây! Ánh nắng chiếu vào tạo nên khung cảnh thơ mộng.',
        type: 'image',
        cloudinary_url: 'https://res.cloudinary.com/demo/image/upload/v1/experience_posts/post_004.jpg',
        cloudinary_public_id: 'experience_posts/post_004',
        created_at: new Date('2026-01-22'),
        updated_at: new Date('2026-01-22')
      },
      {
        id: uuidv4(),
        user_id: users[1].id,
        caption: 'Tham gia tour hướng dẫn viên rất chuyên nghiệp. Hiểu thêm nhiều về giá trị lịch sử và văn hóa của nơi này.',
        type: 'image',
        cloudinary_url: 'https://res.cloudinary.com/demo/image/upload/v1/experience_posts/post_005.jpg',
        cloudinary_public_id: 'experience_posts/post_005',
        created_at: new Date('2026-01-23'),
        updated_at: new Date('2026-01-23')
      },
      {
        id: uuidv4(),
        user_id: users[0].id,
        caption: 'Không gian yên tĩnh, thích hợp để suy ngẫm và thư giãn. Sẽ quay lại lần nữa!',
        type: 'image',
        cloudinary_url: 'https://res.cloudinary.com/demo/image/upload/v1/experience_posts/post_006.jpg',
        cloudinary_public_id: 'experience_posts/post_006',
        created_at: new Date('2026-01-25'),
        updated_at: new Date('2026-01-25')
      },
      {
        id: uuidv4(),
        user_id: users[2].id,
        caption: 'Chụp được những bức ảnh tuyệt vời cho bộ sưu tập của mình. Góc máy nào cũng đẹp!',
        type: 'image',
        cloudinary_url: 'https://res.cloudinary.com/demo/image/upload/v1/experience_posts/post_007.jpg',
        cloudinary_public_id: 'experience_posts/post_007',
        created_at: new Date('2026-01-26'),
        updated_at: new Date('2026-01-26')
      },
      {
        id: uuidv4(),
        user_id: users[1].id,
        caption: 'Tổ chức sự kiện văn hóa tại đây. Không gian lịch sử làm nền tảng tuyệt vời cho chương trình.',
        type: 'video',
        cloudinary_url: 'https://res.cloudinary.com/demo/video/upload/v1/experience_posts/post_008.mp4',
        cloudinary_public_id: 'experience_posts/post_008',
        created_at: new Date('2026-01-27'),
        updated_at: new Date('2026-01-27')
      },
      {
        id: uuidv4(),
        user_id: users[0].id,
        caption: 'Lần đầu tiên đến và rất ấn tượng! Đã tìm hiểu trước qua sách vở nhưng trải nghiệm thực tế còn tuyệt vời hơn.',
        type: 'image',
        cloudinary_url: 'https://res.cloudinary.com/demo/image/upload/v1/experience_posts/post_009.jpg',
        cloudinary_public_id: 'experience_posts/post_009',
        created_at: new Date('2026-01-28'),
        updated_at: new Date('2026-01-28')
      },
      {
        id: uuidv4(),
        user_id: users[2].id,
        caption: 'Mùa xuân đến đây rất đẹp! Hoa nở rộ khắp nơi, tạo nên bức tranh thiên nhiên tuyệt mỹ.',
        type: 'image',
        cloudinary_url: 'https://res.cloudinary.com/demo/image/upload/v1/experience_posts/post_010.jpg',
        cloudinary_public_id: 'experience_posts/post_010',
        created_at: new Date('2026-01-29'),
        updated_at: new Date('2026-01-29')
      }
    ];

    await queryInterface.bulkInsert('experience_posts', experiencePosts, {});
    console.log(' Successfully seeded 10 experience posts');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('experience_posts', null, {});
  }
};
