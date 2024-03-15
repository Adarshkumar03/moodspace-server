import User from "../models/User";
import passport from "passport";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.login_user = (req, res, next) => {
  passport.authenticate("local", { session: false }, (err, user, info) => {
    console.log("Inside passport.authenticate");
    if (err || !user) {
      console.log("Inside error block");
      return res.status(400).json({
        message: info ? info.message : "Login failed",
        user,
      });
    }

    console.log("User found:", user);

    req.login(user, { session: false }, (err) => {
      if (err) {
        res.send(err);
      }

      const payload = { sub: user._id };
      console.log("User found:", user);
      const token = jwt.sign(payload, process.env.secret, { expiresIn: "1d" });

      res.json({ user, token });
    });
  })(req, res);
};

exports.get_users_lists = async (req, res, next) => {
  try {
    const users = await User.find().select(["username", "password"]);
    res.json(users);
    s;
  } catch (err) {
    next();
  }
};
