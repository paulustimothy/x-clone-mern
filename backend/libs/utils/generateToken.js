import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = (userId, res) => {
    const token = jwt.sign({userId}, process.env.JWT_SECRET, {
        expiresIn: "15d", // 15 days for cookie
    })

    res.cookie("jwt", token, {
        maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days for cookie in milliseconds
        httpOnly: true, // prevent client side js from accessing the cookie
        sameSite: "strict", // prevent csrf attacks
        secure: process.env.NODE_ENV !== "development", // only send the cookie in https if in production
    })
}

