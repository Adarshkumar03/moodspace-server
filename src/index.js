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

const allowedOrigins = [
  "http://localhost:5173",
  "https://moodspace.vercel.app",
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(json());
app.use(cors(corsOptions));
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
