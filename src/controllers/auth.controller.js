const authService = require("../services/auth.service");

const register = async (req, res, next) => {
  try {
    const user = await authService.registerUser(req.body);

    res.status(201).json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const result = await authService.loginUser(req.body);

    // setTimeout(()=> {res.status(200).json({
    //   success: true,
    //   data: result,
    // })}, 2000)

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    await authService.forgotPassword({ email });

    res.status(200).json({
      success: true,
      message: "If email exists, reset link sent",
    });
  } catch (err) {
    next(err);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const token = req.params.token;
    const newPassword = req.body.newPassword;

    await authService.resetPassword({ token, newPassword });

    res.status(200).json({
      success: true,
      message: "Password reset successful",
    });
  } catch (err) {
    next(err)
  }
};

module.exports = { register, login, forgotPassword, resetPassword };
