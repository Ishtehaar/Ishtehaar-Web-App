import React, { useState, useRef, useEffect } from "react";
import {
  Button,
  TextInput,
  Spinner,
  Alert,
  Select,
  FileInput,
  Label,
  Tabs,
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
  MapPinIcon,
  ClockIcon,
  CalendarIcon,
  Globe2Icon,
  Loader2Icon,
} from "lucide-react";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaLinkedinIn,
} from "react-icons/fa";
import { useParams } from "react-router-dom";

const UpdateAdvertisment = () => {
  // Refs
  const adRef = useRef(null);
  // Redux state
  const { currentUser } = useSelector((state) => state.user);
  // State variables

  const [ad, setAd] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [title, setTitle] = useState("");
  const [tagline, setTagline] = useState("");
  const [textPrompt, setTextPrompt] = useState("");
  const [imagePrompt, setImagePrompt] = useState("");
  const [overlayText, setOverlayText] = useState("");
  const [image, setImage] = useState("");
  const [backgroundImage, setBackgroundImage] = useState("");
  const [finalImageReady, setFinalImageReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(null);
  const [error, setError] = useState("");
  const [uploadSuccessMessage, setUploadSuccessMessage] = useState("");
  const [ratio, setRatio] = useState("1:1");

  const [logo, setLogo] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [website, setWebsite] = useState("");
  const [facebook, setFacebook] = useState("");
  const [instagram, setInstagram] = useState("");
  const [linkedin, setLinkedin] = useState("");

  const [fontSize, setFontSize] = useState(20);
  const [taglineFontSize, setTaglineFontSize] = useState(36);
  const [textColor, setTextColor] = useState("#FFFFFF");
  const [fontStyle, setFontStyle] = useState("normal");
  const [fontWeight, setFontWeight] = useState("normal");
  const [fontFamily, setFontFamily] = useState("Arial");

  const [imageOpacity, setImageOpacity] = useState(1);

  const fontFamilies = [
    "Arial", // Classic sans-serif
    "Verdana", // Classic sans-serif
    "Georgia", // Classic serif
    "Times New Roman", // Classic serif
    "Courier New", // Monospaced
    "Impact", // Bold and striking
    "Helvetica", // Classic and clean
    "Roboto", // Google Font - Modern sans-serif
    "Open Sans", // Google Font - Versatile sans-serif
    "Lato", // Google Font - Clean and modern sans-serif
    "Montserrat", // Google Font - Elegant sans-serif
    "Poppins", // Google Font - Trending sans-serif
    "Nunito", // Google Font - Rounded and approachable
    "Raleway", // Google Font - Stylish sans-serif
    "Playfair Display", // Google Font - Elegant serif
    "Merriweather", // Google Font - Readable serif
    "Oswald", // Google Font - Condensed sans-serif
    "PT Sans", // Google Font - Modern sans-serif
    "Work Sans", // Google Font - Clean sans-serif
    "Ubuntu", // Google Font - Tech-inspired sans-serif
    "Source Sans Pro", // Google Font - User-friendly sans-serif
    "Quicksand", // Google Font - Playful and modern
    "Inter", // Google Font - Versatile and trending sans-serif
    "DM Sans", // Google Font - Minimalist sans-serif
    "Cabin", // Google Font - Humanist sans-serif
    "Fira Sans", // Google Font - Designed for readability
    "Rubik", // Google Font - Geometric sans-serif
    "Karla", // Google Font - Clean and compact sans-serif
  ];

  const fontStyles = [
    { name: "Normal", value: "normal" },
    { name: "Italic", value: "italic" },
    { name: "Oblique", value: "oblique" },
  ];

  const fontWeights = [
    { name: "Normal", value: "normal" },
    { name: "Bold", value: "bold" },
    { name: "Light", value: "300" },
    { name: "Semibold", value: "600" },
  ];

  // Get the adId from the URL
  const { adId } = useParams();
  console.log(adId); //debugging

  const ratioSizes = {
    "1:1": { width: 600, height: 600 },
    "16:9": { width: 640, height: 360 },
    "4:3": { width: 600, height: 450 },
  };
  const { width, height } = ratioSizes[ratio];

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/advertisment/getEditAd/${adId}`);
        const data = await res.json();
        if (!res.ok) {
          setError(true);
          setLoading(false);
        }
        if (res.ok) {
          setAd(data.ad);
          setTagline(data.ad.tagline);
          setTitle(data.ad.title);
          setTextPrompt(data.ad.textPrompt);
          setImagePrompt(data.ad.imagePrompt);
          setOverlayText(data.ad.overlayText);
          setBackgroundImage(data.ad.backgroundImage);
          setImage(data.ad.finalAd);
          setFinalImageReady(true);
          setLogo(data.ad.logo);
          setDate(data.ad.date);
          setTime(data.ad.time);
          setLocation(data.ad.location);
          setWebsite(data.ad.website);
          setFacebook(data.ad.facebook);
          setInstagram(data.ad.instagram);
          setLinkedin(data.ad.linkedin);

          setFontSize(data.ad.fontSize || 20);
          setTaglineFontSize(data.ad.taglineFontSize || 36);
          setTextColor(data.ad.textColor || "#FFFFFF");
          setFontStyle(data.ad.fontStyle || "normal");
          setFontWeight(data.ad.fontWeight || "normal");
          setFontFamily(data.ad.fontFamily || "Arial");

          setLoading(false);
          setError(false);

          setLoading(false);
          setError(false);
        }
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchPost();
  }, [adId]);

  const handleNextTab = () => {
    // Validate inputs based on current tab before moving
    switch (activeTab) {
      case 0: // Basic Info Tab
        if (!title || !textPrompt) {
          setError("Please fill in the required fields: Title and Text Prompt");
          return;
        }
        break;
      case 1: // Optional Elements Tab
        // No specific validation required
        break;
      case 2: // Text Styling Tab
        // No specific validation required
        break;
    }

    // Move to next tab if validation passes
    setActiveTab((prev) => Math.min(prev + 1, 3));
    setError(""); // Clear any previous errors
  };

  const handlePreviousTab = () => {
    setActiveTab((prev) => Math.max(prev - 1, 0));
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
        "https://d482-34-90-195-197.ngrok-free.app/generate-image",
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
      setError("Failed to generate advertisement. Please try again.");
      setFinalImageReady(false);
    } finally {
      setLoading(false);
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

  const handleUpdateFinalAd = async () => {
    if (!adRef.current) return;

    try {
      setEditLoading(true);
      // Capture the canvas with overlaid text
      const finalCanvas = await html2canvas(adRef.current, { useCORS: true });
      const finalBase64Image = finalCanvas.toDataURL("image/png");

      // Capture the raw image (without text overlay)
      const rawImageElement = adRef.current.querySelector("img");
      const rawCanvas = await html2canvas(rawImageElement, { useCORS: true });
      const rawBase64Image = rawCanvas.toDataURL("image/png");

      const response = await fetch(`/api/advertisment/update-ad/${ad._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rawBase64Image,
          finalBase64Image,
          title,
          tagline,
          imagePrompt,
          textPrompt,
          overlayText,
          userId: currentUser._id,
          logo,
          date,
          time,
          location,
          website,
          facebook,
          instagram,
          linkedin,
          fontSize,
          taglineFontSize,
          textColor,
          fontStyle,
          fontWeight,
          fontFamily,
        }),
      });

      const result = await response.json();
      if (result.success) {
        setUploadSuccessMessage(result.message);
        setEditLoading(false);
      } else {
        setUploadErrorMessage(
          "Failed to upload advertisement. Please try again."
        );
        setEditLoading(false);
        throw new Error(result.message);
      }
    } catch (err) {
      console.error(err);
      setEditLoading(false);
      setError("Failed to upload advertisement. Please try again.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen flex flex-col">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 flex-grow">
        <div className="rounded-lg p-6 flex flex-col items-center">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full w-full min-h-[600px] text-gray-500">
              <Loader2Icon className="animate-spin w-12 h-12 mb-4 justify-center items-center" />
              <p className="text-center">Generating your advertisment...</p>
            </div>
          ) : !finalImageReady ? (
            <div className="flex flex-col items-center justify-center h-full w-full min-h-[600px] text-center text-gray-500">
              <ImageIcon size={64} className="mb-4" />
              <p className="text-center justify-center">
                Your generated advertisement will appear here
              </p>
            </div>
          ) : (
            <div ref={adRef} style={{ width, height }}>
              <div
                className="relative w-full h-full"
                style={{
                  fontFamily: `theme('fontFamily.${fontFamily
                    .toLowerCase()
                    .replace(/\s+/g, "-")}')`,
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
                <div
                  className="absolute inset-0 flex flex-col gap-10 p-12"
                  style={{
                    color: textColor,
                    fontFamily: fontFamily,
                    fontStyle: fontStyle,
                    fontWeight: fontWeight,
                  }}
                >
                  {logo && (
                    <div className="relative">
                      <img
                        src={logo}
                        alt="Logo"
                        className="absolute left-1/2 transform -translate-x-1/2 max-w-[100px] max-h-[100px]"
                      />
                    </div>
                  )}

                  {tagline && (
                    <div
                      style={{
                        fontSize: `${taglineFontSize}px`,
                        fontWeight: "bold",
                        textAlign: "center",
                        marginBottom: "10px",
                        marginTop: "80px",
                      }}
                    >
                      {tagline}
                    </div>
                  )}
                  <div
                    style={{
                      fontSize: `${fontSize}px`,
                      textAlign: "center",
                      alignSelf: "center",
                      justifySelf: "center",
                    }}
                  >
                    {overlayText}
                  </div>

                  <div className="flex flex-col gap-6">
                    <div className="flex flex-row justify-around items-center gap-4">
                      {date && (
                        <div className="flex items-center space-x-2">
                          <CalendarIcon className="w-5 h-5 " />
                          <p>{date}</p>
                        </div>
                      )}
                      {time && (
                        <div className="flex items-center space-x-2">
                          <ClockIcon className="w-5 h-5 " />
                          <p>{time}</p>
                        </div>
                      )}
                      {location && (
                        <div className="flex items-center space-x-2">
                          <MapPinIcon className="w-5 h-5" />
                          <p>{location}</p>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-row justify-around items-center gap-4">
                      {instagram && (
                        <div className="flex items-center space-x-2">
                          <FaInstagram className="w-5 h-5 text-pink-600" />
                          <p>{instagram}</p>
                        </div>
                      )}
                      {facebook && (
                        <div className="flex items-center space-x-2">
                          <FaFacebook className="w-5 h-5 text-blue-600" />
                          <p>{facebook}</p>
                        </div>
                      )}
                      {linkedin && (
                        <div className="flex items-center space-x-2">
                          <FaLinkedin className="w-5 h-5 text-blue-800" />
                          <p>{linkedin}</p>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-center items-center text-center">
                      {website && (
                        <div className="flex items-center space-x-2">
                          <Globe2Icon className="w-5 h-5 " />
                          <p>{website}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <Type className="mr-2" /> Edit Your Advertisement
          </h2>

          <div>
            <Tabs
              aria-label="Advertisement Creation Tabs"
              style={{ textDecoration: "underline" }}
              activeTab={activeTab}
              onTabChange={(tab) => setActiveTab(tab)}
            >
              {/* Basic Information Tab */}
              <Tabs.Item active title="Basic Info" icon={ImagePlus}>
                <div className="space-y-4">
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

                  <div className="flex justify-end space-x-2">
                    <Button
                      gradientDuoTone="purpleToBlue"
                      onClick={handleNextTab}
                    >
                      Next: Optional Elements
                    </Button>
                  </div>
                </div>
              </Tabs.Item>

              {/* Optional Elements Tab */}
              <Tabs.Item title="Optional Elements" icon={Upload}>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Logo Upload */}
                    <div className="space-y-2">
                      <Label className="text-gray-600">Logo</Label>
                      <FileInput
                        onChange={handleUploadLogo}
                        accept="image/*"
                        icon={LogoIcon}
                        className="w-full"
                        helperText="Upload your event or company logo (PNG, JPG)"
                      />
                    </div>

                    {/* Event Details Column */}
                    <div className="space-y-4">
                      {/* Date Input */}
                      <div>
                        <Label htmlFor="eventDate" className="text-gray-600">
                          Date
                        </Label>
                        <TextInput
                          type="date"
                          id="eventDate"
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                          name="date"
                          className="mt-1"
                          addon={
                            <CalendarIcon className="w-5 h-5 text-gray-500" />
                          }
                        />
                      </div>

                      {/* Time Input */}
                      <div>
                        <Label htmlFor="eventTime" className="text-gray-600">
                          Time
                        </Label>
                        <TextInput
                          type="time"
                          id="eventTime"
                          value={time}
                          onChange={(e) => setTime(e.target.value)}
                          name="time"
                          className="mt-1"
                          addon={
                            <ClockIcon className="w-5 h-5 text-gray-500" />
                          }
                        />
                      </div>

                      {/* Location Input */}
                      <div>
                        <Label
                          htmlFor="eventLocation"
                          className="text-gray-600"
                        >
                          Location
                        </Label>
                        <TextInput
                          type="text"
                          id="eventLocation"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          name="location"
                          placeholder="City, Venue, or Address"
                          className="mt-1"
                          addon={
                            <MapPinIcon className="w-5 h-5 text-gray-500" />
                          }
                        />
                      </div>
                    </div>
                  </div>

                  {/* Website and Social Media */}
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Website */}
                    <div>
                      <Label className="text-gray-600">Website</Label>
                      <TextInput
                        type="url"
                        name="website"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                        placeholder="https://www.yourwebsite.com"
                        className="mt-1"
                        addon={<Globe2Icon className="w-5 h-5 text-gray-500" />}
                      />
                    </div>

                    {/* Social Media Links */}
                    <div className="space-y-4">
                      <div>
                        <Label className="text-gray-600">Facebook</Label>
                        <TextInput
                          type="url"
                          name="socials.facebook"
                          value={facebook}
                          onChange={(e) => setFacebook(e.target.value)}
                          placeholder="Facebook Profile/Page URL"
                          className="mt-1"
                          addon={
                            <FaFacebook className="w-5 h-5 text-blue-600" />
                          }
                        />
                      </div>
                      <div>
                        <Label className="text-gray-600">Instagram</Label>
                        <TextInput
                          type="url"
                          name="socials.instagram"
                          value={instagram}
                          onChange={(e) => setInstagram(e.target.value)}
                          placeholder="Instagram Profile URL"
                          className="mt-1"
                          addon={
                            <FaInstagram className="w-5 h-5 text-pink-600" />
                          }
                        />
                      </div>
                      <div>
                        <Label className="text-gray-600">LinkedIn</Label>
                        <TextInput
                          type="url"
                          name="socials.linkedin"
                          value={linkedin}
                          onChange={(e) => setLinkedin(e.target.value)}
                          placeholder="LinkedIn Profile/Company URL"
                          className="mt-1"
                          addon={
                            <FaLinkedin className="w-5 h-5 text-blue-800" />
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between space-x-2">
                    <Button
                      gradientDuoTone="greenToBlue"
                      onClick={handlePreviousTab}
                    >
                      Previous: Basic Info
                    </Button>
                    <Button
                      gradientDuoTone="purpleToBlue"
                      onClick={handleNextTab}
                    >
                      Next: Styling
                    </Button>
                  </div>
                </div>
              </Tabs.Item>

              {/* Text Styling Tab */}
              <Tabs.Item title="Text Styling" icon={Palette}>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Font Family</Label>
                      <Select
                        value={fontFamily}
                        onChange={(e) => setFontFamily(e.target.value)}
                      >
                        {fontFamilies.map((font) => (
                          <option key={font} value={font}>
                            {font}
                          </option>
                        ))}
                      </Select>
                    </div>

                    <div>
                      <Label>Font Style</Label>
                      <Select
                        value={fontStyle}
                        onChange={(e) => setFontStyle(e.target.value)}
                        className="w-full"
                      >
                        {fontStyles.map((style) => (
                          <option key={style.value} value={style.value}>
                            {style.name}
                          </option>
                        ))}
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <Label>Font Weight</Label>
                      <Select
                        value={fontWeight}
                        onChange={(e) => setFontWeight(e.target.value)}
                        className="w-full"
                      >
                        {fontWeights.map((weight) => (
                          <option key={weight.value} value={weight.value}>
                            {weight.name}
                          </option>
                        ))}
                      </Select>
                    </div>

                    <div>
                      <Label>Text Font Size</Label>
                      <TextInput
                        type="number"
                        min="18"
                        max="30"
                        value={fontSize}
                        onChange={(e) => setFontSize(Number(e.target.value))}
                        placeholder="Main Text Font Size"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <Label>Tagline Font Size</Label>
                      <TextInput
                        type="number"
                        min="24"
                        max="48"
                        value={taglineFontSize}
                        onChange={(e) =>
                          setTaglineFontSize(Number(e.target.value))
                        }
                        placeholder="Tagline Font Size"
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Label>Color</Label>
                      <input
                        type="color"
                        value={textColor}
                        onChange={(e) => setTextColor(e.target.value)}
                        className="w-full h-10"
                      />
                    </div>
                  </div>

                  <div className="flex justify-between space-x-2 mt-4">
                    <Button
                      gradientDuoTone="greenToBlue"
                      onClick={handlePreviousTab}
                    >
                      Previous: Optional Elements
                    </Button>
                    <Button
                      gradientDuoTone="purpleToBlue"
                      onClick={handleNextTab}
                    >
                      Next: Review & Update
                    </Button>
                  </div>
                </div>
              </Tabs.Item>

              {/* Final Generation Tab */}
              <Tabs.Item title="Review & Update" icon={Upload}>
                <div className="flex flex-col space-y-4 mt-12">
                  <Button
                    gradientDuoTone="purpleToBlue"
                    onClick={handleGenerate}
                    disabled={loading}
                    className="mb-2"
                  >
                    {loading ? "Generating..." : "Generate Advertisement"}
                  </Button>
                  {error && (
                    <Alert color="failure" className="mt-4">
                      {error}
                    </Alert>
                  )}

                  {finalImageReady && (
                    <div className="space-y-4">
                      <Button
                        gradientDuoTone="greenToBlue"
                        onClick={handleUpdateFinalAd}
                        className="w-full"
                      >
                        {editLoading ? "Updating..." : "Update Advertisement"}
                      </Button>

                      {uploadSuccessMessage && (
                        <Alert color="success" className="mt-4">
                          {uploadSuccessMessage}
                        </Alert>
                      )}
                    </div>
                  )}
                </div>
              </Tabs.Item>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateAdvertisment;
