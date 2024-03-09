import Mood from "../models/Mood";
import User from "../models/User"

exports.mood_post = async (req, res, next) => {
    const mood = mood.create({
        title: req.body.title,
        mood: req.body.mood,
        user: req.user._id
    }).exec().then(async (mood) => {
        const user = await User.findById(req.context.user._id);
        user.moods.push(mood._id);
        return res.status(201).json({
            message: 'Mood posted successfully',
            mood
        });
    }).catch(next);
};

exports.mood_detail = async (req, res, next) => {
        const mood = await Mood.findById(req.params.entryId).catch(next);
        return res.send(mood);
}

exports.mood_list = async (req, res, next) => {
    Mood.find().
    sort({createdAt: -1})
    .exec()
    .then((moods) => {
        res.send(moods);
    }).catch(next);
}

exports.mood_delete_post = async (req, res, next) => {
        Mood.findByIdAndDelete(req.params.entryId).then(()=>{
            res.status(204).end();
        })
        .catch(next);
}

