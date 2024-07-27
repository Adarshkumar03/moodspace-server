import User from "../models/User";
import passport from "passport";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import hmac_rawurlsafe_base64_string from "../utils/IdGenerator";

exports.register_user = async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new User({
      username,
      password: hashedPassword,
      moods: [],
      journals: [],
    });
    const savedUser = await newUser.save();
    const payload = { sub: savedUser._id };
    const token = jwt.sign(payload, process.env.secret, { expiresIn: "1d" });
    const subscriberId = hmac_rawurlsafe_base64_string(
      savedUser._id.toString(),
      process.env.SUPRSEND_WORKSPACE_SECRET
    );
    res.json({ token, username: savedUser.username, subscriberId });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.login_user = (req, res, next) => {
  passport.authenticate("local", { session: false }, (err, user, info) => {
    if (err || !user) {
      console.log(err);
      return res.status(400).json({
        message: info ? info.message : "Login failed",
        user,
      });
    }

    req.login(user, { session: false }, (err) => {
      if (err) {
        res.send(err);
      }
      const payload = { sub: user._id };
      const token = jwt.sign(payload, process.env.secret, { expiresIn: "1d" });
      const subscriberId = hmac_rawurlsafe_base64_string(
        user._id.toString(),
        process.env.SUPRSEND_WORKSPACE_SECRET
      );
      res.json({ username: user.username, token, subscriberId });
    });
  })(req, res);
};

exports.get_users_list = async (req, res, next) => {
  return res.json({ message: "User list" });
};
