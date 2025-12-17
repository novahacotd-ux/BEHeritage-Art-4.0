/**
 * Middleware to check if user has required role(s)
 * @param {...string} allowedRoles - List of allowed role codes
 */
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required.'
        });
      }

      // Get user's role codes
      const userRoleCodes = req.user.roles.map(role => role.role_code);

      // Check if user has at least one of the allowed roles
      const hasPermission = allowedRoles.some(role => userRoleCodes.includes(role));

      if (!hasPermission) {
        return res.status(403).json({
          success: false,
          message: `Access denied. Required roles: ${allowedRoles.join(', ')}`
        });
      }

      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Internal server error.',
        error: error.message
      });
    }
  };
};

module.exports = authorize;
