import express from "express";
import { register, login, logout, authCheck } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";
const router = express.Router();

router.get("/me", protectRoute, authCheck)
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

export default router;
