const roleMiddleware = (...allowedRules) => {
  return async (req, res, next) => {
    if (!req.user || !req.user.role) {
      const error = new Error("forbidden");
      error.status = 403;
      throw error;
    }

    if (!allowedRules.includes(req.user.role)) {
      const error = new Error("forbidden");
      error.status = 403;
      throw error;
    }

    next();
  };
};

module.exports = roleMiddleware;
