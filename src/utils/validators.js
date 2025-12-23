const { body } = require('express-validator');

const registerValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 255 }).withMessage('Name must be between 2 and 255 characters'),

  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail(),

  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),

  body('identity_number')
    .optional()
    .trim()
    .isLength({ max: 50 }).withMessage('Identity number must not exceed 50 characters'),

  body('date_of_birth')
    .optional()
    .isISO8601().withMessage('Invalid date format (use YYYY-MM-DD)'),

  body('gender')
    .optional()
    .isIn(['Male', 'Female', 'Other']).withMessage('Gender must be Male, Female, or Other'),

  body('intro')
    .optional()
    .trim()
    .isLength({ max: 2000 }).withMessage('Intro must not exceed 2000 characters')
];

const loginValidation = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format'),

  body('password')
    .notEmpty().withMessage('Password is required')
];

const updateUserValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 255 }).withMessage('Name must be between 2 and 255 characters'),

  body('email')
    .optional()
    .trim()
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail(),

  body('identity_number')
    .optional()
    .trim()
    .isLength({ max: 50 }).withMessage('Identity number must not exceed 50 characters'),

  body('date_of_birth')
    .optional()
    .isISO8601().withMessage('Invalid date format (use YYYY-MM-DD)'),

  body('gender')
    .optional()
    .isIn(['Male', 'Female', 'Other']).withMessage('Gender must be Male, Female, or Other'),

  body('intro')
    .optional()
    .trim()
    .isLength({ max: 2000 }).withMessage('Intro must not exceed 2000 characters'),

  body('status')
    .optional()
    .isIn(['Active', 'Inactive', 'Suspended']).withMessage('Status must be Active, Inactive, or Suspended')
];

const createUserValidation = [
  ...registerValidation,
  body('role_ids')
    .isArray({ min: 1 }).withMessage('At least one role must be assigned')
    .custom((value) => {
      if (!value.every(id => Number.isInteger(id) && id > 0)) {
        throw new Error('All role IDs must be positive integers');
      }
      return true;
    })
];

const assignRolesValidation = [
  body('role_ids')
    .isArray({ min: 1 }).withMessage('At least one role must be assigned')
    .custom((value) => {
      if (!value.every(id => Number.isInteger(id) && id > 0)) {
        throw new Error('All role IDs must be positive integers');
      }
      return true;
    })
];

const roleValidation = [
  body('role_name')
    .trim()
    .notEmpty().withMessage('Role name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Role name must be between 2 and 100 characters'),

  body('role_code')
    .trim()
    .notEmpty().withMessage('Role code is required')
    .isUppercase().withMessage('Role code must be uppercase')
    .isIn(['ADMIN', 'PREMIUM', 'ART_PATRON', 'TEACHER', 'STUDENT', 'USER'])
    .withMessage('Invalid role code'),

  body('role_description')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Description must not exceed 500 characters'),

  body('status')
    .optional()
    .isIn(['Active', 'Inactive']).withMessage('Status must be Active or Inactive')
];

// News validation rules
const createNewsValidation = [
  body('content')
    .trim()
    .notEmpty().withMessage('Content is required')
    .isLength({ min: 10 }).withMessage('Content must be at least 10 characters'),

  body('tag')
    .optional()
    .trim()
    .isLength({ max: 255 }).withMessage('Tag must not exceed 255 characters'),

  body('thumbnail_url')
    .optional()
    .trim()
    .isURL().withMessage('Thumbnail URL must be a valid URL'),

  body('status')
    .optional()
    .isIn(['Draft', 'Published', 'Archived', 'Deleted'])
    .withMessage('Status must be Draft, Published, Archived, or Deleted')
];

const updateNewsValidation = [
  body('content')
    .optional()
    .trim()
    .notEmpty().withMessage('Content cannot be empty')
    .isLength({ min: 10 }).withMessage('Content must be at least 10 characters'),

  body('tag')
    .optional()
    .trim()
    .isLength({ max: 255 }).withMessage('Tag must not exceed 255 characters'),

  body('thumbnail_url')
    .optional()
    .trim()
    .isURL().withMessage('Thumbnail URL must be a valid URL'),

  body('status')
    .optional()
    .isIn(['Draft', 'Published', 'Archived', 'Deleted'])
    .withMessage('Status must be Draft, Published, Archived, or Deleted')
];

const updateNewsStatusValidation = [
  body('status')
    .notEmpty().withMessage('Status is required')
    .isIn(['Draft', 'Published', 'Archived', 'Deleted'])
    .withMessage('Status must be Draft, Published, Archived, or Deleted')
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
  updateNewsStatusValidation
};
