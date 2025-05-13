import express from "express";
import { createTutorial, getTutorials } from "../controllers/tutorial.controller.js";



const router = express.Router();

router.get("/get-tutorials", getTutorials);
router.post("/create-tutorial", createTutorial);



export default router;
