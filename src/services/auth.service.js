const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs");
const User = require("../models/user.model");

const registerUser = async ({ name, email, password }) => {
  if (!name || !email || !password) {
    const error = new Error("name, email and password are required");
    error.status = 400;
    throw error;
  }

  email = email.toLowerCase();

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    const error = new Error("email already registered");
    error.status = 409;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({ name, email, password: hashedPassword });

  return user;
};

const loginUser = async ({ email, password }) => {
  if (!email || !password) {
    const error = new Error("email and password are required");
    error.status = 400;
    throw error;
  }

  email = email.toLowerCase()

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    const error = new Error("invalid email or password");
    error.status = 401;
    throw error;
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    const error = new Error("invalid email or password");
    error.status = 401;
    throw error;
  }

  const token = jwt.sign(
    {
      userId: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    },
  );

  user.password = undefined;

  return {user,token}

};

module.exports = { registerUser, loginUser };
