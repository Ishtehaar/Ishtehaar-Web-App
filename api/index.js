import express from "express";
import mongoose from "mongoose";
import session from "express-session";
import cors from "cors";
import Stripe from "stripe";
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import advertismentRoutes from "./routes/advertisment.route.js";
import keywordRoutes from "./routes/keywords.route.js";
import websiteAuditRoutes from "./routes/websiteAudit.route.js";
import stripeRoutes from "./routes/stripe.route.js";
import facebookRoutes from "./routes/socialMedia.route.js";
import subscriptionRoutes from "./routes/subscription.route.js";
import complaintRoutes from "./routes/complaint.route.js";
import tutorialRoutes from "./routes/tutorial.route.js";
import videoTutorialRoutes from "./routes/videoTutorial.route.js";
import successStoryRoutes from "./routes/successStory.route.js";
import blogPostRoutes from "./routes/blogPost.route.js";

import cookieParser from "cookie-parser";
import bodyParser from "body-parser";

import dotenv from "dotenv";
import { updateUserSubscription } from "./services/subscriptionService.js";
import Tutorial from "./models/tutorial.model.js";
import VideoTutorial from "./models/videoTutorial.model.js";
import SuccessStory from "./models/successStory.model.js";
import BlogPost from "./models/blogPost.model.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
dotenv.config();
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("MongoDB not connected:", err.message);
  });

  //   const tutorialsData = [
  //     {
  //       title: "Getting Started",
  //       description:
  //         "Learn the basics of navigating through Ishtehaar platform",
  //       steps: [
  //         "Create your account and set up your profile",
  //         "Configure your business details and target audience",
  //         "Set up your first campaign in minutes",
  //         "Learn how to read analytics and reports",
  //       ],
  //       order: 1,
  //     },
  //     {
  //       title: "Campaign Creation",
  //       description: "Master the art of creating effective digital campaigns",
  //       steps: [
  //         "Define your campaign objectives and KPIs",
  //         "Set up audience targeting and segmentation",
  //         "Design creative assets with our built-in tools",
  //         "Schedule and launch your campaign",
  //       ],
  //       order: 2,
  //     },
  //     {
  //       title: "Analytics & Reporting",
  //       description:
  //         "Understand how to measure and optimize campaign performance",
  //       steps: [
  //         "Navigate the analytics dashboard",
  //         "Interpret key performance metrics",
  //         "Create custom reports for stakeholders",
  //         "Use insights to optimize future campaigns",
  //       ],
  //       order: 3,
  //     },
  //   ];

  // const videoTutorialsData = [
  //   {
  //     title: "Introduction to Digital Marketing",
  //     description: "Learn the fundamentals of digital marketing strategies",
  //     thumbnail: "/api/placeholder/600/400",
  //     videoUrl: "https://example.com/videos/intro-digital-marketing",
  //     duration: "5:30",
  //   },
  //   {
  //     title: "Social Media Marketing Essentials",
  //     description: "Master the basics of marketing across social platforms",
  //     thumbnail: "/api/placeholder/600/400",
  //     videoUrl: "https://example.com/videos/social-media-essentials",
  //     duration: "8:45",
  //   },
  //   {
  //     title: "Advanced AI Targeting Techniques",
  //     description: "Leverage our AI-powered solutions for better targeting",
  //     thumbnail: "/api/placeholder/600/400",
  //     videoUrl: "https://example.com/videos/ai-targeting",
  //     duration: "7:20",
  //   },
  // ];

  // const successStoriesData = [
  //   {
  //     client: "TechZone",
  //     industry: "Technology",
  //     result: "250% increase in engagement",
  //     quote: "Ishtehaar transformed our digital presence across Pakistan",
  //     image: "/api/placeholder/300/200",
  //     fullCaseStudyUrl: "/case-studies/techzone",
  //   },
  //   {
  //     client: "FoodDelight",
  //     industry: "Food & Beverage",
  //     result: "135% increase in conversions",
  //     quote: "Our customer acquisition cost dropped dramatically",
  //     image: "/api/placeholder/300/200",
  //     fullCaseStudyUrl: "/case-studies/fooddelight",
  //   },
  //   {
  //     client: "StyleTrend",
  //     industry: "Fashion",
  //     result: "189% ROI on social campaigns",
  //     quote: "The AI-powered targeting helped us reach the perfect audience",
  //     image: "/api/placeholder/300/200",
  //     fullCaseStudyUrl: "/case-studies/styletrend",
  //   },
  // ];

  // const blogPostsData = [
  //   {
  //     title: "Digital Marketing Trends in Pakistan for 2025",
  //     excerpt:
  //       "Discover the latest trends shaping the digital landscape in Pakistan",
  //     content:
  //       "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  //     author: "Aamir Khan",
  //     date: new Date("2025-05-02"),
  //     readMoreUrl: "/blog/digital-marketing-trends-2025",
  //   },
  //   {
  //     title: "How AI is Revolutionizing Social Media Marketing",
  //     excerpt:
  //       "Learn how artificial intelligence is transforming campaign performance",
  //     content:
  //       "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  //     author: "Sara Ahmed",
  //     date: new Date("2025-04-28"),
  //     readMoreUrl: "/blog/ai-revolutionizing-social-media",
  //   },
  //   {
  //     title: "Building Your Brand Presence on Social Media",
  //     excerpt: "Step-by-step guide to establish a strong brand identity online",
  //     content:
  //       "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  //     author: "Fahad Ali",
  //     date: new Date("2025-04-15"),
  //     readMoreUrl: "/blog/brand-presence-social-media",
  //   },
  // ];

  // // Seed data function
  // const seedData = async () => {
  //   try {
  //     // Clear existing data
  //     await Tutorial.deleteMany({});
  //     await VideoTutorial.deleteMany({});
  //     await SuccessStory.deleteMany({});
  //     await BlogPost.deleteMany({});

  //     console.log("Previous data cleared");

  //     // Insert new data
  //     await Tutorial.insertMany(tutorialsData);
  //     await VideoTutorial.insertMany(videoTutorialsData);
  //     await SuccessStory.insertMany(successStoriesData);
  //     await BlogPost.insertMany(blogPostsData);

  //     console.log("Data successfully seeded!");
  //     process.exit(0);
  //   } catch (err) {
  //     console.error("Error seeding data:", err);
  //     process.exit(1);
  //   }
  // };
 

