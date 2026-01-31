const logger = async (req, res, next) => {
  const time = new Date().toLocaleString("en-IN");
  console.log(`[${time}] ${req.method} ${req.url}`);
  next();
};

module.exports = logger;
