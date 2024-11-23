import express from 'express';
import { generateContent } from "../controllers/openai.controller.js"
const router = express.Router();

router.post("/generate-content", generateContent);


export default router; 