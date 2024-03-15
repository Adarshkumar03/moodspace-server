import Mood from "../models/Mood";
import User from "../models/User";
import { getWeekNumber } from "../utils/weekNumber";

exports.mood_post = async (req, res, next) => {
  console.log("Incoming request to /api/mood");
  try {
    console.log("Incoming moodRating:", req.body.moodRating);
    console.log("User ID:", req.user._id);

    const mood = await Mood.create({
      rating: req.body.moodRating,
      user: req.user._id,
    });
    console.log("Created Mood:", mood);

    await User.findByIdAndUpdate(req.user._id, { $push: { moods: mood._id } })
             .then(() => { 
                 console.log("User updated");
                 res.status(201).json({
                     message: "Mood posted successfully",
                     mood
                 });
             });
  } catch (error) {
    console.error("Error in mood_post:", error);
    next(); // Pass the error to the error-handling middleware
  }
};

exports.moods_monthly = async (req, res, next) => {
  let year = req.params.year;
  let userId = req.user._id;
  if (!year || isNaN(year) || parseInt(year) < 2000) {
    year = new Date().getFullYear();
  }
  const pipeline = [
    { $match: { _id: mongoose.Types.ObjectId(userId) } },
    { $unwind: "$moods" }, // Deconstruct the moods array
    {
      $match: {
        // Optional filter for specific year
        "moods.createdAt": {
          $gte: new Date(`${year}-01-01`),
          $lt: new Date(`${year + 1}-01-01`),
        },
      },
    },
    {
      $group: {
        _id: { month: { $month: "$moods.createdAt" } },
        moods: { $push: "$moods" },
      },
    },
  ];
  try {
    const results = await Mood.aggregate(pipeline);
    return res.send(results);
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.moods_weekly = async (req, res, next) => {
  let year = req.params.year;
  let userId = req.user._id;
  if (!year || isNaN(year) || parseInt(year) < 2000) {
    year = new Date().getFullYear();
  }
  const pipeline = [
    { $match: { _id: mongoose.Types.ObjectId(userId) } },
    { $unwind: "$moods" }, // Deconstruct the moods array
    {
      $match: {
        // Optional filter for specific year
        "moods.createdAt": {
          $gte: new Date(`${year}-01-01`),
          $lt: new Date(`${year + 1}-01-01`),
        },
      },
    },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          week: {
            $let: {
              vars: {
                weekParts: { $arrayElemAt: ["$createdAt", getWeekNumber] },
              },
              in: { $arrayElemAt: ["$$weekParts", 1] },
            },
          },
        },
        moods: { $push: "$$ROOT" },
      },
    },
    {
      $project: {
        year: "$_id.year",
        week: "$_id.week",
        moods: 1,
        _id: 0,
      },
    },
  ];
  try {
    let results = User.aggregate(pipeline);
    res.send(results);
  } catch (err) {
    next();
  }
};

exports.mood_detail = async (req, res, next) => {
  const mood = await Mood.findById(req.params.entryId).catch(next);
  return res.send(mood);
};

exports.mood_list = async (req, res, next) => {
  return res.send(req.user.moods);
};

exports.mood_delete_post = async (req, res, next) => {
  Mood.findByIdAndDelete(req.params.entryId)
    .then(() => {
      res.status(204).end();
    })
    .catch(next);
};
