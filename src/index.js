import express, { json } from "express";
import bodyParser from "body-parser";
import passport from "passport";
import cors from "cors";
import "dotenv/config";

// Importing the routes
import routes from "./routes";
import { connectToDB } from "./utils/connectDB";
import "./utils/passport";

const app = express();

app.use(json());
app.use(cors());
app.use(bodyParser.json());
app.use(passport.initialize());

connectToDB();

app.use("/v1/user", routes.user);
app.use("/v1/mood", routes.mood);
app.use("/v1/journal", routes.journal);

app.use((error, req, res, next) => {
  if (!error.statusCode) error.statusCode = 500;

  if (error.statusCode === 301) {
    // Temporary workaround
    return next(error); // Pass the error further along
  }

  return res.status(error.statusCode).json({ error: error.toString() });
});

app.listen(process.env.PORT, () => {
  console.log(`Server is listening on port ${process.env.PORT}`);
});
