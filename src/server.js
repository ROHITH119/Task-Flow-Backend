const connectDB = require("./config/db")
const app = require("./app")
const dotenv = require("dotenv")
dotenv.config() 

const PORT = process.env.PORT || 5000

const startServer = async() => {
    try{
        await connectDB()
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        })
    } catch(err) {
        console.log("failed to start the app", err.message)
    }
}

startServer()


