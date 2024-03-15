import Journal from "../models/Journal";
import User from "../models/User";

exports.journal_post = async (req, res, next) => {
    console.log("Incoming request to /api/journal");
  try {
    console.log("Incoming journal:", req.body.journal);
    console.log("User ID:", req.user._id);

    const journal = await Journal.create({
      title: req.body.title,
      journal: req.body.content,
      user: req.user._id,
    });
    console.log("Created Journal:", journal);

    await User.findByIdAndUpdate(req.user._id, { $push: { journals: journal._id } })
             .then(() => { 
                 console.log("User updated");
                 res.status(201).json({
                     message: "Journal posted successfully",
                     journal
                 });
             });
  } catch (error) {
    console.error("Error in journal_post:", error);
    next(); // Pass the error to the error-handling middleware
  }
};

exports.journals_monthly = async (req, res, next) => {
    let year = req.params.year;
    let userId = req.user._id;
    if (!year || isNaN(year) || parseInt(year) < 2000) {
        year = new Date().getFullYear();
    }
    const pipeline = [
        { $match: { _id: mongoose.Types.ObjectId(userId) } }, 
        { $unwind: "$journals" }, // Deconstruct the journals array
        {
          $match: { // Optional filter for specific year 
            'journals.createdAt': { 
              $gte: new Date(`${year}-01-01`),
              $lt: new Date(`${year + 1}-01-01`)
            }
          }
        },
        {
          $group: {
            _id: { month: { $month: "$journals.createdAt" } },
            journals: { $push: "$journals" }
          }
        }
      ];
    try {
        const results = await Mood.aggregate(pipeline);
        return res.send(results);
      } catch (err) {
        res.status(500).send(err);
      }  
}

exports.journals_weekly = async (req, res, next) => {
    let year = req.params.year;
    let userId = req.user._id;
    if (!year || isNaN(year) || parseInt(year) < 2000) {
        year = new Date().getFullYear();
    }
    const pipeline = [
        { $match: { _id: mongoose.Types.ObjectId(userId) } }, 
        { $unwind: "$journals" }, // Deconstruct the journals array
        {
          $match: { // Optional filter for specific year 
            'journals.createdAt': { 
              $gte: new Date(`${year}-01-01`),
              $lt: new Date(`${year + 1}-01-01`)
            }
          }
        },
      {
        $group: {
          _id: { 
            year: { $year: "$createdAt" }, 
            week: { $let: { 
              vars: { weekParts: { $arrayElemAt: [ "$createdAt", getWeekNumber ] } },
              in: { $arrayElemAt: [ "$$weekParts", 1 ] }
            }}
          }, 
          journals: { $push: "$$ROOT" }
        }
      },
      {
        $project: {
          year: "$_id.year",
          week: "$_id.week", 
          journals: 1,
          _id: 0 
        }
      }
    ];
    try {
       let results = User.aggregate(pipeline);
        res.send(results);
    } catch (err) { 
        next();
    }
}

exports.journal_detail = async (req, res, next) => {
        const journal = await Journal.findById(req.params.entryId).catch(next);
        return res.send(journal);
}

exports.journal_list = async (req, res, next) => {
    res.send(req.user.journals);
}

exports.journal_delete_post = async (req, res, next) => {
        Journal.findByIdAndDelete(req.params.entryId).then(()=>{
            res.status(204).end();
        })
        .catch(next);
}

