import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import {  websiteAudit } from "../controllers/websiteAudit.controller.js";
const router = express.Router();

router.post("/website-audit", verifyToken, websiteAudit);
// router.get("/download/:filename", downloadAuditReport);

export default router;
