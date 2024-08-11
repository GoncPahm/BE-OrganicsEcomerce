import express from "express";
import { sign_up, sign_in, google, sign_out } from "../controllers/auth.controller.js"; 
const router = express.Router();

router.post('/signup', sign_up);
router.post('/signin', sign_in);
router.post('/google', google);
router.get('/signout', sign_out);

export default router;