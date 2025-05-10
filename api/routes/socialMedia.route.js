import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import {
  checkConnectionStatus,
  faceBookAuth,
  faceBookCallback,
  fbPostNow,
  fbSchedulePost,
  getInstagramAccounts,
  getInstaPosts,
  getPageMetaData,
  getPagePosts,
  getPages,
  instaPostNow,
  manipulateSocialMediaCampaign,
  postToBoth,
  getInstagramEngagementRate
} from "../controllers/socialMedia.controller.js";


const router = express.Router();

router.get("/faceBookAuth", faceBookAuth);
router.get("/callback", faceBookCallback);
router.get("/get-pages", getPages);
router.get("/get-instagram-accounts", getInstagramAccounts);
router.get("/get-page-metadata", getPageMetaData);
router.get("/get-page-posts", getPagePosts);
router.get("/get-insta-posts", getInstaPosts);
router.get("/check-connection-status", checkConnectionStatus);
router.get("instagram-engagement-rate", getInstagramEngagementRate);
router.post("/fb-post-now", fbPostNow);
router.post("/fb-schedule-post", fbSchedulePost);
router.post("/insta-post-now", instaPostNow);
router.post("/post-to-both", postToBoth);
router.post("/manipulate-social-media-campaign", verifyToken, manipulateSocialMediaCampaign);


export default router;
