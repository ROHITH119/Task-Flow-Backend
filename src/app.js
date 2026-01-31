const express = require("express")
const app = express()

const taskRoutes = require("./routes/task.routes")
const authRoutes = require("./routes/auth.routes")
const analyticsRoutes = require("./routes/analytics.routes")
const errorMiddleware = require("./middlewares/error.middleware")
const logger = require("./middlewares/logger.middleware")

app.use(express.json())

app.use(logger)

app.use("/auth", authRoutes)
app.use("/tasks", taskRoutes)
app.use("/analytics", analyticsRoutes)

app.get("/health", (req, res) => {
    res.status(200).json({status: "ok"})
})

app.use(errorMiddleware)

module.exports = app





