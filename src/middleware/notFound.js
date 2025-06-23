/**
 * 404 Not Found middleware
 */
export const notFound = (req, res, next) => {
  const error = new Error(`Not found - ${req.originalUrl}`);
  res.status(404).json({
    success: false,
    message: error.message,
    path: req.originalUrl,
    method: req.method
  });
};
