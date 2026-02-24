const pino = require("pino")

const logger = pino({
    // level: process.env.NODE_ENV === "production" ? "info" : "error"
    // level: "debug"
    level: process.env.LOG_LEVEL || 
         (process.env.NODE_ENV === "production" ? "info" : "debug"),
})

module.exports = logger


