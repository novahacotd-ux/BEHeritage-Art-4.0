const { body } = require("express-validator");

const registerValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2, max: 255 })
    .withMessage("Name must be between 2 and 255 characters"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format")
    .normalizeEmail(),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),

  body("identity_number")
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage("Identity number must not exceed 50 characters"),

  body("date_of_birth")
    .optional()
    .isISO8601()
    .withMessage("Invalid date format (use YYYY-MM-DD)"),

  body("gender")
    .optional()
    .isIn(["Male", "Female", "Other"])
    .withMessage("Gender must be Male, Female, or Other"),

  body("intro")
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage("Intro must not exceed 2000 characters"),
];

const loginValidation = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format"),

  body("password").notEmpty().withMessage("Password is required"),
];

const updateUserValidation = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 255 })
    .withMessage("Name must be between 2 and 255 characters"),

  body("email")
    .optional()
    .trim()
    .isEmail()
    .withMessage("Invalid email format")
    .normalizeEmail(),

  body("identity_number")
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage("Identity number must not exceed 50 characters"),

  body("date_of_birth")
    .optional()
    .isISO8601()
    .withMessage("Invalid date format (use YYYY-MM-DD)"),

  body("gender")
    .optional()
    .isIn(["Male", "Female", "Other"])
    .withMessage("Gender must be Male, Female, or Other"),

  body("intro")
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage("Intro must not exceed 2000 characters"),

  body("status")
    .optional()
    .isIn(["Active", "Inactive", "Suspended"])
    .withMessage("Status must be Active, Inactive, or Suspended"),
];

const createUserValidation = [
  ...registerValidation,
  body("role_ids")
    .isArray({ min: 1 })
    .withMessage("At least one role must be assigned")
    .custom((value) => {
      if (!value.every((id) => Number.isInteger(id) && id > 0)) {
        throw new Error("All role IDs must be positive integers");
      }
      return true;
    }),
];

const assignRolesValidation = [
  body("role_ids")
    .isArray({ min: 1 })
    .withMessage("At least one role must be assigned")
    .custom((value) => {
      if (!value.every((id) => Number.isInteger(id) && id > 0)) {
        throw new Error("All role IDs must be positive integers");
      }
      return true;
    }),
];

const roleValidation = [
  body("role_name")
    .trim()
    .notEmpty()
    .withMessage("Role name is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Role name must be between 2 and 100 characters"),

  body("role_code")
    .trim()
    .notEmpty()
    .withMessage("Role code is required")
    .isUppercase()
    .withMessage("Role code must be uppercase")
    .isIn(["ADMIN", "PREMIUM", "ART_PATRON", "TEACHER", "STUDENT", "USER"])
    .withMessage("Invalid role code"),

  body("role_description")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Description must not exceed 500 characters"),

  body("status")
    .optional()
    .isIn(["Active", "Inactive"])
    .withMessage("Status must be Active or Inactive"),
];

// News validation rules
const createNewsValidation = [
  body("content")
    .trim()
    .notEmpty()
    .withMessage("Content is required")
    .isLength({ min: 10 })
    .withMessage("Content must be at least 10 characters"),

  body("tag")
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage("Tag must not exceed 255 characters"),

  body("thumbnail_url")
    .optional()
    .trim()
    .isURL()
    .withMessage("Thumbnail URL must be a valid URL"),

  body("status")
    .optional()
    .isIn(["Draft", "Published", "Archived", "Deleted"])
    .withMessage("Status must be Draft, Published, Archived, or Deleted"),
];

const updateNewsValidation = [
  body("content")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Content cannot be empty")
    .isLength({ min: 10 })
    .withMessage("Content must be at least 10 characters"),

  body("tag")
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage("Tag must not exceed 255 characters"),

  body("thumbnail_url")
    .optional()
    .trim()
    .isURL()
    .withMessage("Thumbnail URL must be a valid URL"),

  body("status")
    .optional()
    .isIn(["Draft", "Published", "Archived", "Deleted"])
    .withMessage("Status must be Draft, Published, Archived, or Deleted"),
];

const updateNewsStatusValidation = [
  body("status")
    .notEmpty()
    .withMessage("Status is required")
    .isIn(["Draft", "Published", "Archived", "Deleted"])
    .withMessage("Status must be Draft, Published, Archived, or Deleted"),
];

// AnalyzeView validation rules
const createAnalyzeViewValidation = [
  body("summary")
    .trim()
    .notEmpty()
    .withMessage("Summary is required")
    .isLength({ min: 10, max: 500 })
    .withMessage("Summary must be between 10 and 500 characters"),

  body("content")
    .trim()
    .notEmpty()
    .withMessage("Content is required")
    .isLength({ min: 10 })
    .withMessage("Content must be at least 10 characters"),

  body("tag")
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage("Tag must not exceed 255 characters"),

  body("thumbnail_url")
    .optional()
    .trim()
    .isURL()
    .withMessage("Thumbnail URL must be a valid URL"),

  body("status")
    .optional()
    .isIn(["Draft", "Published", "Archived", "Deleted"])
    .withMessage("Status must be Draft, Published, Archived, or Deleted"),
];

