import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import { generateKeywords, manipulateKeywords } from "../controllers/keywords.controller.js";
import { manipulateAudit } from "../controllers/websiteAudit.controller.js";

const router = express.Router();

router.post("/generate-keywords", verifyToken, generateKeywords);
router.get("/manipulate-keywords", verifyToken, manipulateKeywords);

export default router;
