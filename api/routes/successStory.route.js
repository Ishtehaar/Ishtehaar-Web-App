import express from "express";
import { createSuccessStory, getSuccessStories } from "../controllers/successStory.controller.js";


const router = express.Router();

router.get("/get-success-stories", getSuccessStories);
router.post("/create-success-story", createSuccessStory);



export default router;
