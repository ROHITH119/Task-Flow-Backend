const User = require("../models/user.model")

const getMembers = async() => {
    const members = await User.find({role: "MEMBER", isActive: true}, {_id:1, name: 1, email: 1, password: 0})
    return members
}

module.exports = {getMembers}


