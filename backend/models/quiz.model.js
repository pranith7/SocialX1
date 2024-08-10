import mongoose, { Schema } from "mongoose";

const quizSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    entryFee: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export const Quizmodel = mongoose.model("Quiz", quizSchema);