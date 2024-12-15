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

//controller to generate AI content from OPEN AI model
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
            "You are a skilled content writer specializing in creating engaging social media posts. Based on the details I provide, craft concise  and captivating content suitable for overlaying on a background image. The content should work effectively for both Instagram and LinkedIn, maintaining a balance between creativity and professionalism. Ensure it grabs attention, aligns with the provided details, and is optimized for visual impact. Don't include hashtags here as well as dont generate text in double quotes.",
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

// Controller to upload an advertisement on cloudinary and then in db
export const uploadAd = async (req, res, next) => {
  const { finalBase64Image, rawBase64Image, title, imagePrompt, textPrompt, overlayText, userId, tagline } =
    req.body;

  try {
    const uploadFinal = await cloudinary.v2.uploader.upload(finalBase64Image, {
      folder: "ads",
    });

    const uploadBg = await cloudinary.v2.uploader.upload(rawBase64Image, {
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
      backgroundImage: uploadBg.secure_url,
      overlayText,
      slug,
      tagline,
      finalAd: uploadFinal.secure_url,
    });

    await newAd.save();

    res.status(200).json({
      success: true,
      message: "Ad uploaded successfully",
      imageUrl: uploadF.secure_url,
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
    const savedAds = await Advertisment.find({ userId }).sort({
      createdAt: -1,
    });

    if (!savedAds) {
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

// Controller to fetch a single advertisement for viewing purposes
export const getAd = async (req, res) => {
  try {
    const { adSlug } = req.params; // Get `adSlug` from route parameters
    const ad = await Advertisment.findOne({ slug: adSlug }); // Find the ad by slug
    console.log(adSlug);
    if (!ad) {
      return res.status(404).json({
        success: false,
        message: "Advertisement not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Advertisement fetched successfully.",
      ad,
    });
  } catch (error) {
    console.error("Error fetching advertisement:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch advertisement.",
      error: error.message,
    });
  }
};

// Controller to fetch a single advertisement for editing
export const getEditAd = async (req, res) => {
  try {
    const { adId } = req.params; // Get `adId` from route parameters
    const ad = await Advertisment.findOne({ _id: adId }); // Find the ad by id
    console.log(adId);
    if (!ad) {
      return res.status(404).json({
        success: false,
        message: "Advertisement not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Advertisement fetched successfully.",
      ad,
    });
  } catch (error) {
    console.error("Error fetching advertisement:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch advertisement.",
      error: error.message,
    });
  }
};

export const updateAd = async (req, res) => {
  try {
    const { adId } = req.params; // Get `adId` from route parameters
    const { title, textPrompt, imagePrompt, overlayText, tagline, rawBase64Image, finalBase64Image } = req.body; // Get updated fields from request body

    const uploadFinal = await cloudinary.v2.uploader.upload(finalBase64Image, {
      folder: "ads",
    });

    const uploadBg = await cloudinary.v2.uploader.upload(rawBase64Image, {
      folder: "ads",
    });

    const updatedAd = await Advertisment.findOneAndUpdate(
      { _id: adId },
      { title, textPrompt, imagePrompt, overlayText, tagline, backgroundImage: uploadBg.secure_url, finalAd: uploadFinal.secure_url },
      { new: true }
      );
      console.log(updatedAd);
      if (!updatedAd) {
        return res.status(404).json({
          success: false,
          message: "Advertisement not found.",
        });
      }
      res.status(200).json({
        success: true,
        message: "Advertisement updated successfully.",
        updatedAd,
      });
    }
    catch (error) {
      console.error("Error updating advertisement:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update advertisement.",
        error: error.message,
      });
    }
  };

