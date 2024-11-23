import OpenAI from "openai";
import * as dotenv from "dotenv";
import { errorHandler } from "../utils/error.js";
dotenv.config();

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
            "You are a skilled content writer specializing in creating engaging social media posts. Based on the details I provide, craft concise and captivating content suitable for overlaying on a background image. The content should work effectively for both Instagram and LinkedIn, maintaining a balance between creativity and professionalism. Ensure it grabs attention, aligns with the provided details, and is optimized for visual impact. Don't include hashtags here",
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
