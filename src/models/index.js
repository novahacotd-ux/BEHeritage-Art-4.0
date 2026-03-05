const { sequelize } = require("../../config/db");
const News = require("./News");
const NewsImage = require("./NewsImage");
const AnalyzeView = require("./AnalyzeView");
const AnalyzeViewImage = require("./AnalyzeViewImage");
const Event = require("./Event");
const EventFaq = require("./EventFaq");
const EventRegister = require("./EventRegister");
const ForumPost = require("./ForumPost");
const ForumPostImage = require("./ForumPostImage");
const ForumPostVideo = require("./ForumPostVideo");
const ForumPostComment = require("./ForumPostComment");
const ForumCategory=require('./ForumCategory')
const ForumTag=require('./ForumTag')
const ForumReactions = require("./ForumLike");
const Category = require("./Category");
const Topic = require("./Topic");
const Style = require("./Style");
const Product = require("./Product");
const Address = require("./Address");
const Cart = require("./Cart");
const CartItem = require("./CartItem");
const Order = require("./Order");
const OrderDetail = require("./OrderDetail");
const Payment = require("./Payment");
const Tags= require('./Tags')

// --- IMPORT MODELS ---
// 1. Auth Module
const User = require("./User");
const Role = require("./Role");
const UserRole = require("./UserRole");
const RefreshToken = require("./RefreshToken");
const Friendship = require("./Friendship");
const Message = require("./Message");

// 2. Historical Sites Module
const Region = require("./Region");
const HistoricalPeriod = require("./HistoricalPeriod");
const HistoricalSite = require("./HistoricalSite");
const SiteImage = require("./SiteImage");
//-------------------------------------//
const Celebrities= require("./Celebrities")
const HistoricalEvents= require('./HistoricalEvent')
const HistoryEventImages=require('./HistoryEventImages')

// 3. AI Tools Module (MỚI)
const AICategory = require("./AICategory");
const AITool = require("./AITool");
const Review = require("./Review");

// 4. Location Module
const Location = require("./Location");
const LocationTag = require("./LocationTag");
const MediaAsset = require("./MediaAsset");
const LocationInteraction = require("./LocationInteraction");


// 5.Post Experience
const ExperiencePost = require("./ExperiencePost");
const ExperienceComment = require("./ExperienceComment");

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

// RefreshToken associations
User.hasMany(RefreshToken, { foreignKey: "user_id", as: "refreshTokens" });
RefreshToken.belongsTo(User, { foreignKey: "user_id", as: "user" });

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

// MANY TO MANY
ForumPost.belongsToMany(Tags, {
  through: ForumTag,
  foreignKey: 'post_id',
  otherKey: 'tag_id',
  as: 'tags'
});

Tags.belongsToMany(ForumPost, {
  through: ForumTag,
  foreignKey: 'tag_id',
  otherKey: 'post_id',
  as: 'posts'
});

// //Forum-ForumTag(1-N)
// ForumPost.hasMany(ForumTag, {foreignKey: 'post_id', as: 'forum_tags'})
// ForumTag.belongsTo(ForumPost, {foreignKey: 'post_id', as: 'post'})

//Tag-ForumTag(1-N)
Tags.hasMany(ForumTag, {foreignKey: 'tag_id', as: 'forum_tags'})
ForumTag.belongsTo(Tags, {foreignKey: 'tag_id', as: 'tag'})

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
User.hasMany(ForumReactions, { foreignKey: "user_id", as: "likes" });
ForumReactions.belongsTo(User, { foreignKey: "user_id", as: "user" });

// Category and Product associations
Category.hasMany(Product, {
  foreignKey: "category_id",
  as: "products",
});

ForumPost.hasMany(ForumReactions, {
  foreignKey: "target_id",
  as: "like"
});

ForumReactions.belongsTo(ForumPost, {
  foreignKey: "target_id"
});

Product.belongsTo(Category, {
  foreignKey: "category_id",
  as: "category",
});

// Topic and Product associations
Topic.hasMany(Product, {
  foreignKey: "topic_id",
  as: "products",
});

Product.belongsTo(Topic, {
  foreignKey: "topic_id",
  as: "topic",
});

// Style and Product associations
Style.hasMany(Product, {
  foreignKey: "style_id",
  as: "products",
});

Product.belongsTo(Style, {
  foreignKey: "style_id",
  as: "style",
});

// User and Address associations
User.hasMany(Address, {
  foreignKey: "user_id",
  as: "addresses",
});

Address.belongsTo(User, {
  foreignKey: "user_id",
  as: "user",
});

// User and Cart associations
User.hasMany(Cart, {
  foreignKey: "user_id",
  as: "carts",
});

Cart.belongsTo(User, {
  foreignKey: "user_id",
  as: "user",
});

// Cart and CartItem associations
Cart.hasMany(CartItem, {
  foreignKey: "cart_id",
  as: "items",
});

CartItem.belongsTo(Cart, {
  foreignKey: "cart_id",
  as: "cart",
});

