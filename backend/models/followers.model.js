import mongoose, { Schema } from "mongoose";

// Define Followers Schema
const followersSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "Usermodel",
      required: true,
    },
    followerId: {
      type: Schema.Types.ObjectId,
      ref: "Usermodel",
      required: true,
    },
    followedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export const Followersmodel = mongoose.model("Followers", followersSchema);
