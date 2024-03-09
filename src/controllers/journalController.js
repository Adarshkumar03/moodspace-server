import Journal from "../models/Journal";
import User from "../models/User";

exports.journal_post = async (req, res, next) => {
    const journal = Journal.create({
        title: req.body.title,
        journal: req.body.journal,
        user: req.user._id
    }).exec()
    .then(async (journal) => {
        const user = await User.findById(req.context.user._id);
        user.journals.push(journal._id);
        return res.status(201).json({
            message: 'Journal posted successfully'
        });
    }).catch(next);
    return res.send(journal);
};

exports.journal_detail = async (req, res, next) => {
        const journal = await Journal.findById(req.params.entryId).catch(next);
        return res.send(journal);
}

exports.journal_list = async (req, res, next) => {
    Journal.find().
    sort({createdAt: -1})
    .exec()
    .then((journals) => {
        res.send(journals);
    }).catch(next);
}

exports.journal_delete_post = async (req, res, next) => {
        Journal.findByIdAndDelete(req.params.entryId).then(()=>{
            res.status(204).end();
        })
        .catch(next);
}

