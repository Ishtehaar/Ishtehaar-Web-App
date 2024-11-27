import express from "express";
import { generateContent, uploadAd } from "../controllers/advertisment.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/generate-content", verifyToken, generateContent);
router.post("/upload-ad", verifyToken, uploadAd); //to upload on cloudinary and then saving in DB

export default router;
