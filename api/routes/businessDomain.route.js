import express from "express";
import { createBusinessDomain, getBusinessDomainById, getBusinessDomains, updateBusinessDomain } from "../controllers/businessDomain.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.get("/get-business-domains", verifyToken, getBusinessDomains);
router.get("/get-business-domain/:id", verifyToken, getBusinessDomainById);
router.post("/create-business-domain", verifyToken, createBusinessDomain);
router.post("/update-business-domain", verifyToken, updateBusinessDomain);

export default router;
