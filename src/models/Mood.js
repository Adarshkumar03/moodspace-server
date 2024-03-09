import mongoose, { Schema } from "mongoose";

const MoodSchema = new Schema({
  rating: { 
    type: Number,
    min: 1,
    max: 5, 
    required: true 
  },
  description: String,
  notes: { 
    type: String 
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

const Mood = mongoose.model("Mood", MoodSchema);
export default Mood;
