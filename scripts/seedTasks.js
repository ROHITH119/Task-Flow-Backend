require("dotenv").config();
const mongoose = require("mongoose");

// Models
const User = require("../src/models/user.model");
const Task = require("../src/models/task.model");

const TASK_COUNT = 100;

const STATUSES = ["TODO", "IN_PROGRESS", "DONE"];

const run = async () => {
  try {
    // Connect DB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("DB connected for seeding");

    // Fetch users
    const admins = await User.find({ role: "ADMIN" });
    const members = await User.find({ role: "MEMBER" });

    if (admins.length === 0 || members.length === 0) {
      throw new Error("Admins or Members missing. Cannot seed tasks.");
    }

    console.log(`Admins found: ${admins.length}`);
    console.log(`Members found: ${members.length}`);

    // Generate tasks
    const tasks = [];

    for (let i = 1; i <= TASK_COUNT; i++) {
      const randomAdmin =
        admins[Math.floor(Math.random() * admins.length)];
      const randomMember =
        members[Math.floor(Math.random() * members.length)];
      const randomStatus =
        STATUSES[Math.floor(Math.random() * STATUSES.length)];

      tasks.push({
        title: `Seed Task ${i}`,
        description: `Auto-generated task number ${i}`,
        status: randomStatus,
        assignedTo: randomMember._id,
        createdBy: randomAdmin._id,
      });
    }

    // Insert tasks
    await Task.insertMany(tasks);

    console.log(`✅ Successfully inserted ${TASK_COUNT} tasks`);

    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding failed:", err.message);
    process.exit(1);
  }
};

run();
