/**
 * Global error handler middleware
 */
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Sequelize validation error
  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation error.',
      errors: err.errors.map(e => ({
        field: e.path,
        message: e.message
      }))
    });
  }

  // Sequelize unique constraint error
  if (err.name === 'SequelizeUniqueConstraintError') {
    // Get the field that caused the error
    const field = err.errors[0]?.path;
    const value = err.errors[0]?.value;

    // Provide user-friendly messages
    let message = 'Duplicate entry.';
    if (field === 'name') {
      message = `This name is already in use.`;
    } else if (field && field.endsWith('_id')) {
      message = `A record with this ID already exists. This might be a database sequence issue.`;
    }

    return res.status(409).json({
      success: false,
      message: message,
      errors: err.errors.map(e => ({
        field: e.path,
        message: e.path === 'name' ? `The name "${value}" is already taken.` : `${e.path} already exists.`
      }))
    });
  }

  // Sequelize foreign key constraint error
  if (err.name === 'SequelizeForeignKeyConstraintError') {
    return res.status(400).json({
      success: false,
      message: 'Invalid reference.',
      error: 'The referenced record does not exist.'
    });
  }

  // Default error
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error.',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};

module.exports = errorHandler;
