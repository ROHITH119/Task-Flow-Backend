const express = require("express")
const app = express()
const cors = require("cors")

const taskRoutes = require("./routes/task.routes")
const authRoutes = require("./routes/auth.routes")
const analyticsRoutes = require("./routes/analytics.routes")
const errorMiddleware = require("./middlewares/error.middleware")
const requestLogger = require("./middlewares/logger.middleware")
const userRoutes = require("./routes/user.routes")

app.use(cors({
    origin: [
        "http://localhost:5173",
        "https://taskflowlite.netlify.app"
    ]
}))

// app.use(cors())
app.use(express.json())

app.use(requestLogger)

app.use("/auth", authRoutes)
app.use("/tasks", taskRoutes)
app.use("/analytics", analyticsRoutes)
app.use("/users", userRoutes)

app.get("/health", (req, res) => {
    res.status(200).json({status: "ok"})
})

app.use(errorMiddleware)

module.exports = app





