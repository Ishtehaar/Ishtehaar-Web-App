import axios from "axios";
import { errorHandler } from "../utils/error.js";

export const generateImg = async (prompt) => {
  const options = {
    method: "POST",
    headers: {
      Authorization: `Bearer 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`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ inputs: prompt }),
  };

  try {
    const res = await fetch(
      "https://api-inference.huggingface.co/models/CompVis/stable-diffusion-v1-4",
      options
    );
    if (!res.ok) {
      errorHandler(201, "Error generating image");
    }
    const data = await res.json();
    return data;
  } catch (error) {
    errorHandler(201, error.data);
  }
};

export const generateImage = async (req, res, next) => {
  const { prompt } = req.body;

  const image = await generateImg(prompt);

  if (image) {
    res.status(200).send({ image });
  } else {
    errorHandler(500, "Failed to Generate Image");
  }
};
