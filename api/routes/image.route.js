import express from 'express';
import { generateImage } from "../controllers/image.controller.js"
const router = express.Router();

router.post("/generate-image", generateImage)


export default router; 