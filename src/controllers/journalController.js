import Journal from "../models/Journal";
import User from "../models/User";
import * as cheerio from "cheerio";

exports.journal_post = async (req, res, next) => {
  try {
    const journal = await Journal.create({
      title: req.body.title,
      journal: req.body.content,
      user: req.user._id,
    });

    await User.findByIdAndUpdate(req.user._id, {
      $push: { journals: journal._id },
    }).then(() => {
      console.log("User updated");
      res.status(201).json({
        message: "Journal posted successfully",
        journal,
      });
    });
  } catch (error) {
    console.error("Error in journal_post:", error);
    next(); // Pass the error to the error-handling middleware
  }
};

exports.journal_detail = async (req, res, next) => {
  const journal = await Journal.findById(req.params.entryId).catch(next);
  return res.status(200).json({ journal });
};

exports.journal_list = async (req, res, next) => {
  try {
    const journals = await Journal.find({ user: req.user._id }).sort({
      createdAt: -1,
    }); // Sort by newest first // Select only title and content

    // Extract first two lines from content if necessary
    const formattedJournals = journals.map((journal) => {
      const $ = cheerio.load(journal.journal);
      // Remove HTML tags while preserving plain text
      const preview = $.root().text().slice(0, 200); // Adjust slice limit as needed.
      return { ...journal, preview };
    });
    console.log(formattedJournals[0]._doc.title);
    res.status(200).json({
      message: "Journal successfully send",
      formattedJournals,
    });
  } catch (err) {
    next(err);
  }
};

exports.journal_list_min = async (req, res, next) => {
  try {
    const journals = await Journal.find({ user: req.user._id })
      .sort({ createdAt: -1 }) // Sort by newest first
      .limit(4); // Select only title and content

    // Extract first two lines from content if necessary
    const formattedJournals = journals.map((journal) => {
      const $ = cheerio.load(journal.journal);
      // Remove HTML tags while preserving plain text
      const preview = $.root().text().slice(0, 150); // Adjust slice limit as needed.
      return { ...journal, preview };
    });
    res.status(200).json({
      message: "Journal successfully send",
      formattedJournals,
    });
  } catch (err) {
    next(err);
  }
};

exports.journal_delete_post = async (req, res, next) => {
  Journal.findByIdAndDelete(req.params.entryId)
    .then(() => {
      res.status(204).end();
    })
    .catch(next);
};
