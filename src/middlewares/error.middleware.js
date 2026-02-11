const errorMiddleware = async (err, req, res, next) => {
  const status = err.status || 500;

  console.log((err.status), "-", err.message)
  res
    .status(status)
    .json({ success: false, message: err.message || "server error" });
};


module.exports = errorMiddleware



