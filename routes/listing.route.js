import express from "express";
import { createNewListing, updateListing, deleteListing } from "../controllers/listing.controller.js";
import { verifyToken } from "../utils/verifyUser.js";
const router = express.Router();

router.post("/create", verifyToken, createNewListing);
router.put("/update/:id", verifyToken, updateListing);
router.delete("/delete/:id", verifyToken, deleteListing);
export default router;