// Product and CartItem associations
Product.hasMany(CartItem, {
  foreignKey: "product_id",
  as: "cartItems",
});

CartItem.belongsTo(Product, {
  foreignKey: "product_id",
  as: "product",
});

// User and Order associations
User.hasMany(Order, {
  foreignKey: "user_id",
  as: "orders",
});

Order.belongsTo(User, {
  foreignKey: "user_id",
  as: "user",
});

// Address and Order associations
Address.hasMany(Order, {
  foreignKey: "address_id",
  as: "orders",
});

Order.belongsTo(Address, {
  foreignKey: "address_id",
  as: "address",
});

// Order and OrderDetail associations
Order.hasMany(OrderDetail, {
  foreignKey: "order_id",
  as: "orderDetails",
});

OrderDetail.belongsTo(Order, {
  foreignKey: "order_id",
  as: "order",
});

// Product and OrderDetail associations
Product.hasMany(OrderDetail, {
  foreignKey: "product_id",
  as: "orderDetails",
});

OrderDetail.belongsTo(Product, {
  foreignKey: "product_id",
  as: "product",
});

// Order and Payment associations
Order.hasMany(Payment, {
  foreignKey: "order_id",
  as: "payments",
});

Payment.belongsTo(Order, {
  foreignKey: "order_id",
  as: "order",
});

// PART E: LOCATION MODULE
Location.hasMany(LocationTag, {
  foreignKey: "location_id",
  as: "tags",
});
LocationTag.belongsTo(Location, {
  foreignKey: "location_id",
  as: "location",
});

Location.hasMany(LocationInteraction, {
  foreignKey: "location_id",
  as: "interactions",
});

LocationInteraction.belongsTo(Location, {
  foreignKey: "location_id",
  as: "location",
});

User.hasMany(LocationInteraction, {
  foreignKey: "user_id",
  as: "locationInteractions",
});
LocationInteraction.belongsTo(User, {
  foreignKey: "user_id",
  as: "user",
});

// MediaAsset and Location associations
Location.hasMany(MediaAsset, {
   foreignKey: "location_id", 
   as: "mediaAssets", 
  });
MediaAsset.belongsTo(Location, { 
    foreignKey: "location_id",
     as: "location", 
  });


  // Experience Posts and Comments

User.hasMany(ExperiencePost, {
  foreignKey: "user_id",
  as: "experiencePosts",
});
ExperiencePost.belongsTo(User, {
  foreignKey: "user_id",
  as: "author",
});

ExperiencePost.hasMany(ExperienceComment, {
  foreignKey: "post_id",
  as: "comments",
});
ExperienceComment.belongsTo(ExperiencePost, {
  foreignKey: "post_id",
  as: "post",
});

User.hasMany(ExperienceComment, {
  foreignKey: "user_id",
  as: "experienceComments",
});
ExperienceComment.belongsTo(User, {
  foreignKey: "user_id",
  as: "author",
});

// Self-referencing for comment replies
ExperienceComment.hasMany(ExperienceComment, {
  foreignKey: "parent_comment_id",
  as: "replies",
});
ExperienceComment.belongsTo(ExperienceComment, {
  foreignKey: "parent_comment_id",
  as: "parent",
});

HistoricalPeriod.hasMany(Celebrities, {
    foreignKey: 'period_id',
    as: 'celebrities'
})
Celebrities.belongsTo(HistoricalPeriod, {
   foreignKey: 'period_id',
    as: 'period'
});

HistoricalPeriod.hasMany(HistoricalEvents, {
    foreignKey: 'period_id',
    as: 'historical_event'
})
HistoricalEvents.belongsTo(HistoricalPeriod, {
   foreignKey: 'period_id',
    as: 'period'
})

HistoricalEvents.hasMany(HistoryEventImages, {
  foreignKey: 'event_id',
  as:'history_event_images'
})
HistoryEventImages.belongsTo(HistoricalEvents, {
  foreignKey: 'event_id',
  as:'historical_event'
})

ForumCategory.hasMany(ForumPost, {
  foreignKey: 'category_id',
  as: 'posts'
});

ForumPost.belongsTo(ForumCategory, {
  foreignKey: 'category_id',
  as: 'post_category'
});


// Export models and sequelize instance
module.exports = {
  sequelize,
  User,
  Role,
  UserRole,
  RefreshToken,
  Friendship,
  Message,
  Region,
  HistoricalPeriod,
  HistoricalSite,
  Celebrities,//
  HistoricalEvents,//
  HistoryEventImages,
  SiteImage,
  AICategory,
  AITool,
  Review,
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
  ForumReactions,
  Category,
  Topic,
  Style,
  Product,
  Address,
  Cart,
  CartItem,
  Order,
  OrderDetail,
  Payment,
  Location,
  LocationTag,
  MediaAsset,
  LocationInteraction,
  ExperiencePost,        
  ExperienceComment, 
  ForumCategory, 
  Tags,
  ForumTag
};
