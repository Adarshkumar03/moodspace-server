import mongoose, { Schema } from "mongoose";

const MoodSchema = new Schema(
  {
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    smfqScore: {
      type: Number,
      min: 0,
      max: 26,
      required: true,
    },
    description: String,
    notes: {
      type: String,
    },
    month: {
      type: Number,
      min: 1,
      max: 12,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

MoodSchema.pre("save", function (next) {
  const mood = this;
  mood.month = mood.createdAt.getMonth() + 1; // Months are 0-indexed in JS Date
  next();
});

const Mood = mongoose.model("Mood", MoodSchema);
export default Mood;
