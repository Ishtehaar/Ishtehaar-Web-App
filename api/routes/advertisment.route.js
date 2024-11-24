import express from "express";
import { createAd, uploadAd } from "../controllers/advertisment.controller.js";

const router = express.Router();

router.post("/create-ad", createAd);
router.post("/upload-ad", uploadAd);

export default router;