const app = express();
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server is running on port: ", PORT);
  // seedData();
});

//Stripe webhook implementation
app.post("/webhook", express.raw({ type: "application/json" }), (req, res) => {
  console.log("🔔 Webhook received");
  const sig = req.headers["stripe-signature"];

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body, // Ensure `rawBody` is used, not `req.body`
      sig,
      process.env.STRIPE_WEBHOOK
    );
    console.log("✅ Webhook received:", event.type);
  } catch (err) {
    console.error("❌ Webhook verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const userId = session.metadata?.userId; // Ensure metadata is included in Stripe session

    if (!userId) {
      console.error("❌ User ID not found in session metadata");
      return res.status(400).send("User ID missing in session metadata");
    }

    console.log("🎉 Payment successful for user:", userId);

    try {
      const updatedUser = updateUserSubscription(userId);
      console.log("✅ Subscription updated:", updatedUser);
    } catch (error) {
      console.error("❌ Error updating subscription:", error);
      return res.status(500).send("Internal server error");
    }
  }
  ``;
  res.json({ received: true });
});

app.use(cookieParser());
// app.use(bodyParser.json());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // 1 day session persistence
      secure: false, // Set to true if using HTTPS
    },
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/advertisment", advertismentRoutes);
app.use("/api/keywords", keywordRoutes);
app.use("/api/audit", websiteAuditRoutes);
app.use("/api/stripe", stripeRoutes);
app.use("/api/facebook", facebookRoutes);
app.use("/api/subscription", subscriptionRoutes);
app.use("/api/tutorials", tutorialRoutes);
app.use("/api/video-tutorials", videoTutorialRoutes);
app.use("/api/success-story", successStoryRoutes);
app.use("/api/blog-post", blogPostRoutes);
app.use("/api/complaint", complaintRoutes);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });


});
