import React, { useState, useRef } from "react";
import {
  Button,
  TextInput,
  Spinner,
  Alert,
  Select,
  FileInput,
  Label,
} from "flowbite-react";
import html2canvas from "html2canvas";
import { useSelector } from "react-redux";

const DashImageAd = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [title, setTitle] = useState("");
  const [textPrompt, setTextPrompt] = useState("");
  const [imagePrompt, setImagePrompt] = useState("");
  const [overlayText, setOverlayText] = useState("");
  const [image, setImage] = useState("");
  const [backgroundImage, setBackgroundImage] = useState("");
  const [finalImageReady, setFinalImageReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [ratio, setRatio] = useState("1:1");
  const [fontSize, setFontSize] = useState(24);
  const [textColor, setTextColor] = useState("#FFFFFF");
  const [fontStyle, setFontStyle] = useState("normal");
  const [fontWeight, setFontWeight] = useState("normal");
  const [fontFamily, setFontFamily] = useState("Arial");

  const adRef = useRef(null);

  const ratioSizes = {
    "1:1": { width: 400, height: 400 },
    "16:9": { width: 640, height: 360 },
    "4:3": { width: 600, height: 450 },
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setFinalImageReady(false);

    try {
      const textResponse = await fetch("/api/advertisment/generate-content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: textPrompt }),
      });

      if (!textResponse.ok) throw new Error("Failed to generate text");
      const textData = await textResponse.json();
      setOverlayText(textData.data);

      const imageResponse = await fetch(
        "https://b1ac-34-82-102-175.ngrok-free.app/generate-image",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ prompt: imagePrompt }),
        }
      );

      if (!imageResponse.ok) throw new Error("Failed to generate image");
      const imageData = await imageResponse.json();
      setImage(`data:image/png;base64,${imageData.image}`);
      setBackgroundImage("");

      setFinalImageReady(true);
    } catch (err) {
      setError(
        err.message || "Failed to generate advertisement. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleUploadBackground = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setBackgroundImage(event.target.result);
      reader.readAsDataURL(file);
      setImage("");
    }
  };

  const handleUploadFinalAd = async () => {
    if (!adRef.current) return;

    try {
      const canvas = await html2canvas(adRef.current, { useCORS: true });
      const base64Image = canvas.toDataURL("image/png");

      const response = await fetch("/api/advertisment/upload-ad", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ base64Image, title, imagePrompt, textPrompt, overlayText, userId: currentUser._id }),
      });

      const result = await response.json();
      if (result.success) {
        alert(result.message);
      } else {
        throw new Error(result.message);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to upload advertisement. Please try again.");
    }
  };

  const { width, height } = ratioSizes[ratio];

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">
        Create an Advertisement
      </h1>
      <form className="flex flex-col gap-4" onSubmit={handleGenerate}>
      <TextInput
          type="text"
          placeholder="Enter title for advertisment"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <TextInput
          type="text"
          placeholder="Enter text prompt for ad content"
          required
          value={textPrompt}
          onChange={(e) => setTextPrompt(e.target.value)}
        />

        <TextInput
          type="text"
          placeholder="Enter image prompt for background"
          value={imagePrompt}
          onChange={(e) => setImagePrompt(e.target.value)}
        />

        <div>
          <Label>Upload Background Image (optional)</Label>
          <FileInput onChange={handleUploadBackground} accept="image/*" />
        </div>

        <div>
          <Label>Select Size Ratio</Label>
          <Select value={ratio} onChange={(e) => setRatio(e.target.value)}>
            <option value="1:1">1:1</option>
            <option value="16:9">16:9</option>
            <option value="4:3">4:3</option>
          </Select>
        </div>

        {loading && (
          <div className="flex justify-center">
            <Spinner aria-label="Loading spinner" />
          </div>
        )}

        {error && <Alert color="failure">{error}</Alert>}

        <Button type="submit" gradientDuoTone="purpleToBlue">
          Generate Advertisement
        </Button>
      </form>

      {finalImageReady && (
        <div ref={adRef} className="mt-5" style={{ width, height }}>
          <div
            className="relative w-full h-full"
            style={{ width, height, position: "relative" }}
          >
            <img
              src={backgroundImage || image}
              alt="Generated Background"
              className="w-full h-full object-cover rounded-lg"
            />
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{
                color: textColor,
                fontSize: `${fontSize}px`,
                fontWeight,
                fontStyle,
                fontFamily,
                textAlign: "center",
              }}
            >
              {overlayText}
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-4 mt-4">
        <Select
          value={fontFamily}
          onChange={(e) => setFontFamily(e.target.value)}
        >
          {["Arial", "Verdana", "Tahoma", "Georgia", "Times New Roman", "Courier New", "Lucida Console", "Impact", "Comic Sans MS", "Trebuchet MS"].map(
            (font) => (
              <option key={font} value={font}>
                {font}
              </option>
            )
          )}
        </Select>

        <Button onClick={() => setFontWeight(fontWeight === "normal" ? "bold" : "normal")}>
          Bold
        </Button>

        <Button onClick={() => setFontStyle(fontStyle === "normal" ? "italic" : "normal")}>
          Italic
        </Button>

        <TextInput
          type="number"
          min="12"
          max="72"
          value={fontSize}
          onChange={(e) => setFontSize(Number(e.target.value))}
          placeholder="Font Size"
        />

        <input
          type="color"
          value={textColor}
          onChange={(e) => setTextColor(e.target.value)}
        />
      </div>

      {finalImageReady && (
        <Button gradientDuoTone="greenToBlue" onClick={handleUploadFinalAd}>
          Upload Advertisement
        </Button>
      )}
    </div>
  );
};

export default DashImageAd;
