const logger = require("../utils/logger")

const errorMiddleware = async (err, req, res, next) => {
  const status = err.status || 500;

  // console.log((err.status), "-", err.message)

  logger.error({
    message: err.message,
    stack: err.stack,
    method: err.method,
    url: err.originalUrl,
    body: err.body
  })

  res
    .status(status)
    .json({ success: false, message: err.message || "server error" });
};


module.exports = errorMiddleware



