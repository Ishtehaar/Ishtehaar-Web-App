import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import { getSurveyById, getSurveys, submitSurvey } from "../controllers/survey.controller.js";

const router = express.Router();

router.get("/get-surveys", verifyToken, getSurveys);
router.get("/get-survey/:id", verifyToken, getSurveyById);
router.post("/submit-survey/:id", verifyToken, submitSurvey);


export default router;
