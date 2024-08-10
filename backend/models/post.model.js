import mongoose, { Schema } from "mongoose";

// Define commentSchema first
const commentSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
    replies: [
      {
        type: Schema.Types.ObjectId,
        ref: "Reply",
      },
    ],
    edited: {
      type: Boolean,
      default: false,
    },
    image: {
      type: String,
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "Usermodel",
      },
    ],
    owner: {
      type: Schema.Types.ObjectId,
      ref: "Usermodel",
    },
  },
  { timestamps: true }
);

// Define replySchema
const replySchema = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "Usermodel",
      },
    ],
    owner: {
      type: Schema.Types.ObjectId,
      ref: "Usermodel",
    },
  },
  { timestamps: true }
);

// Define postSchema
const postSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    document: {
      type: String,
    },
    image: {
      type: String,
    },
    video: {
      type: String,
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "Usermodel",
      },
    ],
    owner: {
      type: Schema.Types.ObjectId,
      ref: "Usermodel",
    },
    comments: [commentSchema],
  },
  { timestamps: true }
);

// Export models
export const Postmodel = mongoose.model("Post", postSchema);
export const Commentmodel = mongoose.model("Comment", commentSchema);
export const Replymodel = mongoose.model("Reply", replySchema);