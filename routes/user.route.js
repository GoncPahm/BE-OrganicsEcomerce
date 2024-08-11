import express from "express";
import { getOrderHistory, getProfile, updateUserProfile } from "../controllers/user.controller.js"; 
import { verifyToken } from "../utils/verifyUser.js";
const router = express.Router();

router.post('/update/:id', verifyToken, updateUserProfile);
router.get("/get-profile", verifyToken, getProfile);
router.get("/get-history", verifyToken, getOrderHistory);
export default router;