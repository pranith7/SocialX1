import mongoose, { Schema } from "mongoose";

const teamMakingSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "Usermodel",
      required: true,
    },
    teamName: {
      type: String,
      required: true,
    },
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: "Usermodel",
      },
    ],
  },
  { timestamps: true }
);

export const Teammakingmodel = mongoose.model("Teammaking", teamMakingSchema);