import express from "express";
import mongoose from "mongoose";
import Stripe from "stripe";
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import advertismentRoutes from "./routes/advertisment.route.js";
import keywordRoutes from "./routes/keywords.route.js";
import websiteAuditRoutes from "./routes/websiteAudit.route.js";
import stripeRoutes from "./routes/stripe.route.js";


import cookieParser from "cookie-parser";
import bodyParser from 'body-parser';

import dotenv from "dotenv";
import { webHook } from "./controllers/stripe.controller.js";
import { updateUserSubscription } from "./services/subscriptionService.js";
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

const app = express();
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server is running on port: ", PORT);
});

// app.use(express.json());

app.post("/webhook", express.raw({ type: "application/json" }), (req, res) => {
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
  
  res.json({ received: true }); 
});

app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.json({ limit: '50mb' }));


app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/advertisment", advertismentRoutes);
app.use("/api/keywords", keywordRoutes);
app.use("/api/audit", websiteAuditRoutes);
app.use("/api/stripe", stripeRoutes);



app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});


