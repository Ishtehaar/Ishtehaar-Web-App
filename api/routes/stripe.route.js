import express from "express";

import { createCheckoutSession, webHook } from "../controllers/stripe.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

// router.post("/webhook", express.raw({type: "application/json"}), webHook);
router.post("/create-checkout-session", verifyToken, createCheckoutSession);


export default router;
