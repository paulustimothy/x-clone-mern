import {v2 as cloudinary} from "cloudinary";
import User from "../models/user.model.js";
import Notification from "../models/notification.model.js";
import bcrypt from "bcrypt";

export const getUserProfile = async (req, res) => {
    const {username} = req.params;
    
    try {
        // get user profile data from username without showing their password
        const user = await User.findOne({username}).select("-password");
        if(!user) return res.status(404).json({error: "User not found"});

        res.status(200).json({user}); // send user profile data

    } catch (error) {
        console.log("Error in getUserProfile controller", error.message);
        res.status(500).json({error: error.message});
    }
}

export const followUnfollowUser = async (req, res) => {
    try {
        const {id} = req.params; // id of user to follow/unfollow, req.params is from url
        const userToModify = await User.findById(id);
        const currentUser = await User.findById(req.user._id); // req.user._id to get user id from token

        if(id === req.user._id.toString()){
            return res.status(400).json({error: "You cannot follow/unfollow yourself"});
        }

        if(!userToModify || !currentUser) return res.status(404).json({error: "User not found"});

        // check if current user is following the user to modify
        const isFollowing = currentUser.following.includes(id); 

        if(isFollowing){
            // unfollow user 
            // $pull is used to remove the user id from the followers array
            await User.findByIdAndUpdate(id, {$pull: {followers: req.user._id}}); 
            // remove current user from the following array
            await User.findByIdAndUpdate(req.user._id, {$pull: {following: id}});
            res.status(200).json({message: "Unfollowed user successfully"});
        } else {
            //follow user
            // $push is used to add the user id to the followers array
            await User.findByIdAndUpdate(id, {$push: {followers: req.user._id}});
            // add current user to the following array
            await User.findByIdAndUpdate(req.user._id, {$push: {following: id}});
            // notification
            const newNotification = new Notification({
                type: "follow",
                from: req.user._id,
                to: id,
            })
            await newNotification.save();

            res.status(200).json({message: "Followed user successfully"});
        }   
    } catch (error) {
        console.log("Error in followUnfollowUser controller", error.message);
        res.status(500).json({error: error.message});
    }
}

export const getSuggestedUsers = async (req, res) => {
    try {
        const userId = req.user._id;
        // get users followed by the current user
        const usersFollowedByMe = await User.findById(userId).select("following"); 
        // get all users except the current user and random 10 users
        const users = await User.aggregate([
            {
                $match: {
                    _id: {$ne: userId}, //$ne is used to exclude the current user
                },
            },
            { $sample: {size: 10}}, // $sample is used to get random 10 users
        ]);

        // filter out users that are already followed by the current user
        const filteredUsers = users.filter((user) => !usersFollowedByMe.following.includes(user._id));
        // get first 4 users
        const suggestedUsers = filteredUsers.slice(0, 4);

        // remove password from the users for security
        suggestedUsers.forEach((user) => (user.password = null));

        res.status(200).json({users: suggestedUsers});

    } catch (error) {
        console.log("Error in getSuggestedUsers controller", error.message);
        res.status(500).json({error: error.message});
    }
}

export const updateUser = async (req, res) => {
    const {username, fullname, email, currentPassword, newPassword, bio, link} = req.body;
    let {profilePicture, coverPicture} = req.body;
    
    // get user id from token
    const userId = req.user._id;

    try {
        let user = await User.findById(userId);
        if(!user) return res.status(404).json({error: "User not found"});

        if((!currentPassword && newPassword) || (currentPassword && !newPassword)){
            return res.status(400).json({error: "Current password or new password is required"});
        }

        if(currentPassword && newPassword){
            // check if current password is correct
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if(!isMatch) return res.status(400).json({error: "Current password is incorrect"});

            // check if new password is at least 6 characters long
            if(newPassword.length < 6) {
                return res.status(400).json({error: "New password must be at least 6 characters long"});
            }

            // hash new password
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(newPassword, salt);
        }

        if(profilePicture){
            // check if user has a profile picture
            if(user.profilePicture){
                // destroy the old profile picture
                await cloudinary.uploader.destroy(user.profilePicture.split("/").pop().split(".")[0]);
            }

            // upload new profile picture
            const uploadResponse = await cloudinary.uploader.upload(profilePicture)
            profilePicture = uploadResponse.secure_url;
        }

        if(coverPicture){
            // check if user has a cover picture
            if(user.coverPicture){
                // destroy the old cover picture
                await cloudinary.uploader.destroy(user.coverPicture.split("/").pop().split(".")[0]);
            }

            // upload new cover picture 
            const uploadResponse = await cloudinary.uploader.upload(coverPicture)
            coverPicture = uploadResponse.secure_url;
        }

        // update user profile data
        user.fullname = fullname || user.fullname;
        user.username = username || user.username;
        user.email = email || user.email;
        user.bio = bio || user.bio;
        user.link = link || user.link;
        user.profilePicture = profilePicture || user.profilePicture;
        user.coverPicture = coverPicture || user.coverPicture;

        // save user profile data and remove password from the response
        user = await user.save();
        user.password = null;
        return res.status(200).json(user);

    } catch (error) {
        console.log("Error in updateUser controller", error.message);
        res.status(500).json({error: error.message});
    }
}