const updateAnalyzeViewValidation = [
  body("summary")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Summary cannot be empty")
    .isLength({ min: 10, max: 500 })
    .withMessage("Summary must be between 10 and 500 characters"),

  body("content")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Content cannot be empty")
    .isLength({ min: 10 })
    .withMessage("Content must be at least 10 characters"),

  body("tag")
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage("Tag must not exceed 255 characters"),

  body("thumbnail_url")
    .optional()
    .trim()
    .isURL()
    .withMessage("Thumbnail URL must be a valid URL"),

  body("status")
    .optional()
    .isIn(["Draft", "Published", "Archived", "Deleted"])
    .withMessage("Status must be Draft, Published, Archived, or Deleted"),
];

const updateAnalyzeViewStatusValidation = [
  body("status")
    .notEmpty()
    .withMessage("Status is required")
    .isIn(["Draft", "Published", "Archived", "Deleted"])
    .withMessage("Status must be Draft, Published, Archived, or Deleted"),
];

// Event validation rules
const createEventValidation = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ max: 255 })
    .withMessage("Title must not exceed 255 characters"),

  body("content").optional().trim(),

  body("duration")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Duration must not exceed 100 characters"),

  body("location")
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage("Location must not exceed 255 characters"),

  body("tag")
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage("Tag must not exceed 255 characters"),

  body("start_date")
    .optional()
    .isISO8601()
    .withMessage("Start date must be a valid date (YYYY-MM-DD)"),

  body("end_date")
    .optional()
    .isISO8601()
    .withMessage("End date must be a valid date (YYYY-MM-DD)")
    .custom((value, { req }) => {
      if (
        value &&
        req.body.start_date &&
        new Date(value) < new Date(req.body.start_date)
      ) {
        throw new Error("End date must be after start date");
      }
      return true;
    }),
];

const updateEventValidation = [
  body("title")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Title cannot be empty")
    .isLength({ max: 255 })
    .withMessage("Title must not exceed 255 characters"),

  body("content").optional().trim(),

  body("duration")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Duration must not exceed 100 characters"),

  body("location")
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage("Location must not exceed 255 characters"),

  body("tag")
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage("Tag must not exceed 255 characters"),

  body("start_date")
    .optional()
    .isISO8601()
    .withMessage("Start date must be a valid date (YYYY-MM-DD)"),

  body("end_date")
    .optional()
    .isISO8601()
    .withMessage("End date must be a valid date (YYYY-MM-DD)"),

  body("status")
    .optional()
    .isIn(["Draft", "Published", "Cancelled", "Deleted"])
    .withMessage("Status must be Draft, Published, Cancelled, or Deleted"),
];

const addEventFaqValidation = [
  body("question").trim().notEmpty().withMessage("Question is required"),

  body("answer").trim().notEmpty().withMessage("Answer is required"),
];

const createForumPostValidation = [
  body("content")
    .trim()
    .notEmpty()
    .withMessage("Content is required")
    .isLength({ max: 255 })
    .withMessage("Content must not exceed 255 characters"),

  body("tag")
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage("Tag must not exceed 255 characters"),
];

const createForumCommentValidation = [
  body("content")
    .trim()
    .notEmpty()
    .withMessage("Content is required")
    .isLength({ max: 255 })
    .withMessage("Content must not exceed 255 characters"),
];

// Category, Topic, Style validations
const createCategoryValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2, max: 255 })
    .withMessage("Name must be between 2 and 255 characters"),

  body("status")
    .optional()
    .isIn(["Active", "Inactive"])
    .withMessage("Status must be Active or Inactive"),
];

const updateCategoryValidation = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 255 })
    .withMessage("Name must be between 2 and 255 characters"),

  body("status")
    .optional()
    .isIn(["Active", "Inactive"])
    .withMessage("Status must be Active or Inactive"),
];

const createTopicValidation = createCategoryValidation;
const updateTopicValidation = updateCategoryValidation;
const createStyleValidation = createCategoryValidation;
const updateStyleValidation = updateCategoryValidation;

// Product validations
const createProductValidation = [
  body("category_id")
    .notEmpty()
    .withMessage("Category is required")
    .isInt({ min: 1 })
    .withMessage("Category ID must be a positive integer"),

  body("topic_id")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Topic ID must be a positive integer"),

  body("style_id")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Style ID must be a positive integer"),

  body("name")
    .trim()
    .notEmpty()
    .withMessage("Product name is required")
    .isLength({ min: 2, max: 255 })
    .withMessage("Product name must be between 2 and 255 characters"),

  body("price")
    .notEmpty()
    .withMessage("Price is required")
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),

  body("image").optional().trim(),

  body("stock_quantity")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Stock quantity must be a non-negative integer"),

  body("status")
    .optional()
    .isIn(["Active", "Inactive", "Out of Stock"])
    .withMessage("Status must be Active, Inactive, or Out of Stock"),
];

