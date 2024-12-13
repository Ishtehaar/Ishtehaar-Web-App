import cloudinary from "cloudinary";
import * as dotenv from "dotenv";
import OpenAI from "openai";
import { errorHandler } from "../utils/error.js";
import Advertisment from "../models/advertisment.model.js";
dotenv.config();

cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const generateContent = async (req, res, next) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({
      success: false,
      message: "Prompt is required",
    });
  }

  try {
    const gptResponse = await openai.chat.completions.create({
      model: "gpt-4o", // Ensure the model name is correct
      messages: [
        {
          role: "system",
          content:
            "You are a skilled content writer specializing in creating engaging social media posts. Based on the details I provide, craft concise  and captivating content suitable for overlaying on a background image. The content should work effectively for both Instagram and LinkedIn, maintaining a balance between creativity and professionalism. Ensure it grabs attention, aligns with the provided details, and is optimized for visual impact. Don't include hashtags here.",
        },
        { role: "user", content: prompt },
      ],
    });

    const generatedContent = gptResponse.choices[0]?.message?.content;

    res.status(200).json({
      success: true,
      data: generatedContent,
    });
  } catch (error) {
    errorHandler(400, "Error generating content");
    next(error); // Pass error to the error-handling middleware
  }
};

export const uploadAd = async (req, res, next) => {
  //to upload on cloudinary and then saving in DB
  const { base64Image, title, imagePrompt, textPrompt, overlayText, userId } =
    req.body;

  try {
    const uploadResult = await cloudinary.v2.uploader.upload(base64Image, {
      folder: "ads",
    });

    const slug = title
    .split(" ")
    .join("-")
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]/g, "-", " ");

    const newAd = new Advertisment({
      title,
      userId,
      textPrompt,
      imagePrompt,
      backgroundImage: uploadResult.secure_url,
      overlayText,
      slug,
    });

    await newAd.save();

    res.status(200).json({
      success: true,
      message: "Ad uploaded successfully",
      imageUrl: uploadResult.secure_url,
    });
  } catch (error) {
    console.error("Error uploading ad:", error);
    res.status(500).json({
      success: false,
      message: "Failed to upload advertisement",
      error: error.message,
    });
  }
};

// Controller to fetch all saved advertisements for the signed-in user
export const getAds = async (req, res) => {
  try {
    // Extract userId from the authenticated user (e.g., from req.user provided by middleware)
    const userId = req.user?.userId;
    // console.log(userId);

    // Ensure userId is present (security check)
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User not signed in.",
      });
    }

    // Fetch advertisements for the specific user, sorted by save time (earliest saved first)
    const savedAds = await Advertisment.find({ userId }).sort({ createdAt: -1 });

    if(!savedAds) {
      return res.status(404).json({
        success: false,
        message: "No advertisements found for the signed-in user.",
      });
    }

    // Respond with the fetched advertisements
    res.status(200).json({
      success: true,
      message: "Advertisements fetched successfully.",
      savedAds,
    });
  } catch (error) {
    // Handle errors and send a response
    res.status(500).json({
      success: false,
      message: "Failed to fetch advertisements.",
      error: error.message,
    });
  }
};
