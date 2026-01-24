const jwt = require("jsonwebtoken")

const authMiddleware = async (req, res, next) => {
  try {
    if (
      !req.headers.authorization ||
      !req.headers.authorization.startsWith("Bearer ")
    ) {
      const error = new Error("unauthorized");
      error.status = 401;
      throw error;
    }

    const token = req.headers.authorization.split(" ")[1]

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    req.user = {
        userId : decoded.userId,
        role: decoded.role
    }

    next()
  } catch (err) {
    err.status = err.status || 401;
    next(err)
  }
};

module.exports = authMiddleware


