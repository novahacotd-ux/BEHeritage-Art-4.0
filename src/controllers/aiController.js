const { AITool, AICategory, Review, User, sequelize } = require('../models');

// 1. Lấy danh sách Tools (có kèm Category)
exports.getAllTools = async (req, res) => {
    try {
        const tools = await AITool.findAll({
            include: [
                { model: AICategory, as: 'category', attributes: ['title', 'key'] }
            ],
            order: [['avg_rating', 'DESC']] // Tool nào điểm cao xếp trước
        });
        res.json({ success: true, count: tools.length, data: tools });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 2. Lấy chi tiết 1 Tool + Reviews của nó
exports.getToolDetail = async (req, res) => {
    try {
        const { id } = req.params;
        const tool = await AITool.findByPk(id, {
            include: [
                { model: AICategory, as: 'category' },
                { 
                    model: Review, 
                    as: 'reviews',
                    include: [{ model: User, as: 'user', attributes: ['name', 'id'] }], // Hiện tên người review
                    order: [['createdAt', 'DESC']] // Review mới nhất lên đầu
                }
            ]
        });
        if (!tool) return res.status(404).json({ success: false, message: 'Tool not found' });
        res.json({ success: true, data: tool });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 3. User viết Review (Chức năng quan trọng)
exports.createReview = async (req, res) => {
    const transaction = await sequelize.transaction(); // Dùng transaction để đảm bảo an toàn dữ liệu
    try {
        const { toolId } = req.params;
        const { rating, comment } = req.body;
        const userId = req.user.id; // Lấy từ Token

        // Kiểm tra tool có tồn tại không
        const tool = await AITool.findByPk(toolId);
        if (!tool) {
            await transaction.rollback();
            return res.status(404).json({ success: false, message: 'Tool not found' });
        }

        // Tạo review mới
        const newReview = await Review.create({
            user_id: userId,
            tool_id: toolId,
            rating,
            comment
        }, { transaction });

        // --- TÍNH TOÁN LẠI ĐIỂM TRUNG BÌNH ---
        // Lấy tất cả review của tool này để tính lại
        const reviews = await Review.findAll({ where: { tool_id: toolId }, transaction });
        const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
        const newAvg = totalRating / reviews.length;

        // Cập nhật lại bảng AITool
        await tool.update({
            avg_rating: newAvg,
            total_reviews: reviews.length
        }, { transaction });

        await transaction.commit(); // Lưu tất cả
        res.status(201).json({ success: true, message: 'Review added', data: newReview });

    } catch (error) {
        await transaction.rollback(); // Nếu lỗi thì hoàn tác
        res.status(500).json({ success: false, message: error.message });
    }
};