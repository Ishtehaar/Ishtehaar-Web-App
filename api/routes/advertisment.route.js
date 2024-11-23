import express from "express";
import { createAd } from "../controllers/advertisment.controller.js";

const router = express.Router();

router.post("/create-ad", createAd);

export default router;
