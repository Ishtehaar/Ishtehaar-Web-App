import express from "express";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import advertismentRoutes from "./routes/advertisment.route.js";
import keywordRoutes from "./routes/keywords.route.js";
import websiteAuditRoutes from "./routes/websiteAudit.route.js";


import cookieParser from "cookie-parser";

import dotenv from "dotenv";
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
app.use(express.json({ limit: '50mb' }));

app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/advertisment", advertismentRoutes);
app.use("/api/keywords", keywordRoutes);
app.use("/api/audit", websiteAuditRoutes);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
