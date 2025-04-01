import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import {v2 as cloudinary} from "cloudinary";
import path from "path";

import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import postRoutes from "./routes/post.routes.js";
import notificationRoutes from "./routes/notification.routes.js";

import connectMongoDb from "./db/connectMongoDb.js";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const port = process.env.PORT || 5000;
const app = express();
const __dirname = path.resolve();

app.use(express.json({limit: "5mb"})); // to parsing req.body, limit shouldnt be too large to prevent DOS attack
app.use(express.urlencoded({extended: true})); // to parsing form data
app.use(cookieParser()); // to parse cookies

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/notifications", notificationRoutes);

// Serve frontend
if(process.env.NODE_ENV === "production"){
  app.use(express.static(path.join(__dirname, "/frontend/dist")));

  app.get("*", (req,res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  })
}

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  connectMongoDb();
});
