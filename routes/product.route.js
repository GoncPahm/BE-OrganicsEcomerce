import express from "express";
import {
    fillterProducts,
    getAllProducts,
    getDetailsProduct,
    getProductsWithCategory,
    postNewComment,
    searchProducts,
} from "../controllers/product.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.get("/get_all", getAllProducts);
router.get("/fillter", fillterProducts);
router.get("/details/:id", getDetailsProduct);
router.get("/category/:category", getProductsWithCategory);
router.post("/search", searchProducts);
router.put("/post-comment/:id", verifyToken, postNewComment);
export default router;
