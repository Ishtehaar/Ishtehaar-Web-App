  import axios from "axios";
  import { errorHandler } from "../utils/error.js";

  async function query(data) {

    try {
      const res = await fetch(
        "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
        {
          headers: {
            Authorization: "Bearer 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",
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify(data)
        }
      );
      if (!res.ok) {
        errorHandler(201, "Error generating image");
      }
      const data = await res.blob();
      return data;
    } catch (error) {
      errorHandler(201, error.data);
    }
  };

  export const generateImage = async (req, res, next) => {
    const { prompt } = req.body;

    const image = await query(prompt);

    res.set('Content-Type', 'image/png'); // or appropriate type
        image.stream().pipe(res); // Stream the image back to the client
  };
