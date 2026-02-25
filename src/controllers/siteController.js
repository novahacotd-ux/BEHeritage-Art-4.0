const { HistoricalSite, SiteImage, Region, HistoricalPeriod } = require('../models');

// Lấy danh sách tất cả địa điểm (để render các pin trên Map)
exports.getAllSites = async (req, res) => {
    try {
        const { region_id, period_id } = req.query;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 100; // Default to 100 for map view
        const offset = (page - 1) * limit;

        // Build where clause for filtering
        const whereClause = {};
        if (region_id) whereClause.region_id = region_id;
        if (period_id) whereClause.period_id = period_id;

        const { count, rows: sites } = await HistoricalSite.findAndCountAll({
            where: whereClause,
            include: [
                {
                    model: Region,
                    attributes: ['region_id', 'name'] // Lấy tên vùng miền
                },
                {
                    model: HistoricalPeriod,
                    attributes: ['period_id', 'name', 'start_year', 'end_year'] // Lấy tên triều đại
                },
                {
                    model: SiteImage,
                    as: 'images',
                    where: {
                        is_featured: true,
                        status: 'approved' // Chỉ lấy ảnh đã được duyệt
                    },
                    required: false, // Nếu không có ảnh vẫn lấy site
                    attributes: ['image_id', 'img_url', 'caption', 'media_type'],
                    limit: 1 // Chỉ lấy 1 ảnh featured cho map preview
                }
            ],
            limit,
            offset,
            order: [['name', 'ASC']]
        });

        res.json({
            success: true,
            data: sites,
            pagination: {
                total: count,
                page,
                limit,
                totalPages: Math.ceil(count / limit)
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

// Lấy chi tiết một địa điểm (Khi bấm vào pin trên map -> xem chi tiết)
exports.getSiteDetail = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if user is admin
        const isAdmin = req.user?.roles?.some(role => role.role_code === 'ADMIN');

        // Build image where clause based on user role
        const imageWhere = isAdmin ? {} : { status: 'approved' };

        const site = await HistoricalSite.findByPk(id, {
            include: [
                { model: Region, attributes: ['region_id', 'name'] },
                { model: HistoricalPeriod, attributes: ['period_id', 'name', 'start_year', 'end_year'] },
                {
                    model: SiteImage,
                    as: 'images', // Lấy tất cả ảnh của site này (hoặc chỉ approved nếu không phải admin)
                    where: imageWhere,
                    required: false,
                    order: [['is_featured', 'DESC'], ['createdAt', 'DESC']]
                }
            ]
        });

        if (!site) {
            return res.status(404).json({ success: false, message: 'Site not found' });
        }

        res.json({ success: true, data: site });
    } catch (error) {
        console.error('Error fetching site detail:', error);
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

// Tạo mới địa điểm (Dành cho Admin/Contributor)
exports.createSite = async (req, res) => {
    try {
        // Giả sử req.body có đủ thông tin: name, lat, lng...
        const newSite = await HistoricalSite.create(req.body);
        res.status(201).json({ success: true, data: newSite });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};