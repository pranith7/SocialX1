import { Router } from "express";
import { createPost, getUserPosts, deletePost, updatePost } from "../controllers/post.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/").post(verifyJWT, createPost);
router.route("/").get(verifyJWT, getUserPosts);
router.route("/:postId").patch(verifyJWT, updatePost); // Changed to postId
router.route("/:postId").delete(verifyJWT, deletePost); // Changed to postId

export default router;