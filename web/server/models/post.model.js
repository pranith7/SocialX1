import mongoose,{Schema} from "mongoose";

const replySchema = new Schema(
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: "Usermodel",
      },
      content: {
        type: String,
        required: true,
      },
      likes: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Usermodel",
        },
      ],
    },
    { timestamps: true }
  );
  
  const commentSchema = new Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            require: true,
            ref: "Usermodel",
        },
        content: {
            type: String,
            required: true,
        },
        edited : {
            type: Boolean,
            default: false
        },
        likes: [
            {
                type: Schema.Types.ObjectId,
                ref: "Usermodel",
            }
        ],
        replies: [replySchema],
    },
    { timestamps: true }
  );


const postSchema = new Schema(
    {   
        user: {
            type: Schema.Types.ObjectId,
            require: true,
            ref: "Usermodel",
        },
        content:{
            type: String,
            required: true,
        },
        likes: [
            {
                type: Schema.Types.ObjectId,
                ref: "Usermodel",
            }
        ],
        comments: [commentSchema],
    },
    { timestamps: true}
);

export const Postmodel = mongoose.model("Post",postSchema);
