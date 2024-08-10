import mongoose, {Schema} from "mongoose";

const followingSchema = new Schema(
    {
      userId: {
        type: Schema.Types.ObjectId,
        ref: "Usermodel",
        required: true,
      },
      followingId: {
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
  
export const Followingmodel = mongoose.model("Following", followingSchema);