import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import { addProductToCart, deleteCartItem, updateCartItem } from "../controllers/cart.controller.js";
const router = express.Router();

router.post("/add_product", verifyToken, addProductToCart);
router.delete("/delete/:id_item", verifyToken, deleteCartItem);
router.put("/update/:id", verifyToken, updateCartItem);

export default router;