const updateProductValidation = [
  body("category_id")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Category ID must be a positive integer"),

  body("topic_id")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Topic ID must be a positive integer"),

  body("style_id")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Style ID must be a positive integer"),

  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 255 })
    .withMessage("Product name must be between 2 and 255 characters"),

  body("price")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),

  body("image").optional().trim(),

  body("status")
    .optional()
    .isIn(["Active", "Inactive", "Out of Stock"])
    .withMessage("Status must be Active, Inactive, or Out of Stock"),
];

const updateStockValidation = [
  body("stock_quantity")
    .notEmpty()
    .withMessage("Stock quantity is required")
    .isInt({ min: 0 })
    .withMessage("Stock quantity must be a non-negative integer"),
];

// Address validations
const createAddressValidation = [
  body("address")
    .trim()
    .notEmpty()
    .withMessage("Address is required")
    .isLength({ min: 5, max: 500 })
    .withMessage("Address must be between 5 and 500 characters"),

  body("phone")
    .trim()
    .notEmpty()
    .withMessage("Phone is required")
    .isLength({ min: 10, max: 20 })
    .withMessage("Phone must be between 10 and 20 characters"),

  body("is_default")
    .optional()
    .isBoolean()
    .withMessage("is_default must be a boolean"),

  body("status")
    .optional()
    .isIn(["Active", "Inactive"])
    .withMessage("Status must be Active or Inactive"),
];

const updateAddressValidation = [
  body("address")
    .optional()
    .trim()
    .isLength({ min: 5, max: 500 })
    .withMessage("Address must be between 5 and 500 characters"),

  body("phone")
    .optional()
    .trim()
    .isLength({ min: 10, max: 20 })
    .withMessage("Phone must be between 10 and 20 characters"),

  body("is_default")
    .optional()
    .isBoolean()
    .withMessage("is_default must be a boolean"),

  body("status")
    .optional()
    .isIn(["Active", "Inactive"])
    .withMessage("Status must be Active or Inactive"),
];

// Cart validations
const addToCartValidation = [
  body("product_id")
    .notEmpty()
    .withMessage("Product ID is required")
    .isInt({ min: 1 })
    .withMessage("Product ID must be a positive integer"),

  body("quantity")
    .notEmpty()
    .withMessage("Quantity is required")
    .isInt({ min: 1 })
    .withMessage("Quantity must be at least 1"),
];

const updateCartItemValidation = [
  body("quantity")
    .notEmpty()
    .withMessage("Quantity is required")
    .isInt({ min: 1 })
    .withMessage("Quantity must be at least 1"),
];

// Order validations
const createOrderValidation = [
  body("address_id")
    .notEmpty()
    .withMessage("Address is required")
    .isInt({ min: 1 })
    .withMessage("Address ID must be a positive integer"),

  body("note")
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Note must not exceed 1000 characters"),
];

const updateOrderStatusValidation = [
  body("status")
    .notEmpty()
    .withMessage("Status is required")
    .isIn(["Pending", "Processing", "Shipped", "Delivered", "Cancelled"])
    .withMessage(
      "Status must be Pending, Processing, Shipped, Delivered, or Cancelled"
    ),

  body("receive_date")
    .optional()
    .isISO8601()
    .withMessage("Invalid date format (use YYYY-MM-DD)"),
];

// Payment validations
const createPaymentValidation = [
  body("order_id")
    .notEmpty()
    .withMessage("Order ID is required")
    .isInt({ min: 1 })
    .withMessage("Order ID must be a positive integer"),

  body("payment_method")
    .trim()
    .notEmpty()
    .withMessage("Payment method is required")
    .isIn([
      "Credit Card",
      "Debit Card",
      "PayPal",
      "Bank Transfer",
      "Cash on Delivery",
    ])
    .withMessage("Invalid payment method"),

  body("amount")
    .notEmpty()
    .withMessage("Amount is required")
    .isFloat({ min: 0 })
    .withMessage("Amount must be a positive number"),
];

const updatePaymentStatusValidation = [
  body("status")
    .notEmpty()
    .withMessage("Status is required")
    .isIn(["Pending", "Completed", "Failed", "Refunded"])
    .withMessage("Status must be Pending, Completed, Failed, or Refunded"),
];

module.exports = {
  registerValidation,
  loginValidation,
  updateUserValidation,
  createUserValidation,
  assignRolesValidation,
  roleValidation,
  createNewsValidation,
  updateNewsValidation,
  updateNewsStatusValidation,
  createAnalyzeViewValidation,
  updateAnalyzeViewValidation,
  updateAnalyzeViewStatusValidation,
  createEventValidation,
  updateEventValidation,
  addEventFaqValidation,
  createForumPostValidation,
  createForumCommentValidation,
  createCategoryValidation,
  updateCategoryValidation,
  createTopicValidation,
  updateTopicValidation,
  createStyleValidation,
  updateStyleValidation,
  createProductValidation,
  updateProductValidation,
  updateStockValidation,
  createAddressValidation,
  updateAddressValidation,
  addToCartValidation,
  updateCartItemValidation,
  createOrderValidation,
  updateOrderStatusValidation,
  createPaymentValidation,
  updatePaymentStatusValidation,
};
