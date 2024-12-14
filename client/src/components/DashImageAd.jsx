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
import {
  ImageIcon,
  Upload,
  Palette,
  Type,
  ImagePlus,
  Calendar,
  Image as LogoIcon,
} from "lucide-react";

const DashImageAd = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [title, setTitle] = useState("");
  const [tagline, setTagline] = useState("");
  const [textPrompt, setTextPrompt] = useState("");
  const [imagePrompt, setImagePrompt] = useState("");
  const [overlayText, setOverlayText] = useState("");
  const [image, setImage] = useState("");
  const [backgroundImage, setBackgroundImage] = useState("");
  const [finalImageReady, setFinalImageReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [uploadSuccessMessage, setUploadSuccessMessage] = useState("");
  const [ratio, setRatio] = useState("1:1");
  const [fontSize, setFontSize] = useState(24);
  const [taglineFontSize, setTaglineFontSize] = useState(18);
  const [textColor, setTextColor] = useState("#FFFFFF");
  const [fontStyle, setFontStyle] = useState("normal");
  const [fontWeight, setFontWeight] = useState("normal");
  const [fontFamily, setFontFamily] = useState("Arial");

  const [includeDate, setIncludeDate] = useState(false);
  const [includeDateTime, setIncludeDateTime] = useState(false);
  const [logo, setLogo] = useState("");
  const [imageOpacity, setImageOpacity] = useState(1);
  const adRef = useRef(null);

  const ratioSizes = {
    "1:1": { width: 400, height: 600 },
    "16:9": { width: 640, height: 360 },
    "4:3": { width: 600, height: 450 },
  };
  const { width, height } = ratioSizes[ratio];

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
        "https://e03c-34-29-158-158.ngrok-free.app/generate-image",
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

  const handleUploadLogo = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setLogo(event.target.result);
      reader.readAsDataURL(file);
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
        body: JSON.stringify({
          base64Image,
          title,
          tagline,
          imagePrompt,
          textPrompt,
          overlayText,
          userId: currentUser._id,
          includeDate,
          includeDateTime,
        }),
      });

      const result = await response.json();
      if (result.success) {
        setUploadSuccessMessage(result.message);
      } else {
        throw new Error(result.message);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to upload advertisement. Please try again.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="rounded-lg p-6 flex flex-col items-center justify-center">
          {!finalImageReady ? (
            <div className="flex flex-col items-center justify-center text-gray-500">
              <ImageIcon size={64} className="mb-4" />
              <p className="text-center">Your generated ad will appear here</p>
            </div>
          ) : (
            <div ref={adRef} style={{ width, height }}>
              <div
                className="relative w-full h-full"
                style={{
                  width,
                  height,
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <img
                  src={backgroundImage || image}
                  alt="Generated Background"
                  className="w-full h-full object-cover rounded-lg shadow-lg"
                  style={{ opacity: imageOpacity }}
                />
                <div className="absolute inset-0 flex flex-col justify-between p-4">
                  {tagline && (
                    <div
                      style={{
                        color: textColor,
                        fontSize: `${taglineFontSize}px`,
                        fontWeight: "bold",
                        textAlign: "center",
                        marginBottom: "10px",
                      }}
                    >
                      {tagline}
                    </div>
                  )}

                  {logo && (
                    <img
                      src={logo}
                      alt="Logo"
                      className="absolute top-4 right-4 max-w-[100px] max-h-[100px]"
                    />
                  )}

                  {(includeDate || includeDateTime) && (
                    <div
                      style={{
                        position: "absolute",
                        bottom: "10px",
                        left: "10px",
                        color: textColor,
                        fontSize: "14px",
                      }}
                    >
                      {includeDateTime
                        ? new Date().toLocaleString()
                        : new Date().toLocaleDateString()}
                    </div>
                  )}

                  <div
                    style={{
                      color: textColor,
                      fontSize: `${fontSize}px`,
                      fontWeight,
                      fontStyle,
                      fontFamily,
                      textAlign: "center",
                      alignSelf: "center",
                    }}
                  >
                    {overlayText}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <Type className="mr-2" /> Create Your Advertisement
          </h2>

          <form onSubmit={handleGenerate} className="space-y-4">
            <div>
              <Label htmlFor="title" className="mb-2">
                Title
              </Label>
              <TextInput
                id="title"
                type="text"
                placeholder="Enter title for advertisement"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                icon={ImagePlus}
              />
            </div>
            <div>
              <Label htmlFor="tagline" className="mb-2">
                Tagline
              </Label>
              <TextInput
                id="tagline"
                type="text"
                placeholder="Enter tagline for advertisement"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="textPrompt" className="mb-2">
                Text Prompt
              </Label>
              <TextInput
                id="textPrompt"
                type="text"
                placeholder="Enter text prompt for ad content"
                required
                value={textPrompt}
                onChange={(e) => setTextPrompt(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="imagePrompt" className="mb-2">
                Image Prompt
              </Label>
              <TextInput
                id="imagePrompt"
                type="text"
                placeholder="Enter image prompt for background"
                value={imagePrompt}
                onChange={(e) => setImagePrompt(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Background Image (Optional)</Label>
                <FileInput
                  onChange={handleUploadBackground}
                  accept="image/*"
                  icon={Upload}
                />
              </div>

              <div>
                <Label>Size Ratio</Label>
                <Select
                  value={ratio}
                  onChange={(e) => setRatio(e.target.value)}
                >
                  <option value="1:1">1:1</option>
                  <option value="16:9">16:9</option>
                  <option value="4:3">4:3</option>
                </Select>
              </div>
            </div>

            {/* <div className="mt-4 p-4 bg-gray-100 rounded-lg">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                Optional Elements
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Logo</Label>
                  <FileInput
                    onChange={handleUploadLogo}
                    accept="image/*"
                    icon={LogoIcon}
                  />
                </div>
                
                <div>
                  <Label>Date Options</Label>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      color={includeDate ? "blue" : "light"}
                      onClick={() => {
                        setIncludeDate(!includeDate);
                        setIncludeDateTime(false);
                      }}
                    >
                      Date
                    </Button>
                    <Button
                      size="sm"
                      color={includeDateTime ? "blue" : "light"}
                      onClick={() => {
                        setIncludeDateTime(!includeDateTime);
                        setIncludeDate(false);
                      }}
                    >
                      Date & Time
                    </Button>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <Label>Background Opacity</Label>
                <input 
                  type="range" 
                  min="0.1" 
                  max="1" 
                  step="0.1" 
                  value={imageOpacity} 
                  onChange={(e) => setImageOpacity(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
            </div> */}

            <div className="mt-4 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Palette className="mr-2" /> Text Styling
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <Select
                  value={fontFamily}
                  onChange={(e) => setFontFamily(e.target.value)}
                >
                  {[
                    "Arial",
                    "Verdana",
                    "Georgia",
                    "Times New Roman",
                    "Courier New",
                    "Impact",
                  ].map((font) => (
                    <option key={font} value={font}>
                      {font}
                    </option>
                  ))}
                </Select>

                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    color={fontWeight === "bold" ? "blue" : "light"}
                    onClick={() =>
                      setFontWeight(fontWeight === "normal" ? "bold" : "normal")
                    }
                  >
                    B
                  </Button>

                  <Button
                    size="sm"
                    color={fontStyle === "italic" ? "blue" : "light"}
                    onClick={() =>
                      setFontStyle(fontStyle === "normal" ? "italic" : "normal")
                    }
                  >
                    I
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <Label>Text Font Size</Label>
                  <TextInput
                    type="number"
                    min="12"
                    max="72"
                    value={fontSize}
                    onChange={(e) => setFontSize(Number(e.target.value))}
                    placeholder="Main Text Font Size"
                  />
                </div>

                <div>
                  <Label>Tagline Font Size</Label>
                  <TextInput
                    type="number"
                    min="12"
                    max="48"
                    value={taglineFontSize}
                    onChange={(e) => setTaglineFontSize(Number(e.target.value))}
                    placeholder="Tagline Font Size"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2 mt-4">
                <Label>Color</Label>
                <input
                  type="color"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="w-full h-10"
                />
              </div>
            </div>

            {loading && (
              <div className="flex justify-center">
                <Spinner aria-label="Loading spinner" />
              </div>
            )}

            {error && <Alert color="failure">{error}</Alert>}
            {uploadSuccessMessage && <Alert color="success">{uploadSuccessMessage}</Alert>}

            <div className="flex space-x-4">
              <Button
                type="submit"
                gradientDuoTone="purpleToBlue"
                className="flex-grow"
              >
                Generate Advertisement
              </Button>

              {finalImageReady && (
                <Button
                  gradientDuoTone="greenToBlue"
                  onClick={handleUploadFinalAd}
                  className="flex-grow"
                >
                  Save Advertisement
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DashImageAd;
