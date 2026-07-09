/**
 * Global error handler middleware
 */
export const errorHandler = (err, req, res, next) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  if (process.env.NODE_ENV !== 'production') {
    console.error(`[Error] ${status} - ${message}`);
    if (err.stack) console.error(err.stack);
  }

  res.status(status).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
};

export const undefinedRoute = (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route tidak ditemukan',
    path: req.originalUrl,
  });
}

