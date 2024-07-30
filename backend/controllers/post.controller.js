import mongoose, { isValidObjectId } from "mongoose";
import { Postmodel as Post} from "../models/post.model";
import { Usermodel as User } from "../models/user.model.js";
import { asyncHandler } from "./../utils/asyncHandler.js";
import { ApiError } from "./../utils/ApiError.js";
import { ApiResponse } from "./../utils/ApiResponse.js";

const createPost = asyncHandler( async( req, res) => {
    const { title, content} = req.body;
    try{
        const user = await User.findById(req.id).select("-password")
        const newPost = new Post({
            user: user._id,
            title: title,
            content: content,
        })
    }catch(error){
        throw new ApiError(error.statusCode || 500, error.message || "Internal Server Error");
    }
})

const getUserPosts = asyncHandler( async(req, res) => {
    try{
        
    }catch(error){
        throw new ApiError(error.statusCode || 500, error.message || "Internal Server Error");
    }
})

const updatePost = asyncHandler( async(req, res) => {
    try{
        
    }catch(error){
        throw new ApiError(error.statusCode || 500, error.message || "Internal Server Error");
    }
})

const deletePost = asyncHandler( async(req, res) => {
    const { params: { postId } } = req;
    try{
        const currentPost = await Post.findById({ _id: postId });
        const savedPost = await SavedPost.findOne({ post: postId });

        if(!currentPost){
            throw new ApiError(401, "Cannot found post"); 
        }
        if(req.id !== currentPost.user._id.toString()){
            throw new ApiError(403, "You are not Authorized to delete this post");
        }
        await Post.deleteOne({ _id: postId });
        if(savedPost) await savedPost.deleteOne({ _id: savedPost._id });

        return res.status(201).json(new ApiResponse(201, null, "Post deleted successfully"));

    }catch(error){
        throw new ApiError(error.statusCode || 500, error.message || "Internal Server Error");
    }
})  