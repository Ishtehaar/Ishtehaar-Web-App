import express from "express";
import { generateContent, uploadAd, getAds, getAd, getEditAd, updateAd, deleteAd, generateCaption, updateAdforCaption } from "../controllers/advertisment.controller.js";
import { verifyToken } from "../utils/verifyUser.js";
import { checkAdLimits } from "../utils/checkAdLimits.js";

const router = express.Router();

router.post("/generate-content", verifyToken, checkAdLimits, generateContent);
router.post("/generate-caption", verifyToken, generateCaption);
router.post("/upload-ad", verifyToken, uploadAd); //to upload on cloudinary and then saving in DB
router.get("/getAds", verifyToken, getAds); // route to fetch all saved advertisements for the signed-in user
router.get("/getAd/:adSlug", verifyToken, getAd); // route to fetch a single advertisement for viewing purposes
router.get("/getEditAd/:adId", verifyToken, getEditAd); // route to fetch a single advertisement for editing purposes
router.post("/update-ad/:adId", verifyToken, updateAd); // route to update a advertisement
router.post("/update-ad-for-caption/:adId", verifyToken, updateAdforCaption); // route to update a advertisement

router.delete("/delete-ad/:adId", verifyToken, deleteAd); // route to delete a advertisement

export default router;
