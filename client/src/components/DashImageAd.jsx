import { useState } from "react";
import { Button, TextInput, Label, Card, Spinner } from "flowbite-react";

const DashImageAd = () => {
  const [imagePrompt, setImagePrompt] = useState("");
  const [taglinePrompt, setTaglinePrompt] = useState("");
  const [generatedAd, setGeneratedAd] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGenerateAd = async (e) => {
    e.preventDefault();
    setLoading(true); // Show loading spinner
    try {
      const response = await fetch("/create-ad", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ imagePrompt, taglinePrompt }),
      });
      const data = await response.json();
      if (data.image) {
        setGeneratedAd(data.image); // Assuming image is a URL or base64
      }
    } catch (error) {
      console.error("Error generating ad:", error);
    } finally {
      setLoading(false); // Hide loading spinner
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-3/4 lg:w-1/2 bg-white shadow-md">
        <h2 className="text-2xl font-bold text-center mb-4">
          Generate Your Ad
        </h2>
        <form onSubmit={handleGenerateAd} className="space-y-4">
          <div>
            <Label htmlFor="imagePrompt" value="Image Prompt" />
            <TextInput
              id="imagePrompt"
              type="text"
              placeholder="Enter image prompt"
              value={imagePrompt}
              onChange={(e) => setImagePrompt(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="taglinePrompt" value="Tagline Prompt" />
            <TextInput
              id="taglinePrompt"
              type="text"
              placeholder="Enter tagline prompt"
              value={taglinePrompt}
              onChange={(e) => setTaglinePrompt(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full">
            {loading ? <Spinner size="sm" light={true} /> : "Generate Ad"}
          </Button>
        </form>
        {generatedAd && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-center">
              Your Generated Ad
            </h3>
            <img
              src={generatedAd}
              alt="Generated Ad"
              className="mt-4 w-full h-auto rounded-lg shadow-lg"
            />
          </div>
        )}
      </Card>
    </div>
  );
};

export default DashImageAd;
