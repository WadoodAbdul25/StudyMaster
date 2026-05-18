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

    if (!name && !email) {
      return res.status(400).json({ error: "Provide at least a name or email to update" });
    }

    const updates = {};
    if (name) updates.name = name;
    if (email) updates.email = email;

    const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true }).select("-passwordHash");
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
