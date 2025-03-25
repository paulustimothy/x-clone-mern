import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

// next is a function that will be called when the middleware is finished
export const protectRoute = async (req,res,next) => {
    try {
        // get token from cookies
        const token = req.cookies.jwt; 
        if(!token){
            return res.status(401).json({error: "Unauthorized, no token provided"});
        }

        // verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET); 
        if(!decoded){
            return res.status(401).json({error: "Unauthorized, invalid token"});
        }

        // find user by id and select the user without password
        const user = await User.findById(decoded.userId).select("-password");
        if(!user){
            return res.status(401).json({error: "Unauthorized, user not found"});
        }

        // add user to req object
        req.user = user;
        // call next middleware
        next();
    } catch (error) {
        console.log("Error in protectRoute middleware", error.message);
        res.status(500).json({error: "Internal server error"});
    }
}

