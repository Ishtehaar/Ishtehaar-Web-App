import express from "express";
import { createBlogPost, getBlogPosts } from "../controllers/blogPost.controller.js";




const router = express.Router();

router.get("/get-blog-posts", getBlogPosts);
router.post("/create-blog-post", createBlogPost);



export default router;
