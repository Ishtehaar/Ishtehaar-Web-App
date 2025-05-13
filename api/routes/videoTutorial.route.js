import express from "express";
import { createVideoTutorial, getVideoTutorials } from "../controllers/videoTutorial.controller.js";



const router = express.Router();

router.get("/get-video-tutorials", getVideoTutorials);
router.post("/create-video-tutorial", createVideoTutorial);



export default router;
