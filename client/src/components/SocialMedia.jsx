import React, { useState, useEffect } from "react";
import {
  Button,
  Label,
  Textarea,
  FileInput,
  Select,
  Card,
  Alert,
  Spinner,
} from "flowbite-react";

// Custom Tabs Component
const CustomTabs = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div>
      <div className="flex space-x-4 border-b">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`px-4 py-2 ${
              activeTab === tab.id
                ? "border-b-2 border-blue-500 text-blue-500"
                : "text-gray-500"
            }`}
          >
            {tab.title}
          </button>
        ))}
      </div>
      <div className="mt-4">
        {tabs.find((tab) => tab.id === activeTab)?.content}
      </div>
    </div>
  );
};

export default function SocialMedia() {
  // Connection state
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Account states
  const [pages, setPages] = useState([]);
  const [instagramAccounts, setInstagramAccounts] = useState([]);
  console.log(instagramAccounts);
  const [selectedPage, setSelectedPage] = useState("");
  console.log(selectedPage);

  const [selectedInsta, setSelectedInsta] = useState("");

  // Content states
  const [caption, setCaption] = useState("");
  const [scheduledDate, setScheduledDate] = useState(new Date());
  console.log(caption);
  const [image, setImage] = useState(null);
  const [savedAds, setSavedAds] = useState([]);
  console.log(savedAds);
  const [selectedAd, setSelectedAd] = useState("");
  console.log(selectedAd.finalAd);

  // UI states
  const [response, setResponse] = useState({ message: "", type: "" });
  console.log(response);
  const [activeTab, setActiveTab] = useState("accounts");

  // Check connection status on component mount
  useEffect(() => {
    checkConnectionStatus();
  }, []);

  // Check if user is already connected to Facebook
  const checkConnectionStatus = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/facebook/check-connection-status");
      const data = await response.json();

      setIsConnected(data.isConnected);

      if (data.isConnected) {
        // Load connected accounts
        await fetchPages();
        await fetchInstagramAccounts();
        await fetchSavedAds();
      }
    } catch (err) {
      setResponse({
        message: "Failed to check connection status: " + err.message,
        type: "failure",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Authenticate with Facebook
  const handleAuthentication = () => {
    window.location.href = "http://localhost:5000/api/facebook/faceBookAuth";
  };

  // Fetch Facebook Pages
  const fetchPages = async () => {
    try {
      const response = await fetch("/api/facebook/get-pages");
      const data = await response.json();
      setPages(data);

      // Populate dropdown
      if (data.length > 0) {
        setSelectedPage(data[0].id);
      }
      return data;
    } catch (err) {
      setResponse({
        message: "Failed to fetch Facebook pages: " + err.message,
        type: "failure",
      });
      return [];
    }
  };

  // Fetch Instagram Accounts
  const fetchInstagramAccounts = async () => {
    try {
      const response = await fetch("/api/facebook/get-instagram-accounts");
      const data = await response.json();
      setInstagramAccounts(data.instagramDetails || []);

      // Populate dropdown
      if (data.instagramDetails && data.instagramDetails.length > 0) {
        setSelectedInsta(data.instagramDetails[0].instagram_account_id);
      }
      return data.instagramDetails || [];
    } catch (err) {
      setResponse({
        message: "Failed to fetch Instagram accounts: " + err.message,
        type: "failure",
      });
      return [];
    }
  };

  // Fetch saved ads from backend
  const fetchSavedAds = async () => {
    try {
      const response = await fetch("/api/advertisment/getAds");
      const data = await response.json();
      setSavedAds(data.savedAds);
      return data;
    } catch (err) {
      setResponse({
        message: "Failed to fetch saved ads: " + err.message,
        type: "failure",
      });
      return [];
    }
  };

  // Validate fields before posting
  const validatePostFields = () => {
    if (!caption || !image) {
      setResponse({
        message: "Please provide a caption and select an image.",
        type: "failure",
      });
      return false;
    }

    if (!selectedInsta && !selectedPage) {
      setResponse({
        message: "Please select either a Facebook page or Instagram account.",
        type: "failure",
      });
      return false;
    }

    return true;
  };

  // Post to Facebook
  const postToFacebook = async () => {
    if (!selectedPage) {
      setResponse({
        message: "Please select a Facebook page to post to.",
        type: "failure",
      });
      return;
    }

    if (!selectedAd) {
      setResponse({
        message: "Please select a saved ad to post to Facebook.",
        type: "failure",
      });
      return;
    }

    try {
      const response = await fetch("/api/facebook/fb-post-now", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pageId: selectedPage,
          message: caption,
          cloudinaryUrl: selectedAd.finalAd,
        }),
      });
      console.log(cloudinaryUrl);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to post to Facebook");
      }

      const data = await response.json();
      setResponse({
        message: `Successfully posted to Facebook! Post ID: ${data.postId}`,
        type: "success",
      });
    } catch (err) {
      setResponse({
        message: "Failed to post to Facebook: " + err.message,
        type: "failure",
      });
    }
  };

  const postToInstagram = async () => {};

  // Post to Both Platforms
  const postToBoth = async () => {
    if (!validatePostFields()) return;

    if (!selectedInsta || !selectedPage) {
      setResponse({
        message: "Please select both Instagram account and Facebook page.",
        type: "failure",
      });
      return;
    }

    // Facebook formData
    const facebookFormData = new FormData();
    facebookFormData.append("message", caption);
    facebookFormData.append("image", image);
    facebookFormData.append("pageId", selectedPage);

    // Instagram formData
    const instagramFormData = new FormData();
    instagramFormData.append("caption", caption);
    instagramFormData.append("image", image);
    instagramFormData.append("instagramAccountId", selectedInsta);

    try {
      // Post to Facebook first
      const fbResponse = await fetch("/api/facebook/fb-post-now", {
        method: "POST",
        body: facebookFormData,
      });

      if (!fbResponse.ok) {
        const errorData = await fbResponse.json();
        throw new Error(errorData.message || "Facebook post failed");
      }

      const fbData = await fbResponse.json();
      let successMessage = `Successfully posted to Facebook! Post ID: ${fbData.postId}`;

      // Then post to Instagram
      const instaResponse = await fetch("/api/instagram/post-now", {
        method: "POST",
        body: instagramFormData,
      });

      if (!instaResponse.ok) {
        const errorData = await instaResponse.json();
        throw new Error(errorData.message || "Instagram post failed");
      }

      const instaData = await instaResponse.json();
      successMessage += `\nSuccessfully posted to Instagram! Post ID: ${instaData.postId}`;

      setResponse({
        message: successMessage,
        type: "success",
      });
    } catch (err) {
      setResponse({
        message: `Posting failed: ${err.message}`,
        type: "failure",
      });
    }
  };

  // Schedule post
  const schedulePost = async () => {
    if (!selectedPage || !selectedInsta) {
      setResponse({
        message: "Please select at least one platform to post to.",
        type: "failure",
      });
      return;
    }
    try {
      const response = await fetch("/api/facebook/fb-schedule-post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pageId: selectedPage,
          message: caption,
          cloudinaryUrl: selectedAd.finalAd,
          scheduledTime: scheduledDate,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to schedule post");
      }

      const data = await response.json();
      setResponse({
        message: `Successfully scheduled the post! Post ID: ${data.postId}`,
        type: "success",
      });
    } catch (err) {
      setResponse({
        message: "Failed to schedule post: " + err.message,
        type: "failure",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64 mx-auto ">
        <Spinner size="xl" />
        <span className="ml-2">Loading connection status...</span>
      </div>
    );
  }

  // Define tabs for CustomTabs component
  const tabs = [
    {
      id: "accounts",
      title: "Accounts",
      content: (
        <Card className="mb-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Connected Accounts</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">Facebook Pages</h3>
              {pages.length > 0 ? (
                <ul className="space-y-2">
                  {pages.map((page) => (
                    <li key={page.id} className="p-2 border rounded">
                      <div className="font-medium">{page.name}</div>
                      <div className="text-sm text-gray-500">ID: {page.id}</div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No Facebook pages found.</p>
              )}
            </div>

            <div>
              <h3 className="font-semibold mb-2">Instagram Accounts</h3>
              {instagramAccounts.length > 0 ? (
                <ul className="space-y-2">
                  {instagramAccounts.map((account) => (
                    <li
                      key={account.instagram_account_id}
                      className="p-2 border rounded"
                    >
                      <div className="font-medium">{account.username}</div>
                      <div className="text-sm text-gray-500">
                        Followers: {account.followers_count}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No Instagram accounts found.</p>
              )}
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <Button onClick={fetchPages} color="blue" size="sm">
              Refresh Facebook Pages
            </Button>
            <Button onClick={fetchInstagramAccounts} color="purple" size="sm">
              Refresh Instagram Accounts
            </Button>
          </div>
        </Card>
      ),
    },
    {
      id: "savedAds",
      title: "Saved Ads",
      content: (
        <Card className="mb-4">
          <h2 className="text-xl font-semibold mb-4">Saved Ad Templates</h2>

          <Button
            onClick={fetchSavedAds}
            color="light"
            size="sm"
            className="mb-4"
          >
            Refresh Saved Ads
          </Button>

          {savedAds.length > 0 ? (
            <div className="space-y-4">
              {savedAds.map((ad) => (
                <div key={ad.id} className="p-3 border rounded">
                  <div className="flex justify-between">
                    <h3 className="font-medium">{ad.title || "Untitled Ad"}</h3>
                    <Button
                      size="xs"
                      color="light"
                      onClick={() => {
                        setSelectedAd(ad);
                        setActiveTab("createPost");
                      }}
                    >
                      Load
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No saved advertisements found.</p>
          )}
        </Card>
      ),
    },
    {
      id: "createPost",
      title: "Create Post",
      content: (
        <Card className="mb-4">
          <h2 className="text-xl font-semibold mb-4">Create New Post</h2>

          <div className="mb-4">
            <div className="mb-2 block">
              <Label htmlFor="savedAds" value="Load from Saved Ad:" />
            </div>
            <Select
              id="savedAds"
              value={selectedAd.title}
              onChange={(e) => setSelectedAd(e.target.value)}
            >
              <option value="">-- Select a saved ad --</option>
              {savedAds.map((ad) => (
                <option key={ad.id} value={ad.id}>
                  {ad.title || ad.caption.substring(0, 30) + "..."}
                </option>
              ))}
            </Select>
          </div>

          <div className="mb-4">
            <div className="mb-2 block">
              <Label htmlFor="caption" value="Caption:" />
            </div>
            <Textarea
              id="caption"
              placeholder="Enter your caption"
              rows={4}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <div className="mb-2 block">
                <Label
                  htmlFor="pagesDropdown"
                  value="Select a Facebook Page:"
                />
              </div>
              <Select
                id="pagesDropdown"
                value={selectedPage}
                onChange={(e) => setSelectedPage(e.target.value)}
              >
                <option value="">-- Select a page --</option>
                {pages.map((page) => (
                  <option key={page.id} value={page.id}>
                    {page.name}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <div className="mb-2 block">
                <Label
                  htmlFor="instagramDropdown"
                  value="Select an Instagram Account:"
                />
              </div>
              <Select
                id="instagramDropdown"
                value={selectedInsta}
                onChange={(e) => setSelectedInsta(e.target.value)}
              >
                <option value="">-- Select an account --</option>
                {instagramAccounts.map((account) => (
                  <option
                    key={account.instagram_account_id}
                    value={account.instagram_account_id}
                  >
                    {account.username} (Followers: {account.followers_count})
                  </option>
                ))}
              </Select>
            </div>
          </div>

          <div className="mb-4">
            <div className="mb-2 block">
              <Label
                htmlFor="scheduleDate"
                value="Schedule Date/Time (optional):"
              />
            </div>
            <input
              id="scheduleDate"
              type="datetime-local"
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
              className="w-full px-3 py-2 border rounded"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            <Button color="purple" onClick={postToInstagram}>
              Post to Instagram
            </Button>
            <Button color="blue" onClick={postToFacebook}>
              Post to Facebook
            </Button>
            <Button color="green" onClick={postToBoth}>
              Post to Both
            </Button>
            <Button color="dark" onClick={schedulePost}>
              Schedule Post
            </Button>
          </div>
        </Card>
      ),
    },
  ];

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Social Media Manager</h1>

      {!isConnected ? (
        <Card className="mb-4">
          <h2 className="text-xl font-semibold mb-4">
            Connect Your Social Media Accounts
          </h2>
          <p className="mb-4">
            You need to authenticate with Facebook to manage your pages and
            Instagram accounts.
          </p>
          <Button onClick={handleAuthentication} color="blue">
            Connect with Facebook
          </Button>
        </Card>
      ) : (
        <div>
          <CustomTabs
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </div>
      )}

      {/* Response */}
      {response.message && (
        <Alert
          color={response.type === "success" ? "success" : "failure"}
          className="mt-4"
        >
          <span className="font-medium">{response.message}</span>
        </Alert>
      )}
    </div>
  );
}
