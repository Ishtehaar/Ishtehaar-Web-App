import express from "express";
import { fetchLatestTrends } from "../controllers/trendsVision.controller.js";
import { verifyToken } from "../utils/verifyUser.js";


const router = express.Router();

router.post("/fetch-latest-trends", verifyToken, fetchLatestTrends);

export default router;
