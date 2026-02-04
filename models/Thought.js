import mongoose, { Schema } from "mongoose";

const ThoughtSchema = new Schema({
  message: {
    type: String,
    required: [true, "A Message is required"],
    minlength: [5, "A Message must be at least 5 characters"],
    maxlength: [140, "A Message cannot exceed 140 characters"],
    trim: true,
  },
  hearts: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Thought = mongoose.model("Thought", ThoughtSchema);

export default Thought;
