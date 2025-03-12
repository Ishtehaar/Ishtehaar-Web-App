import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import multer from "multer";
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
} from "../controllers/socialMedia.controller.js";

// // / Set up multer to store the uploaded file in a 'uploads' directory
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/'); // Path where files will be stored
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname)); // Renaming the file to avoid duplicates
//   }
// });

// const upload = multer({ storage: storage });

const router = express.Router();

router.get("/faceBookAuth", faceBookAuth);
router.get("/callback", faceBookCallback);
router.get("/get-pages", getPages);
router.get("/get-instagram-accounts", getInstagramAccounts);
router.get("get-page-metadata/:pageId", getPageMetaData);
router.get("get-page-posts", getPagePosts);
router.get("/get-insta-posts", getInstaPosts);
router.get("/check-connection-status", checkConnectionStatus);
router.post("/fb-post-now", fbPostNow);
router.post("/fb-schedule-post", fbSchedulePost);
router.post("/insta-post-now", instaPostNow);


router.post("/post-to-both", postToBoth);
router.post("/manipulate-social-media-campaign", verifyToken, manipulateSocialMediaCampaign);


export default router;
