const analyticsServices = require("../services/analytics.service");

const tasksByStatus = async (req, res, next) => {
  try {
    const result = await analyticsServices.tasksByStatus();
    res.status(200).json({ success: true, result });
  } catch (err) {
    next(err);
  }
};

const tasksByMember = async (req, res, next) => {
  try{
    const result = await analyticsServices.tasksByMember()
    res.status(200).json({success: true, result})
  } catch(err) {
    next(err)
  }
};

const tasksOverTime = async (req, res, next) => {
  try{
    const result = await analyticsServices.tasksOverTime()
    res.status(200).json({success: true, result})
  } catch(err) {
    next(err)
  }
};

module.exports = { tasksByStatus, tasksByMember, tasksOverTime };
