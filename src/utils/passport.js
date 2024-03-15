import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import passport from "passport";
import User from "../models/User";
import bcrypt from "bcrypt";

passport.use(
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password"
    },
    async (username, password, done) => {
        console.log("Incoming username: ", username);
        console.log("Incoming password: ", password);
      try {
        const user = await User.findOne({ username });
        console.log(
          "bcrypt.compare result:",
          await bcrypt.compare(password, user.password)
        );
        if (!user || (!bcrypt.compare(password, user.password))) {
          return done(null, false, {
            message: "Incorrect username or password",
          });
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.secret,
};

passport.use(
  new JwtStrategy(jwtOptions, async (payload, done) => {
    console.log("JWT Payload:", payload);
    try {
      console.log("JWT Payload:", payload);
      const user = await User.findById(payload.sub);
      console.log("Found User:", user);
      if (!user) {
        return done(null, false);
      }

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);
