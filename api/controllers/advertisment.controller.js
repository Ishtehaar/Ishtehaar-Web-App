import cloudinary from "cloudinary";
import * as dotenv from "dotenv";
dotenv.config();

cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

export const createAd = async (req, res, next) => {
  const { textPrompt, imagePrompt } = req.body;

  try {
    // Step 1: Generate text content
    const textResponse = await fetch(
      "http://localhost:5000/api/openai/generate-content",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: textPrompt }),
      }
    );
    if (!textResponse.ok) throw new Error("Failed to fetch text content");
    const textData = await textResponse.json();
    const generatedText = textData.data;

    console.log("Generated text:", generatedText);

    // Step 2: Generate background image
    const imageResponse = await fetch(
      "https://ee7c-34-125-184-229.ngrok-free.app/generate-image",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: imagePrompt }),
      }
    );
    if (!imageResponse.ok) throw new Error("Failed to fetch background image");
    const imageData = await imageResponse.json();
    const imageUrl = imageData.image;

    const base64Image = `data:image/png;base64,${imageUrl}`;

    const uploadResult = cloudinary.uploader.upload(base64Image, {
      resource_type: "image",
      public_id: "ad_image",
    });


    const imageWithTextUrl = cloudinary.v2.url(uploadResult.public_id, {
        transformation: [
          {
            overlay: `text:Arial_${generatedText}`, // Add the text as overlay
            gravity: "south",
            y: 30,
            color: "white",
            font_size: 50,
            font_weight: "bold",
          },
        ],
      });

    // Step 5: Respond with the final URL of the uploaded image
    res.status(200).json({
      success: true,
      finalAdUrl: imageWithTextUrl,
    });
  } catch (error) {
    console.error("Error in createAd:", error);
    next(error);
  }
};
