const taskService = require("../services/task.service");

const createTask = async (req, res, next) => {
  try {
    const createdBy = req.user.userId;
    const { title, description, assignedTo } = req.body;

    const task = await taskService.createTask({
      title,
      description,
      assignedTo,
      createdBy,
    });

    res.status(201).json({
      success: true,
      data: {
        task,
      },
    });
  } catch (err) {
    next(err);
  }
};

const getAllTasks = async (req, res, next) => {
  try {
    const result = await taskService.getAllTasks(req.query);

    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

const getMyTasks = async (req, res, next) => {
  try {
    const result = await taskService.getMyTasks({
      ...req.query,
      assignedTo: req.user.userId,
    });

    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

const updateTaskStatus = async (req, res, next) => {
  try {
    const taskId = req.params.id;
    console.log(taskId)
    const { status } = req.body;
    const userId = req.user.userId;

    const result = await taskService.updateTaskStatus({
      taskId,
      status,
      userId,
    });

    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

const getTaskById = async (req, res, next) => {
  try{
    const taskId = req.params.id
    const {role, userId} = req.user

    const result = await taskService.getTaskById({taskId, role, userId})

    res.status(200).json({success: true, data: {result}})

  } catch(err) {
    next(err)
  }
};

module.exports = {
  createTask,
  getAllTasks,
  getMyTasks,
  updateTaskStatus,
  getTaskById,
};
