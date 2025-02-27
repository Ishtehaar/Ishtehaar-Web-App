import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import { generateKeywords } from "../controllers/keywords.controller.js";

const router = express.Router();

router.post("/generate-keywords", verifyToken, generateKeywords);

export default router;
