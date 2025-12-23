const { sequelize } = require('../../config/db');
const User = require('./User');
const Role = require('./Role');
const UserRole = require('./UserRole');
const News = require('./News');
const NewsImage = require('./NewsImage');
const AnalyzeView = require('./AnalyzeView');
const AnalyzeViewImage = require('./AnalyzeViewImage');

// Define Many-to-Many associations through UserRole
User.belongsToMany(Role, {
  through: UserRole,
  foreignKey: 'user_id',
  otherKey: 'role_id',
  as: 'roles'
});

Role.belongsToMany(User, {
  through: UserRole,
  foreignKey: 'role_id',
  otherKey: 'user_id',
  as: 'users'
});

// Direct associations for convenience
User.hasMany(UserRole, {
  foreignKey: 'user_id',
  as: 'userRoles'
});

Role.hasMany(UserRole, {
  foreignKey: 'role_id',
  as: 'userRoles'
});

UserRole.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user'
});

UserRole.belongsTo(Role, {
  foreignKey: 'role_id',
  as: 'role'
});

// News and NewsImage associations
News.hasMany(NewsImage, {
  foreignKey: 'news_id',
  as: 'images'
});

NewsImage.belongsTo(News, {
  foreignKey: 'news_id',
  as: 'news'
});

// AnalyzeView and AnalyzeViewImage associations
AnalyzeView.hasMany(AnalyzeViewImage, {
  foreignKey: 'analyze_view_id',
  as: 'images'
});

AnalyzeViewImage.belongsTo(AnalyzeView, {
  foreignKey: 'analyze_view_id',
  as: 'analyzeView'
});

// Export models and sequelize instance
module.exports = {
  sequelize,
  User,
  Role,
  UserRole,
  News,
  NewsImage,
  AnalyzeView,
  AnalyzeViewImage
};
