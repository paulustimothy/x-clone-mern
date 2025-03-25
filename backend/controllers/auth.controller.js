import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import { generateTokenAndSetCookie } from "../libs/utils/generateToken.js";

export const register = async (req,res) => {
    try {
        const {username, fullname, email, password} = req.body;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // regex to check if email is valid
        if(!emailRegex.test(email)){
            return res.status(400).json({ error: "Invalid email address" });
        }

        const existingUser = await User.findOne({username});
        if(existingUser){
            return res.status(400).json({ error: "Username already exists" });
        }

        const existingEmail = await User.findOne({email});
        if(existingEmail){
            return res.status(400).json({ error: "Email already exists" });
        }

        if(password.length < 6){
            return res.status(400).json({error: "Password must be at least 6 characters long"})
        }

        // hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullname,
            username,
            email,
            password:hashedPassword,
        })

        if(newUser){
            generateTokenAndSetCookie(newUser._id, res)
            await newUser.save();

            res.status(201).json({
                _id: newUser._id,
                fullname: newUser.fullname,
                username: newUser.username,
                email: newUser.email,
                followers: newUser.followers,
                following: newUser.following,
                profilePicture: newUser.profilePicture,
                coverPicture: newUser.coverPicture,                
            })
        } else{
            res.status(400).json({error: "Failed to create user"})
        }

    } catch (error) {
        console.log("Error in register controller", error.message)
        res.status(500).json({error: "Internal server error"})
    }
}
export const login = async (req,res) => {
    try {
        const { username, email, password } = req.body;
        
        // Find user by email or username
        const user = await User.findOne({
            $or: [
                { email },
                { username }
            ]
        });

        //if user is not found, compare with empty string
        const isPasswordCorrect = await bcrypt.compare(password, user?.password || ""); 

        if(!user || !isPasswordCorrect){
            return res.status(401).json({error: "Invalid email or password"})
        }

        generateTokenAndSetCookie(user._id, res);

        res.status(200).json({
            _id: user._id,
            fullname: user.fullname,
            username: user.username,
            email: user.email,
            followers: user.followers,
            following: user.following,
            profilePicture: user.profilePicture,
            coverPicture: user.coverPicture,    
        });

    } catch (error) {
        console.log("Error in register controller", error.message)
        res.status(500).json({error: "Internal server error"})
    }
}
export const logout = async (req,res) => {
    try {
        res.cookie("jwt", "", {maxAge: 0}); // "" is to clear the cookie
        res.status(200).json({
            message: "Logout Success",
        })
    } catch (error) {
        console.log("Error in logout controller", error.message)
        res.status(500).json({error: "Internal server error"})
    }
}
export const authCheck = async (req,res) => {
    try {
        // find user by id and select the user without password
        const user = await User.findById(req.user._id).select("-password");
        res.status(200).json({user})
    } catch (error) {
        console.log("Error in authCheck controller", error.message)
        res.status(500).json({error: "Internal server error"})
    }
}
