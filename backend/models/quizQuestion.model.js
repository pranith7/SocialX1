import mongoose, { Schema } from "mongoose";

const quizQuestionSchema = new Schema(
  {
    quizId: {
      type: Schema.Types.ObjectId,
      ref: "Quizmodel",
      required: true,
    },
    questionText: {
      type: String,
      required: true,
    },
    options: [
      {
        type: String,
        required: true,
      },
    ],
    correctAnswer: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const QuizQuestionmodel = mongoose.model("QuizQuestion", quizQuestionSchema);