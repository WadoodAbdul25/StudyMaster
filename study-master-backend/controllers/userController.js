const User = require("../models/User");

const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("-passwordHash");
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

const updateMe = async (req, res, next) => {
  try {
    const { name, email } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, email },
      { new: true }
    ).select("-passwordHash");
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

const deleteMe = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.user.id);
    res.status(200).json({ message: "Account deleted" });
  } catch (err) {
    next(err);
  }
};

module.exports = { getMe, updateMe, deleteMe };
