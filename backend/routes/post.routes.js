import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { createPost, deletePost, addComment, likeUnlikePost, getAllPosts, getLikedPosts, getFollowingPosts, getUserPosts, getUserPostCount } from "../controllers/post.controller.js";

const router = express.Router();

router.get("/all", protectRoute, getAllPosts);
router.get("/likes/:id", protectRoute, getLikedPosts);
router.get("/following", protectRoute, getFollowingPosts);
router.get("/user/:username", protectRoute, getUserPosts);
router.get("/count/:username", getUserPostCount);

router.post("/create", protectRoute, createPost);
router.post("/like/:id", protectRoute, likeUnlikePost);
router.post("/comment/:id", protectRoute, addComment);

router.delete("/:id", protectRoute, deletePost);

export default router;
