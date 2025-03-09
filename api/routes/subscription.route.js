import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import {  createSubscription, deleteSubscription, getSubscription, getSubscriptions, updateSubscription } from "../controllers/subscription.controller.js";

const router = express.Router();

router.post("/create-subscription", verifyToken, createSubscription); 
router.get("/get-subscriptions", verifyToken, getSubscriptions); 
router.get("/get-subscription/:subscriptionId", verifyToken, getSubscription); 
router.put("/update-subscription/:subscriptionId", verifyToken, updateSubscription); 
router.delete("/delete-subscription/:subscriptionId", verifyToken, deleteSubscription); 
export default router;
