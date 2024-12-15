import React, { useState, useRef, useEffect } from "react";
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
  MapPinIcon,
  ClockIcon,
  CalendarIcon,
  Globe2Icon,
} from "lucide-react";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaLinkedinIn,
} from "react-icons/fa";
import { useParams } from "react-router-dom";

const UpdateAdvertisment = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [ad, setAd] = useState(null);
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
  // console.log("Error", error);

  const [logo, setLogo] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [website, setWebsite] = useState("");
  const [facebook, setFacebook] = useState("");
  const [instagram, setInstagram] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [imageOpacity, setImageOpacity] = useState(1);
  const adRef = useRef(null);

  const { adId } = useParams();
  console.log(adId);

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
        "https://8368-34-173-54-47.ngrok-free.app/generate-image",
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

  const handleUpdateFinalAd = async () => {
    if (!adRef.current) return;

    try {
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
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <div className="rounded-lg p-6 flex flex-col items-center ">
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
                <div className="absolute inset-0 flex flex-col gap-10 p-12">
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
                        color: textColor,
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
                      color: textColor,
                      fontSize: `${fontSize}px`,
                      fontWeight,
                      fontStyle,
                      fontFamily,
                      textAlign: "center",
                      alignSelf: "center",
                      justifySelf: "center",
                    }}
                  >
                    {overlayText}
                  </div>

                  <div className="flex flex-col gap-6">
                    {/* Event Details Section */}
                    <div className="flex flex-col gap-6">
                      {/* Event Details Section */}
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

                      {/* Social Media Links Section */}
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

                      {/* Website Section */}
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
            </div>
          )}
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <Type className="mr-2" /> Edit Your Advertisement
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

            <div className="mt-4 p-4  rounded-lg  shadow-sm border-2 border-gray-100">
              <h3 className="text-lg font-semibold mb-4 flex items-center ">
                Optional Elements
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Logo Upload */}
                <div className="space-y-2">
                  <Label className="text-gray-600">Logo</Label>
                  <div className="     rounded-lg p-4 hover:border-blue-500 transition-all">
                    <FileInput
                      onChange={handleUploadLogo}
                      accept="image/*"
                      icon={LogoIcon}
                      className="w-full"
                      helperText="Upload your event or company logo (PNG, JPG)"
                    />
                  </div>
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
                      color="gray"
                      addon={<CalendarIcon className="w-5 h-5 text-gray-500" />}
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
                      addon={<ClockIcon className="w-5 h-5 text-gray-500" />}
                    />
                  </div>

                  {/* Location Input */}
                  <div>
                    <Label htmlFor="eventLocation" className="text-gray-600">
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
                      addon={<MapPinIcon className="w-5 h-5 text-gray-500" />}
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
                      addon={<FaFacebook className="w-5 h-5 text-blue-600" />}
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
                      addon={<FaInstagram className="w-5 h-5 text-pink-600" />}
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
                      addon={<FaLinkedin className="w-5 h-5 text-blue-800" />}
                    />
                  </div>
                </div>
              </div>
            </div>

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
            {uploadSuccessMessage && (
              <Alert color="success">{uploadSuccessMessage}</Alert>
            )}

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
                  onClick={handleUpdateFinalAd}
                  className="flex-grow"
                >
                  Update Advertisement
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateAdvertisment;
