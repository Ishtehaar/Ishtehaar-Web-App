import express from "express";
import { generateContent, uploadAd, getAds, getAd } from "../controllers/advertisment.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/generate-content", verifyToken, generateContent);
router.post("/upload-ad", verifyToken, uploadAd); //to upload on cloudinary and then saving in DB
router.get("/getAds", verifyToken, getAds); // route to fetch all saved advertisements for the signed-in user
router.get("/getAd/:adSlug", verifyToken, getAd); // route to fetch a single advertisement

export default router;
