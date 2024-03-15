import mongoose, { Schema } from "mongoose";

const JournalSchema = new Schema({
    title: {
        type: String, 
    },
    journal: {
        type: String, 
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

const Journal = mongoose.model('Journal', JournalSchema);
module.exports = Journal;