import Mood from "../models/Mood";
import User from "../models/User";

exports.mood_post = async (req, res, next) => {
  console.log("Incoming request to /api/mood");
  try {
    console.log("Incoming moodRating:", req.body.moodRating);
    console.log("User ID:", req.user._id);

    const mood = await Mood.create({
      rating: req.body.moodRating,
      smfqScore: req.body.score,
      user: req.user._id,
    });
    console.log("Created Mood:", mood);

    await User.findByIdAndUpdate(req.user._id, {
      $push: { moods: mood._id },
    }).then(() => {
      console.log("User updated");
      res.status(201).json({
        message: "Mood posted successfully",
        mood,
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
  const d = new Date();
  let month = d.getMonth()+1;

  if (!year || isNaN(year) || parseInt(year) < 2000) {
    year = new Date().getFullYear();
  }
  Mood.find({
    user: userId,
    month: month,
  })
    .exec()
    .then((moods) => {
      res.status(201).json({
        message: "Moods sent successfully",
        moods,
      });
    })
    .catch(next);
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
