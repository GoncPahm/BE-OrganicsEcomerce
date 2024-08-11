import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import { captureOrderPaypal, purchaseNewOrder, purchaseOrderByPaypal } from "../controllers/order.controller.js";
const router = express.Router();

router.post("/purchase-by-cash", verifyToken, purchaseNewOrder);
router.post("/purchase-by-paypal", verifyToken, purchaseOrderByPaypal);
router.post("/capture-order-paypal", verifyToken, captureOrderPaypal);
export default router;
