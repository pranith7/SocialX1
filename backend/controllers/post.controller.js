import { Postmodel as Post } from "../models/post.model.js";
import { Usermodel as User } from "../models/user.model.js";
import { asyncHandler } from "./../utils/asyncHandler.js";
import { ApiError } from "./../utils/ApiError.js";
import { ApiResponse } from "./../utils/ApiResponse.js";

const createPost = asyncHandler(async (req, res) => {
    const { title, content } = req.body;
    console.log(`title: ${title}, content: ${content}`);
    try {
        const user = await User.findById(req.user._id).select("-password");
        console.log(`user: ${user}`);
        const newPost = new Post({
            owner: user._id,
            title: title,
            content: content,
        });

        await newPost.save();
        console.log(`Post Created`);
        return res.status(201).json(new ApiResponse(201, newPost, "Post created successfully"));
    } catch (error) {
        throw new ApiError(error.statusCode || 500, error.message || "Internal Server Error");
    }
});

const getUserPosts = asyncHandler(async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");
        if (!user) {
            throw new ApiError(404, "User not found");
        }
        const posts = await Post.find({ owner: user._id }).select("id title content");;
        return res.status(200).json(new ApiResponse(200, posts, "User posts retrieved successfully"));
    } catch (error) {
        throw new ApiError(error.statusCode || 500, error.message || "Internal Server Error");
    }
});

const updatePost = asyncHandler(async (req, res) => {
    const { postId } = req.params;
    const { title, content } = req.body;
    console.log(`title: ${title}, content: ${content} postId: ${postId}`);

    try {
        const post = await Post.findById(postId); // Added await
        if (!post) {
            throw new ApiError(404, "Post not found");
        }
        if (post.owner.toString() !== req.user._id.toString()) {
            throw new ApiError(403, "You are not authorized to update this post");
        }
        post.title = title || post.title;
        post.content = content || post.content;
        await post.save();

        return res.status(200).json(new ApiResponse(200, post, "Post updated successfully"));
    } catch (error) {
        throw new ApiError(error.statusCode || 500, error.message || "Internal Server Error");
    }
});

const deletePost = asyncHandler(async (req, res) => {
    const { postId } = req.params; // Changed to postId

    try {
        const post = await Post.findById(postId); // Added await
        if (!post) {
            throw new ApiError(404, "Post not found");
        }
        if (post.owner.toString() !== req.user._id.toString()) {
            throw new ApiError(403, "You are not authorized to delete this post");
        }
        await post.deleteOne();
        return res.status(200).json(new ApiResponse(200, null, "Post deleted successfully")); // Fixed typo
    } catch (error) {
        throw new ApiError(error.statusCode || 500, error.message || "Internal Server Error");
    }
});

export {
    createPost,
    getUserPosts,
    updatePost,
    deletePost
};