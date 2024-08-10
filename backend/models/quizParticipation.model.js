import mongoose, { Schema } from "mongoose";

const quizParticipationSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "Usermodel",
      required: true,
    },
    quizId: {
      type: Schema.Types.ObjectId,
      ref: "Quizmodel",
      required: true,
    },
    participationDate: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

export const QuizParticipationmodel = mongoose.model("QuizParticipation", quizParticipationSchema);