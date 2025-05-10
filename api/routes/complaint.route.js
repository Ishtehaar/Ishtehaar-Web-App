import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import { registerComplaint, getComplaints, getComplaintsByStatus, getUserComplaints, getComplaintById, updateComplaintStatus, resolveComplaint, getComplaintStats, getComplaintsByUserId } from "../controllers/complaint.controller.js";
const router = express.Router();

router.post("/register-complaint", verifyToken, registerComplaint);
router.get("/get-complaints", verifyToken, getComplaints);
router.get("/get-complaints/:status", verifyToken, getComplaintsByStatus);
router.get("/get-complaint/:id", verifyToken, getComplaintById);
router.get("/get-user-complaints/:userId", verifyToken, getComplaintsByUserId);
router.get("/complaints/user/:userId", verifyToken, getComplaintsByUserId);
router.post("/update-complaint-status/:id", verifyToken, updateComplaintStatus);
router.post("/resolve-complaint/:id", verifyToken, resolveComplaint);
router.get("/get-complaint-stats", verifyToken, getComplaintStats);

export default router;
