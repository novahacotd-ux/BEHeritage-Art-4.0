const { sequelize } = require("../../config/db");

// --- IMPORT MODELS ---
// 1. Auth Module
const User = require("./User");
const Role = require("./Role");
const UserRole = require("./UserRole");
const Friendship = require("./Friendship");
const Message = require("./Message");

// 2. Historical Sites Module
const Region = require("./Region");
const HistoricalPeriod = require("./HistoricalPeriod");
const HistoricalSite = require("./HistoricalSite");
const SiteImage = require("./SiteImage");

// 3. AI Tools Module (MỚI)
const AICategory = require("./AICategory");
const AITool = require("./AITool");
const Review = require("./Review");

// --- DEFINE ASSOCIATIONS ---

// PART A: AUTHENTICATION
User.belongsToMany(Role, {
  through: UserRole,
  foreignKey: "user_id",
  otherKey: "role_id",
  as: "roles",
});
Role.belongsToMany(User, {
  through: UserRole,
  foreignKey: "role_id",
  otherKey: "user_id",
  as: "users",
});
User.hasMany(UserRole, { foreignKey: "user_id", as: "userRoles" });
Role.hasMany(UserRole, { foreignKey: "role_id", as: "userRoles" });
UserRole.belongsTo(User, { foreignKey: "user_id", as: "user" });
UserRole.belongsTo(Role, { foreignKey: "role_id", as: "role" });

// PART B: HISTORICAL SITES
Region.hasMany(HistoricalSite, { foreignKey: "region_id" });
HistoricalSite.belongsTo(Region, { foreignKey: "region_id" });

HistoricalPeriod.hasMany(HistoricalSite, { foreignKey: "period_id" });
HistoricalSite.belongsTo(HistoricalPeriod, { foreignKey: "period_id" });

// Friendship associations
Friendship.belongsTo(User, {
  foreignKey: "user_id",
  as: "user",
});

Friendship.belongsTo(User, {
  foreignKey: "friend_id",
  as: "friend",
});

User.hasMany(Friendship, {
  foreignKey: "user_id",
  as: "sentRequests",
});

User.hasMany(Friendship, {
  foreignKey: "friend_id",
  as: "receivedRequests",
});

// Message associations
Message.belongsTo(User, {
  foreignKey: "sender_id",
  as: "sender",
});

Message.belongsTo(User, {
  foreignKey: "receiver_id",
  as: "receiver",
});

User.hasMany(Message, {
  foreignKey: "sender_id",
  as: "sentMessages",
});

User.hasMany(Message, {
  foreignKey: "receiver_id",
  as: "receivedMessages",
});

HistoricalSite.hasMany(SiteImage, {
  foreignKey: "site_id",
  as: "images",
});

SiteImage.belongsTo(HistoricalSite, {
  foreignKey: "site_id",
});

// PART C: CROSS-MODULE (User <-> Content)
User.hasMany(SiteImage, {
  foreignKey: "user_id",
});
SiteImage.belongsTo(User, {
  foreignKey: "user_id",
});

// PART D: AI TOOLS & REVIEWS (MỚI THÊM)
// 1. Category <-> Tool
AICategory.hasMany(AITool, {
  foreignKey: "category_id",
  as: "tools",
});

AITool.belongsTo(AICategory, {
  foreignKey: "category_id",
  as: "category",
});

// 2. Tool <-> Review
AITool.hasMany(Review, {
  foreignKey: "tool_id",
  as: "reviews",
});
Review.belongsTo(AITool, {
  foreignKey: "tool_id",
});

// 3. User <-> Review (Ai viết review?)
User.hasMany(Review, {
  foreignKey: "user_id",
});

Review.belongsTo(User, {
  foreignKey: "user_id",
  as: "user",
}); // alias 'user' để hiện tên người comment

// --- EXPORT ---
module.exports = {
  sequelize,
  User,
  Role,
  UserRole,
  Friendship,
  Message,
  Region,
  HistoricalPeriod,
  HistoricalSite,
  SiteImage,
  AICategory,
  AITool,
  Review,
};
