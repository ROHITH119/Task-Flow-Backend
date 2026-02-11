const userService = require("../services/user.service")

const getMembers = async(req, res, next) => {
    const members = await userService.getMembers();

    return res.status(200).json({success: true, data: members})
}

module.exports = {getMembers}


