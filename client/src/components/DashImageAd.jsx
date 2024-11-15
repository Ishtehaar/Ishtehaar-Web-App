import React, { useState } from 'react';
import { Button, TextInput, Spinner, Alert } from 'flowbite-react';

const DashImageAd = () => {
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');  // Clear any previous errors
    setLoading(true);  // Show loading spinner

    try {
      const response = await fetch('/api/image/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate image');
      }

      const data = await response.json();
      setImage(data.image);
    } catch (err) {
      setError('Failed to generate image. Please try again.');
    } finally {
      setLoading(false);  // Hide loading spinner
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-white mb-4 text-center">Generate Image</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <TextInput
            id="prompt"
            type="text"
            placeholder="Enter prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            required
            className="bg-gray-700 text-white"
          />

          <Button type="submit" gradientDuoTone="purpleToBlue" disabled={loading} fullSized>
            {loading ? <Spinner aria-label="Loading spinner" /> : 'Generate'}
          </Button>
        </form>

        {error && (
          <Alert color="failure" className="mt-4">
            <span>{error}</span>
          </Alert>
        )}

        {image && (
          <div className="mt-6">
            <h3 className="text-white text-lg mb-2">Generated Image:</h3>
            <img
              src={`data:image/png;base64,${image}`}
              alt="Generated result"
              className="w-full h-auto rounded-lg"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default DashImageAd;
