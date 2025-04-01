import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import {v2 as cloudinary} from "cloudinary";
import Notification from "../models/notification.model.js";

export const createPost = async (req, res) => {
    try {
        const {text} = req.body
        let {img} = req.body;
        const userId = req.user._id;

        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({error: "User not found"});
        }
        if(!text && !img){
            return res.status(400).json({error: "Text or Image is required"});
        }

        if(img){
            const uploadedResponse = await cloudinary.uploader.upload(img);
            img = uploadedResponse.secure_url;
        }

        const newPost = new Post({
            user: userId,
            text,
            img
        })

        await newPost.save();
        return res.status(201).json(newPost);
        
    } catch (error) {
        console.log("Error in createPost controller", error.message);
        return res.status(500).json({error: "Internal server error"});
    }
}   

export const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if(!post){
            return res.status(404).json({error: "Post not found"});
        }

        // check if the post is owned by the user
        if(post.user.toString() !== req.user._id.toString()){
            return res.status(403).json({error: "Unauthorized to delete this post"});
        }

        if(post.img){
            const imgId = post.img.split("/").pop().split(".")[0];
            await cloudinary.uploader.destroy(imgId);
        }

        await Post.findByIdAndDelete(req.params.id);
        return res.status(200).json({message: "Post deleted successfully"});

    } catch (error) {
        console.log("Error in deletePost controller", error.message);
        return res.status(500).json({error: "Internal server error"});
    }
}

export const addComment = async (req, res) => {
    try {
        const {text} = req.body;
        const postId = req.params.id;
        const userId = req.user._id;

        if(!text){
            return res.status(400).json({error: "Comment text is required"});
        }
        const post = await Post.findById(postId);

        if(!post){
            return res.status(404).json({error: "Post not found"});
        }

        // check if the user is the owner of the post
        const comment = {user: userId, text};

        // add the comment to the post
        post.comments.push(comment);
        await post.save();
        const updatedComments = post.comments.filter(id => id.toString() !== userId.toString());
        return res.status(200).json(updatedComments);

    } catch (error) {
        console.log("Error in addComment controller", error.message);
        return res.status(500).json({error: "Internal server error"});
    }
}

export const likeUnlikePost = async (req, res) => {
    try {
        const userId = req.user._id;
        const {id: postId} = req.params;

        const post = await Post.findById(postId);

        if(!post){
            return res.status(404).json({error: "Post not found"});
        }

        // check if the user has already liked the post
        const userLikePost = post.likes.includes(userId);

        if(userLikePost){
            //unlike post
            // remove the user id from the likes array
            await Post.updateOne({_id: postId}, {$pull: {likes: userId}});
            await User.updateOne({_id: userId}, {$pull: {likedPosts: postId}});

            const updatedLikes = post.likes.filter(id => id.toString() !== userId.toString());
            res.status(200).json(updatedLikes);
        } else {
            //like post
            // add the user id to the likes array
            post.likes.push(userId);
            await User.updateOne({_id: userId}, {$push: {likedPosts: postId}});
            await post.save();

            // create a notification
            const notification = new Notification({
                from: userId,
                to: post.user,
                type: "like",
            })
            await notification.save();

            const updatedLikes = post.likes;
            res.status(200).json(updatedLikes);
        }
    } catch (error) {
        console.log("Error in likeUnlikePost controller", error.message);
        return res.status(500).json({error: "Internal server error"});
    }
}

export const getAllPosts = async (req, res) => {
    try {
        //get all posts from the database sorted by createdAt in descending order and populate the user field
        const posts = await Post.find().sort({createdAt: -1}).populate({
            path: "user",
            select: "-password"
        })
        .populate({
            path: "comments.user",
            select: "-password"
        });

        //if there are no posts, return an empty array
        if(posts.length === 0){
            return res.status(200).json([]);
        }

        res.status(200).json(posts);

    } catch (error) {
        console.log("Error in getAllPosts controller", error.message);
        return res.status(500).json({error: "Internal server error"});
    }
}

export const getLikedPosts = async (req, res) => {
    const userId = req.params.id;
    
    try {
        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({error: "User not found"});
        }

        //get all posts that the user has liked
        const likedPosts = await Post.find({_id: {$in: user.likedPosts}})
        .populate({
            path: "user",
            select: "-password"
        })
        .populate({
            path: "comments.user",
            select: "-password"
        });
        
        res.status(200).json(likedPosts);

    } catch (error) {
        console.log("Error in getLikedPosts controller", error.message);
        return res.status(500).json({error: "Internal server error"});
    }
}

export const getFollowingPosts = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);

        if(!user) return res.status(404).json({error: "User not found"});

        const following = user.following;

        // get all posts from the users that the user is following
        // $in is used to get all posts from the users that are in the following array
        const feedPosts = await Post.find({user: {$in: following}})
        .sort({createdAt: -1})
        .populate({
            path: "user",
            select: "-password"
        })
        .populate({
            path: "comments.user",
            select: "-password"
        });
        
        res.status(200).json(feedPosts);

    } catch (error) {
        console.log("Error in getFollowingPosts controller", error.message);
        return res.status(500).json({error: "Internal server error"});
    }
}

export const getUserPosts = async (req, res) => {
    try {
        // get the username from the params
        const {username} = req.params;
        const user = await User.findOne({username});

        if(!user) return res.status(404).json({error: "User not found"});

        const posts = await Post.find({user: user._id})
        .sort({createdAt: -1})
        .populate({
            path: "user",
            select: "-password"
        })
        .populate({
            path: "comments.user",
            select: "-password"
        });

        res.status(200).json(posts);
        
    } catch (error) {
        console.log("Error in getUserPosts controller", error.message);
        return res.status(500).json({error: "Internal server error"});
    }
}

export const getUserPostCount = async (req, res) => {
    try {
        const {username} = req.params;
        const user = await User.findOne({username});

        if(!user) return res.status(404).json({error: "User not found"});

        const postCount = await Post.countDocuments({user: user._id});
        
        res.status(200).json({ postCount });
        
    } catch (error) {
        console.log("Error in getUserPostCount controller", error.message);
        return res.status(500).json({error: "Internal server error"});
    }
}