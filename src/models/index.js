const { sequelize } = require('../../config/db');
const User = require('./User');
const Role = require('./Role');
const UserRole = require('./UserRole');
const Category = require('./Category');
const Topic = require('./Topic');
const Style = require('./Style');
const Product = require('./Product');
const Address = require('./Address');
const Cart = require('./Cart');
const CartItem = require('./CartItem');
const Order = require('./Order');
const OrderDetail = require('./OrderDetail');
const Payment = require('./Payment');

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

// Category and Product associations
Category.hasMany(Product, {
  foreignKey: 'category_id',
  as: 'products'
});

Product.belongsTo(Category, {
  foreignKey: 'category_id',
  as: 'category'
});

// Topic and Product associations
Topic.hasMany(Product, {
  foreignKey: 'topic_id',
  as: 'products'
});

Product.belongsTo(Topic, {
  foreignKey: 'topic_id',
  as: 'topic'
});

// Style and Product associations
Style.hasMany(Product, {
  foreignKey: 'style_id',
  as: 'products'
});

Product.belongsTo(Style, {
  foreignKey: 'style_id',
  as: 'style'
});

// User and Address associations
User.hasMany(Address, {
  foreignKey: 'user_id',
  as: 'addresses'
});

Address.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user'
});

// User and Cart associations
User.hasMany(Cart, {
  foreignKey: 'user_id',
  as: 'carts'
});

Cart.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user'
});

// Cart and CartItem associations
Cart.hasMany(CartItem, {
  foreignKey: 'cart_id',
  as: 'items'
});

CartItem.belongsTo(Cart, {
  foreignKey: 'cart_id',
  as: 'cart'
});

// Product and CartItem associations
Product.hasMany(CartItem, {
  foreignKey: 'product_id',
  as: 'cartItems'
});

CartItem.belongsTo(Product, {
  foreignKey: 'product_id',
  as: 'product'
});

// User and Order associations
User.hasMany(Order, {
  foreignKey: 'user_id',
  as: 'orders'
});

Order.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user'
});

// Address and Order associations
Address.hasMany(Order, {
  foreignKey: 'address_id',
  as: 'orders'
});

Order.belongsTo(Address, {
  foreignKey: 'address_id',
  as: 'address'
});

// Order and OrderDetail associations
Order.hasMany(OrderDetail, {
  foreignKey: 'order_id',
  as: 'orderDetails'
});

OrderDetail.belongsTo(Order, {
  foreignKey: 'order_id',
  as: 'order'
});

// Product and OrderDetail associations
Product.hasMany(OrderDetail, {
  foreignKey: 'product_id',
  as: 'orderDetails'
});

OrderDetail.belongsTo(Product, {
  foreignKey: 'product_id',
  as: 'product'
});

// Order and Payment associations
Order.hasMany(Payment, {
  foreignKey: 'order_id',
  as: 'payments'
});

Payment.belongsTo(Order, {
  foreignKey: 'order_id',
  as: 'order'
});

// Export models and sequelize instance
module.exports = {
  sequelize,
  User,
  Role,
  UserRole,
  Category,
  Topic,
  Style,
  Product,
  Address,
  Cart,
  CartItem,
  Order,
  OrderDetail,
  Payment
};

