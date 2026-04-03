const jwt = require("jsonwebtoken");
const { User, Role } = require("../models");

const optionalAuth = async(req, res, next) => {
    try {

    let token = req.cookies.accessToken;

    if (!token && req.headers.authorization) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next()
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from database
    const user = await User.findByPk(decoded.id, {
      include: [{
        model: Role,
        as: 'roles',
        attributes: ['id', 'role_name', 'role_code', 'role_description'],
        through: { attributes: [] }
      }],
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token. User not found.'
      });
    }

    if (user.status !== 'Active') {
      return res.status(403).json({
        success: false,
        message: 'Account is not active.'
      });
    }

    // Attach user to request
    req.user = user;
    return next()
  } catch (error) {
   return next()
  }
}

module.exports = optionalAuth;