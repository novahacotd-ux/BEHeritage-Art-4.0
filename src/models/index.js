const { sequelize } = require("../../config/db");
const User = require("./User");
const Role = require("./Role");
const UserRole = require("./UserRole");
const News = require("./News");
const NewsImage = require("./NewsImage");
const AnalyzeView = require("./AnalyzeView");
const AnalyzeViewImage = require("./AnalyzeViewImage");
const Event = require("./Event");
const EventFaq = require("./EventFaq");
const Event = require("./Event");
const EventFaq = require("./EventFaq");
const EventRegister = require("./EventRegister");
const ForumPost = require("./ForumPost");
const ForumPostImage = require("./ForumPostImage");
const ForumPostVideo = require("./ForumPostVideo");
const ForumPostComment = require("./ForumPostComment");
const ForumLike = require("./ForumLike");

// Define Many-to-Many associations through UserRole
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

// Direct associations for convenience
User.hasMany(UserRole, {
  foreignKey: "user_id",
  as: "userRoles",
});

Role.hasMany(UserRole, {
  foreignKey: "role_id",
  as: "userRoles",
});

UserRole.belongsTo(User, {
  foreignKey: "user_id",
  as: "user",
});

UserRole.belongsTo(Role, {
  foreignKey: "role_id",
  as: "role",
});

// News and NewsImage associations
News.hasMany(NewsImage, {
  foreignKey: "news_id",
  as: "images",
});

NewsImage.belongsTo(News, {
  foreignKey: "news_id",
  as: "news",
});

// AnalyzeView and AnalyzeViewImage associations
AnalyzeView.hasMany(AnalyzeViewImage, {
  foreignKey: "analyze_view_id",
  as: "images",
});

AnalyzeViewImage.belongsTo(AnalyzeView, {
  foreignKey: "analyze_view_id",
  as: "analyzeView",
});

// Event and EventFaq associations
Event.hasMany(EventFaq, {
  foreignKey: "event_id",
  as: "faqs",
});

EventFaq.belongsTo(Event, {
  foreignKey: "event_id",
  as: "event",
});

// Event and EventRegister associations
Event.hasMany(EventRegister, {
  foreignKey: "event_id",
  as: "registers",
});

EventRegister.belongsTo(Event, {
  foreignKey: "event_id",
  as: "event",
});

// User and EventRegister associations
User.hasMany(EventRegister, {
  foreignKey: "user_id",
  as: "eventRegisters",
});

EventRegister.belongsTo(User, {
  foreignKey: "user_id",
  as: "user",
});

// Forum Associations

// User - ForumPost (1-N)
User.hasMany(ForumPost, { foreignKey: "created_by", as: "posts" });
ForumPost.belongsTo(User, { foreignKey: "created_by", as: "author" });

// ForumPost - ForumPostImage (1-N)
ForumPost.hasMany(ForumPostImage, { foreignKey: "post_id", as: "images" });
ForumPostImage.belongsTo(ForumPost, { foreignKey: "post_id", as: "post" });

// ForumPost - ForumPostVideo (1-N)
ForumPost.hasMany(ForumPostVideo, { foreignKey: "post_id", as: "videos" });
ForumPostVideo.belongsTo(ForumPost, { foreignKey: "post_id", as: "post" });

// ForumPost - ForumPostComment (1-N)
ForumPost.hasMany(ForumPostComment, { foreignKey: "post_id", as: "comments" });
ForumPostComment.belongsTo(ForumPost, { foreignKey: "post_id", as: "post" });

// User - ForumPostComment (1-N)
User.hasMany(ForumPostComment, { foreignKey: "user_id", as: "comments" });
ForumPostComment.belongsTo(User, { foreignKey: "user_id", as: "author" });

// ForumPostComment - ForumPostComment (Reply)
ForumPostComment.hasMany(ForumPostComment, {
  foreignKey: "parent_id",
  as: "replies",
});
ForumPostComment.belongsTo(ForumPostComment, {
  foreignKey: "parent_id",
  as: "parent",
});

// Likes
User.hasMany(ForumLike, { foreignKey: "user_id", as: "likes" });
ForumLike.belongsTo(User, { foreignKey: "user_id", as: "user" });

// Polymorphic-like associations for Likes (manual handling usually, or separate associations)
// We defined target_id and target_type. Sequelize polymorphic is complex.
// We'll handle 'target_type' logic in controller, but can define basic relation for cleanup if needed.
// For now, no direct hasMany from Post/Comment to Like is strictly needed for the 'count' logic (as we have count field),
// but for 'isLikedByMe' check, we might query ForumLike directly.

// Export models and sequelize instance
module.exports = {
  sequelize,
  User,
  Role,
  UserRole,
  News,
  NewsImage,
  AnalyzeView,
  AnalyzeViewImage,
  Event,
  EventFaq,
  EventRegister,
  ForumPost,
  ForumPostImage,
  ForumPostVideo,
  ForumPostComment,
  ForumLike,
};
