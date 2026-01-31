const Task = require("../models/task.model");

const tasksByStatus = async () => {
  const result = await Task.aggregate([
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        status: "$_id",
        count: 1,
      },
    },
  ]);

  return result;
};

const tasksByMember = async () => {
  const result = await Task.aggregate([
    {
      $group: {
        _id: "$assignedTo",
        taskCount: { $sum: 1 },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "member",
      },
    },
    { $unwind: "$member" },
    {
      $project: {
        _id: 0,
        memberId: "$member._id",
        memberName: "$member.name",
        taskCount: 1,
      },
    },
  ]);

  return result;
};

const tasksOverTime = async () => {
  const result = await Task.aggregate([
    {
      $group: {
        _id: {
          $dateToString: {
            format: "%Y-%m-%d",
            date: "$createdAt",
          },
        },
        count: { $sum: 1 },
      },
    },
    {$sort: {createdAt: -1}},
    {
        $project: {
            _id: 0,
            date: "$_id",
            count: 1,
        }
    }
  ]);

  return result;
};

module.exports = { tasksByStatus, tasksByMember, tasksOverTime };
