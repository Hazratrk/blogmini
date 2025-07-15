

// backend/src/middlewares/errorMiddleware.js

const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode; // Eğer status 200 ise 500'e çevir, yoksa kendi statusunu koru
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack, // Production'da stack bilgisini gösterme
  });
};

module.exports = errorHandler;