const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user.model");
const crypto = require("crypto");
const { sendResetEmail } = require("../utils/sendMail");

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

  email = email.toLowerCase();

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

  return { user, token };
};

const forgotPassword = async ({ email }) => {
  const user = await User.findOne({ email });

  if (!user) {
    return;
  }

  const resetToken = crypto.randomBytes(32).toString("hex");

  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;

  await user.save();

  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

  


  console.log(resetUrl);
};

const resetPassword = async ({ token, newPassword }) => {
  const hashedPassword = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken: hashedPassword,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    const error = Error("invalid or expired token");
    error.status = 400;
    throw error;
  }

  user.password = await bcrypt.hash(newPassword, 10);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;

  await user.save();
};

module.exports = { registerUser, loginUser, forgotPassword, resetPassword };
