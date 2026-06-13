const notFound = (req, res, next) => {
  const err = new Error(`Not Found - ${req.originalUrl}`);

  res.status(404);
  next(err);
};

const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  const errorMessage = err.message;

  res.status(statusCode).json({
    message: errorMessage,
    stack:
      process.env.NODE_ENV === 'production'
        ? null
        : err.stack,
  });
};

export { notFound, errorHandler };