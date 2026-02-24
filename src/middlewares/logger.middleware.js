const logger = require("../utils/logger")

const requestLogger = async (req, res, next) => {
  // const time = new Date().toLocaleString("en-IN");
  // console.log(`[${time}] ${req.method} ${req.url}`);

  const start = Date.now()

  res.on("finish", () => {
    const duration = Date.now() - start

    logger.info({
      method: req.method,
      url: req.url,
      statusCode : res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
    })
  })

  next();
};

module.exports = requestLogger;
