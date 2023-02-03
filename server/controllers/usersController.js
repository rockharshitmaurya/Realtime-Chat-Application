const User = require("../model/userModel");
const bcrypt = require("bcrypt");

module.exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const userNameCheck = await User.findOne({ username });
    if (userNameCheck)
      return res.json({ msg: "Username Alreday Exist", status: false });
    const emailNameCheck = await User.findOne({ email });
    if (emailNameCheck)
      return res.json({ msg: "Email Alreday Exist", status: false });
    const hashedPassword = await bcrypt.hash(password, 1);
    const user = await User.create({
      email,
      username,
      password: hashedPassword,
    });
    delete user.password;
    return res.json({ status: true, user });
  } catch (err) {
    next(err);
  }
};

module.exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user)
      return res.json({ msg: "Incorrect username or password", status: false });
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.json({ msg: "Incorrect username or password", status: false });
    delete user.password;

    return res.json({ status: true, user });
  } catch (err) {
    next(err);
  }
};

module.exports.setAvatar = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const avatarImage = req.body.image;

    const userData = await User.findByIdAndUpdate(userId, {
      isAvatarSetImageSet: true,
      avatarImage: avatarImage,
    });
    // console.log(userData + " " + userData.isAvatarSetImageSet);
    return res.json({
      isSet: userData.isAvatarSetImageSet,
      image: userData.avatarImage,
    });
  } catch (err) {
    next(err);
  }
};

module.exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({ _id: { $ne: req.params.id } }).select([
      "email",
      "username",
      "avatarImage",
      "_id",
    ]);
    return res.json(users);
  } catch (err) {
    next(err);
  }
};
