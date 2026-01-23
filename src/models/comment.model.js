const mongoose = require("mongoose")

const commentSchema = mongoose.Schema({
    task: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task",
        required: true
    }, author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }, content: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        maxlength: 1000,
    }
}, {timestamps: true})

module.exports = mongoose.model("Comment", commentSchema)


