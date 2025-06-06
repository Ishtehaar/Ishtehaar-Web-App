import OpenAI from "openai";
import User from "../models/user.model.js";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const generateKeywords = async (req, res) => {
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
            "You are an SEO assistant. Given some content and target keywords, suggest how to naturally integrate the keywords without overstuffing. Provide placement ideas for title, headings, meta description, and body content.",
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

export const manipulateKeywords = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.userId);
    currentUser.SEOKeywordsCreated += 1;
    await currentUser.save();
    console.log("SEO keywords count updated successfully");
    res.status(200).json({
      success: true,
      message: "SEO keywords count updated successfully",
    });
  } catch (error) {
    errorHandler(400, "Error updating SEO keywords count");
    errorHandler(400, "Error updating SEO keywords count");
  }
};
