import React, { useState, useRef } from "react";
import { Button, TextInput, Spinner, Alert } from "flowbite-react";
import html2canvas from "html2canvas";
import spiderman from "../assets/mountains.jpg";

const DashImageAd = () => {
  const [prompt, setPrompt] = useState("");
  const [textPrompt, setTextPrompt] = useState("");
  const [overlayText, setOverlayText] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const adRef = useRef(null); // Ref to the component for rendering

  const handleGenerate = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setImage(spiderman);

    try {
      // Fetch text from OpenAI API
      const textResponse = await fetch("/api/openai/generate-content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: textPrompt }),
      });

      if (!textResponse.ok) {
        throw new Error("Failed to generate text");
      }

      const textData = await textResponse.json();
      setOverlayText(textData.data);
    } catch (err) {
      setError("Failed to generate text. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async () => {
    if (!adRef.current) return;

    try {
      // Render the ad component to a canvas
      const canvas = await html2canvas(adRef.current, { useCORS: true });
      const base64Image = canvas.toDataURL("image/png");

      // Send the base64 image to the backend
      const response = await fetch("/api/advertisment/upload-ad", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ base64Image }),
      });

      const result = await response.json();
      if (result.success) {
        alert("Ad successfully uploaded!");
        console.log("Cloudinary URL:", result.imageUrl);
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error("Failed to upload advertisement:", error);
      setError("Failed to upload advertisement. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-white mb-4 text-center">
          Generate Advertisement
        </h2>

        <form onSubmit={handleGenerate} className="space-y-4">
          <TextInput
            id="textPrompt"
            type="text"
            placeholder="Enter text prompt"
            value={textPrompt}
            onChange={(e) => setTextPrompt(e.target.value)}
            required
            className="bg-gray-700 text-white"
          />

          <Button
            type="submit"
            gradientDuoTone="purpleToBlue"
            disabled={loading}
            fullSized
          >
            {loading ? <Spinner aria-label="Loading spinner" /> : "Generate"}
          </Button>
        </form>

        {error && (
          <Alert color="failure" className="mt-4">
            <span>{error}</span>
          </Alert>
        )}

        <div className="mt-6 relative w-full h-auto" ref={adRef}>
          <img
            src={image}
            alt="Generated Ad Background"
            className="w-full h-auto rounded-lg"
          />
          <div
            className="absolute inset-0 flex items-center justify-center text-white font-bold text-2xl p-4"
            style={{
              textShadow: "2px 2px 4px rgba(0, 0, 0, 0.7)",
            }}
          >
            {overlayText}
          </div>
        </div>

        <Button
          className="mt-4"
          gradientDuoTone="greenToBlue"
          onClick={handleUpload}
        >
          Upload Advertisement
        </Button>
      </div>
    </div>
  );
};

export default DashImageAd;
