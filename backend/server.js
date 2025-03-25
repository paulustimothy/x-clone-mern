import express from "express";
import authRoutes from "./routes/auth.routes.js";
import connectMongoDb from "./db/connectMongoDb.js";
import dotenv from "dotenv";

dotenv.config();

const port = process.env.PORT || 5000;

const app = express();

app.use("/api/auth", authRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  connectMongoDb();
});
