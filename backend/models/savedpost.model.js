import mongoose, {Schema} from "mongoose";

const savedPostSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            require: true,
            ref: "Usermodel",
        },
        post: {
            type: Schema.Types.ObjectId,
            require: true,
            ref: "Postmodel"
        },
    },
    { timestamps: true}
)

export const savedPostmodel = mongoose.model("savedPost", savedPostSchema)
