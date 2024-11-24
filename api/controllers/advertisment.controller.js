import cloudinary from "cloudinary";
import * as dotenv from "dotenv";

dotenv.config();

cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// export const createAd = async (req, res, next) => {
//   const __dirname = path.resolve();
//   const { textPrompt, imagePrompt } = req.body;
//   const backgroundImagePath = path.join(__dirname, "api", "assets", "lab.png");

//   const outputImagePath = path.join(__dirname, "output.jpg");

//   try {
//     // Step 1: Generate text content
//     const textResponse = await fetch(
//       "http://localhost:5000/api/openai/generate-content",
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ prompt: textPrompt }),
//       }
//     );
//     if (!textResponse.ok) throw new Error("Failed to fetch text content");
//     const textData = await textResponse.json();
//     const generatedText = textData.data;

//     console.log("Generated text:", generatedText);

//     // // Step 2: Generate background image
//     // const imageResponse = await fetch(
//     //   "https://ee7c-34-125-184-229.ngrok-free.app/generate-image",
//     //   {
//     //     method: "POST",
//     //     headers: {
//     //       "Content-Type": "application/json",
//     //     },
//     //     body: JSON.stringify({ prompt: imagePrompt }),
//     //   }
//     // );

//     // if (!imageResponse.ok) throw new Error("Failed to fetch background image");
//     // const imageData = await imageResponse.json();
//     // const imageUrl = imageData.image;

//     // const base64Image = `data:image/png;base64,${imageUrl}`;

//     const svgText = (text) => {
//       const words = text.split(" ");
//       const lines = [];
//       let currentLine = words[0];

//       for (let i = 1; i < words.length; i++) {
//         const word = words[i];
//         if ((currentLine + " " + word).length > 30) {
//           // Adjust the length as needed
//           lines.push(currentLine);
//           currentLine = word;
//         } else {
//           currentLine += " " + word;
//         }
//       }
//       lines.push(currentLine);

//       const svgLines = lines
//         .map(
//           (line, index) =>
//             `<text x="400" y="${150 + index * 50}" class="title">${line}</text>`
//         )
//         .join("");

//       return `
//           <svg width="800" height="400">
//             <style>
//               .title { fill: black; font-size: 40px; font-weight: bold; text-anchor: middle; }
//             </style>
//             ${svgLines}
//           </svg>
//         `;
//     };

//     const svgContent = svgText(generatedText);

//     await sharp(backgroundImagePath)
//       .composite([{ input: Buffer.from(svgContent), gravity: "center" }])
//       .toFile(outputImagePath);

//     const uploadResult = cloudinary.uploader.upload(outputImagePath, {
//       resource_type: "image",
//       public_id: "ad_image",
//     });

//     // const imageWithTextUrl = cloudinary.v2.url(uploadResult.public_id, {
//     //     transformation: [
//     //       {
//     //         overlay: `text:Arial_${generatedText}`, // Add the text as overlay
//     //         gravity: "south",
//     //         y: 30,
//     //         color: "white",
//     //         font_size: 50,
//     //         font_weight: "bold",
//     //       },
//     //     ],
//     //   });

//     // Step 5: Respond with the final URL of the uploaded image
//     res.status(200).json({
//       success: true,
//       finalAdUrl: uploadResult.secure_url,
//     });
//   } catch (error) {
//     console.error("Error in createAd:", error);
//     next(error);
//   }
// };

export const uploadAd = async (req, res, next) => {
  const { base64Image } = req.body;

  try {
    const uploadResult = await cloudinary.v2.uploader.upload(base64Image, {
      folder: "ads",
    });

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
