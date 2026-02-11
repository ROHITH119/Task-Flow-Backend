const User = require("../models/user.model");
const Task = require("../models/task.model");
const mongoose = require("mongoose");

const createTask = async ({ title, description, assignedTo, createdBy }) => {
  if (!title || !assignedTo) {
    const error = new Error("title and assigned to are required");
    error.status = 400;
    throw error;
  }

  description = description || "";

  if (!mongoose.Types.ObjectId.isValid(assignedTo)) {
    const error = new Error("invalid assign user id");
    error.status = 400;
    throw error;
  }

  const existingUser = await User.findById(assignedTo);

  if (!existingUser) {
    const error = new Error("user not found");
    error.status = 404;
    throw error;
  }

  const task = await Task.create({
    title: title,
    description: description,
    assignedTo: assignedTo,
    createdBy: createdBy,
  });

  return task;
};

const getAllTasks = async ({ limit, cursor, status, assignedTo, search }) => {
  limit = Number(limit) || 10;
  const query = {
    $or: [{ isDeleted: false }, { isDeleted: { $exists: false } }],
  };

  if (status) {
    query.status = status;
  }

  if (assignedTo) {
    query.assignedTo = assignedTo;
  }

  if (cursor) {
    query._id = { $lt: cursor };
  }

  if(search) {
    query.title = {$regex: search, $options: "i"}
  }

  const tasks = await Task.find(query)
    .sort({ _id: -1 })
    .limit(limit)
    .populate("assignedTo", "name email")
    .populate("createdBy", "name email");

  const nextCursor = tasks.length > 0 ? tasks[tasks.length - 1]._id : null;

  return {
    tasks,
    nextCursor,
  };
};

const getMyTasks = async ({ limit, cursor, status, assignedTo, search }) => {
  limit = Number(limit) || 10;

  if (!mongoose.Types.ObjectId.isValid(assignedTo)) {
    const error = new Error("invalid user id");
    error.status = 400;
    throw error;
  }

  const query = {
    $or: [{ isDeleted: false }, { isDeleted: { $exists: false } }],
  };
  if (status) {
    query.status = status;
  }

  if (cursor) {
    query._id = { $lt: cursor };
  }

  if(assignedTo) {
  query.assignedTo = assignedTo;
  }

  if(search) {
    query.title = {$regex: search, $options: "i"}
  }

  const tasks = await Task.find(query)
    .sort({ _id: -1 })
    .limit(limit)
    .populate("assignedTo", "name email")
    .populate("createdBy", "name email");

  const nextCursor = tasks.length > 0 ? tasks[tasks.length - 1]._id : null;
  // console.log(tasks);

  return {
    tasks,
    nextCursor,
  };
};

const updateTaskStatus = async ({ taskId, status, userId }) => {
  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    const error = new Error("invalid task id");
    error.status = 400;
    throw error;
  }

  const allowedStatus = ["TODO", "IN_PROGRESS", "DONE"];
  if (!allowedStatus.includes(status)) {
    const error = new Error("invalid task status");
    error.status = 400;
    throw error;
  }

  const task = await Task.findById(taskId);

  if (!task) {
    const error = new Error("task not found");
    error.status = 404;
    throw error;
  }

  if (task.assignedTo.toString() !== userId) {
    const error = new Error("you are not allowed to update this task");
    error.status = 403;
    throw error;
  }

  task.status = status;
  await task.save();

  return task;
};

const getTaskById = async ({ taskId, role, userId }) => {
  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    const error = new Error("invalid task id");
    error.status = 400;
    throw error;
  }

  const task = await Task.findById(taskId)
    .populate("assignedTo", "name email")
    .populate("createdBy", "name email");

  if (!task) {
    const error = new Error("Task not found");
    error.status = 404;
    throw error;
  }

  if (role === "MEMBER") {
    if (task.assignedTo.toString() !== userId) {
      const error = new Error("you are not allowed to view this task");
      error.status = 403;
      throw error;
    }
  }

  return task;
};

const deleteTaskById = async ({ taskId }) => {
  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    const error = new Error("invalid task id");
    error.status = 400;
    throw error;
  }

  const task = await Task.findById(taskId);

  if (!task || task.isDeleted) {
    const error = new Error("task not found");
    error.status = 404;
    throw error;
  }

  task.isDeleted = true;
  await task.save();

  return task;
};

const updateTask = async ({ taskId, title, description, assignedTo }) => {
  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    const error = new Error("Invalid task id");
    error.status = 400;
    throw error;
  }

  const task = await Task.findById(taskId);

  if (!task) {
    const error = new Error("Task not found");
    error.status = 404;
    throw error;
  }

  // Only update allowed fields
  if (title !== undefined) {
    task.title = title;
  }

  if (description !== undefined) {
    task.description = description;
  }

  if (assignedTo !== undefined) {
    if (!mongoose.Types.ObjectId.isValid(assignedTo)) {
      const error = new Error("Invalid assigned user id");
      error.status = 400;
      throw error;
    }

    const user = await User.findById(assignedTo);

    if (!user) {
      const error = new Error("Assigned user not found");
      error.status = 404;
      throw error;
    }

    task.assignedTo = assignedTo;
  }

  await task.save();

  const updatedTask = await Task.findById(taskId)
    .populate("assignedTo", "name email")
    .populate("createdBy", "name email");

  return updatedTask;
};

module.exports = {
  createTask,
  getAllTasks,
  getMyTasks,
  updateTaskStatus,
  getTaskById,
  deleteTaskById,
  updateTask,
};
