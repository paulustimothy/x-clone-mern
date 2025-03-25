import express from "express";
import authRoutes from "./routes/auth.routes.js";
import connectMongoDb from "./db/connectMongoDb.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
dotenv.config();

const port = process.env.PORT || 5000;

const app = express();

app.use(express.json()); // to parsing req.body
app.use(express.urlencoded({extended: true})); // to parsing form data
app.use(cookieParser()); // to parse cookies

app.use("/api/auth", authRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  connectMongoDb();
});
