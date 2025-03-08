import React, { useState, useEffect } from "react";
import {
  Button,
  Label,
  Textarea,
  Select,
  Card,
  Alert,
  Spinner,
  Avatar,
  Badge,
  Toast,
  Tooltip,
} from "flowbite-react";
import {
  HiCheck,
  HiX,
  HiRefresh,
  HiOutlineCalendar,
  HiOutlinePhotograph,
  HiOutlinePaperAirplane,
  HiInformationCircle,
  HiOutlineLightningBolt,
  HiOutlineGlobe,
  HiOutlineChartBar,
} from "react-icons/hi";

export default function SocialMedia() {
  // Connection state
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isPosting, setIsPosting] = useState(false);

  // Account states
  const [pages, setPages] = useState([]);
  const [instagramAccounts, setInstagramAccounts] = useState([]);
  const [selectedPage, setSelectedPage] = useState("");
  const [selectedInsta, setSelectedInsta] = useState("");

  // Content states
  const [caption, setCaption] = useState("");
  const [scheduledDate, setScheduledDate] = useState(
    new Date(Date.now() + 86400000).toISOString().slice(0, 16) // Default to tomorrow
  );
  const [savedAds, setSavedAds] = useState([]);
  const [selectedAd, setSelectedAd] = useState("");

  // Replace tabs with simple state
  const [activeSection, setActiveSection] = useState("accounts");

  // Notification states
  const [notifications, setNotifications] = useState([]);
  const [response, setResponse] = useState({ message: "", type: "" });

  // Module information
  const moduleInfo = {
    title: "Ishtehaar's Social Media Manager",
    description:
      "Streamline your social media marketing by connecting, scheduling, and posting to Facebook and Instagram directly from Ishtehaar.",
    features: [
      {
        icon: <HiOutlineGlobe className="h-6 w-6 text-blue-500" />,
        title: "Multi-Platform Publishing",
        description:
          "Post to Facebook and Instagram simultaneously with consistent messaging.",
      },
      {
        icon: <HiOutlineCalendar className="h-6 w-6 text-green-500" />,
        title: "Smart Scheduling",
        description:
          "Schedule posts for optimal times when your audience is most active.",
      },
      {
        icon: <HiOutlinePhotograph className="h-6 w-6 text-purple-500" />,
        title: "Saved Ads Posting",
        description:
          "Use your saved advertisements generated by Ishtehaar's Visual Ad Creation feature and post it on socials with one click.",
      },
      {
        icon: <HiOutlineChartBar className="h-6 w-6 text-orange-500" />,
        title: "Account Management",
        description:
          "Manage multiple Facebook pages and Instagram accounts from one dashboard.",
      },
    ],
  };

  // Check connection status on component mount
  useEffect(() => {
    checkConnectionStatus();
  }, []);

  // Add notification
  const addNotification = (message, type = "info") => {
    const id = Date.now();
    setNotifications([...notifications, { id, message, type }]);
    // Auto remove after 5 seconds
    setTimeout(() => {
      setNotifications((notifications) =>
        notifications.filter((n) => n.id !== id)
      );
    }, 5000);
  };

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
        addNotification(
          "Successfully connected to social media accounts",
          "success"
        );
      }
    } catch (err) {
      setResponse({
        message: "Failed to check connection status: " + err.message,
        type: "failure",
      });
      addNotification("Connection check failed", "error");
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
      addNotification("Failed to fetch Facebook pages", "error");
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
      addNotification("Failed to fetch Instagram accounts", "error");
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
      addNotification("Failed to fetch saved ads", "error");
      return [];
    }
  };

  // Validate fields before posting
  const validatePostFields = (platform) => {
    if (!caption.trim()) {
      setResponse({
        message: "Please provide a caption for your post.",
        type: "failure",
      });
      return false;
    }

    if (!selectedAd || !selectedAd.finalAd) {
      setResponse({
        message: "Please select an advertisement to post.",
        type: "failure",
      });
      return false;
    }

    if (platform === "facebook" && !selectedPage) {
      setResponse({
        message: "Please select a Facebook page to post to.",
        type: "failure",
      });
      return false;
    }

    if (platform === "instagram" && !selectedInsta) {
      setResponse({
        message: "Please select an Instagram account to post to.",
        type: "failure",
      });
      return false;
    }

    if (platform === "both" && (!selectedPage || !selectedInsta)) {
      setResponse({
        message:
          "Please select both Facebook page and Instagram account to post to both platforms.",
        type: "failure",
      });
      return false;
    }

    return true;
  };

  // Post to Facebook
  const postToFacebook = async () => {
    if (!validatePostFields("facebook")) return;

    setIsPosting(true);
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

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to post to Facebook");
      }

      const data = await response.json();
      setResponse({
        message: `Successfully posted to Facebook! Post ID: ${data.postId}`,
        type: "success",
      });
      addNotification("Successfully posted to Facebook", "success");
    } catch (err) {
      setResponse({
        message: "Failed to post to Facebook: " + err.message,
        type: "failure",
      });
      addNotification("Failed to post to Facebook", "error");
    } finally {
      setIsPosting(false);
    }
  };

  // Post to Instagram
  const postToInstagram = async () => {
    if (!validatePostFields("instagram")) return;

    setIsPosting(true);
    try {
      const response = await fetch("/api/facebook/insta-post-now", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          instagramAccountId: selectedInsta,
          caption: caption,
          cloudinaryUrl: selectedAd.finalAd,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || errorData.details || "Failed to post to Instagram"
        );
      }

      const data = await response.json();
      setResponse({
        message: "Successfully posted to Instagram!",
        type: "success",
        data: data,
      });
      addNotification("Successfully posted to Instagram", "success");
    } catch (err) {
      setResponse({
        message: "Failed to post to Instagram: " + err.message,
        type: "failure",
      });
      addNotification("Failed to post to Instagram", "error");
    } finally {
      setIsPosting(false);
    }
  };

  // Post to Both Platforms
  const postToBoth = async () => {
    if (!validatePostFields("both")) return;

    setIsPosting(true);
    try {
      const response = await fetch("/api/facebook/post-to-both", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          caption: caption,
          message: caption,
          cloudinaryUrl: selectedAd.finalAd,
          pageId: selectedPage,
          instagramAccountId: selectedInsta,
        }),
      });

      const data = await response.json();

      if (response.status === 200) {
        setResponse({
          message: "Successfully posted to both platforms!",
          type: "success",
        });
        addNotification("Successfully posted to both platforms", "success");
      } else if (response.status === 207) {
        setResponse({
          message: `Partial success: ${
            data.message || "Posted on one platform only"
          }`,
          type: "warning",
        });
        addNotification("Partially posted - check details", "warning");
      } else {
        setResponse({
          message: data.message || "Failed to post to both platforms",
          type: "failure",
        });
        addNotification("Failed to post to both platforms", "error");
      }
    } catch (err) {
      setResponse({
        message: `Posting failed: ${err.message}`,
        type: "failure",
      });
      addNotification("Failed to post to both platforms", "error");
    } finally {
      setIsPosting(false);
    }
  };

  // Schedule post
  const scheduleFbPost = async () => {
    if (!validatePostFields("facebook")) return;

    // Validate date
    const scheduleTime = new Date(scheduledDate);
    if (scheduleTime <= new Date()) {
      setResponse({
        message: "Please select a future date and time for scheduling.",
        type: "failure",
      });
      return;
    }

    setIsPosting(true);
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
        message: `Successfully scheduled the post for ${new Date(
          scheduledDate
        ).toLocaleString()}`,
        type: "success",
      });
      addNotification("Post scheduled successfully", "success");
    } catch (err) {
      setResponse({
        message: "Failed to schedule post: " + err.message,
        type: "failure",
      });
      addNotification("Failed to schedule post", "error");
    } finally {
      setIsPosting(false);
    }
  };

  // Render the connected accounts section
  const renderAccountsSection = () => (
    <div className="rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold ">Facebook Pages</h3>
            <Button
              onClick={fetchPages}
              color="light"
              size="xs"
              className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100"
            >
              <HiRefresh className="h-4 w-4" />
              Refresh
            </Button>
          </div>

          {pages.length > 0 ? (
            <div className="space-y-3">
              {pages.map((page) => (
                <div
                  key={page.id}
                  className="p-4 border border-gray-200 rounded-lg  transition-colors"
                >
                  <div className="flex items-center">
                    <div className="h-10 w-10 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center mr-4">
                      <span className="text-white font-medium">
                        {page.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium ">{page.name}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 bg-gray-50 rounded-lg text-center">
              <p className="text-gray-500">No Facebook pages found.</p>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold ">Instagram Accounts</h3>
            <Button
              onClick={fetchInstagramAccounts}
              color="light"
              size="xs"
              className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100"
            >
              <HiRefresh className="h-4 w-4" />
              Refresh
            </Button>
          </div>

          {instagramAccounts.length > 0 ? (
            <div className="space-y-3">
              {instagramAccounts.map((account) => (
                <div
                  key={account.instagram_account_id}
                  className="p-4 border border-gray-200 rounded-lg  transition-colors"
                >
                  <div className="flex items-center">
                    <div className="h-10 w-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center mr-4">
                      <span className="text-white font-medium">
                        {account.username.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium ">@{account.username}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 bg-gray-50 rounded-lg text-center">
              <p className="text-gray-500">No Instagram accounts found.</p>
            </div>
          )}
        </div>
      </div>

      {pages.length === 0 && instagramAccounts.length === 0 && (
        <div className="mt-6 p-6 bg-purple-50 rounded-lg text-center">
          <p className="text-purple-700">
            Switch to Create Post tab to compose new content for your social
            media platforms.
          </p>
        </div>
      )}
    </div>
  );

  // Render the saved ads section
  const renderSavedAdsSection = () => (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Saved Advertisements</h2>
        <Button
          onClick={fetchSavedAds}
          color="light"
          size="xs"
          className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100"
        >
          <HiRefresh className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      {savedAds.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 justify-between">
          {savedAds.map((ad) => (
            <div
              key={ad.id}
              className="max-w-sm max-h border border-gray-200 rounded-lg shadow"
            >
              {ad.finalAd && (
                <img
                  className="rounded-t-lg w-full h-54 object-cover"
                  src={ad.finalAd}
                  alt={ad.title || "Advertisement"}
                />
              )}
              <div className="p-5">
                <h5 className="mb-4 text-xl font-bold tracking-tight text-center">
                  {ad.title || "Untitled Ad"}
                </h5>
                <div className="flex justify-center">
                  <Button
                    onClick={() => {
                      setSelectedAd(ad);
                      setCaption(ad.caption || "");
                      setActiveSection("createPost");
                    }}
                    gradientDuoTone="purpleToBlue"
                    size="xs"
                    className="text-sm"
                  >
                    Post Now
                    <svg
                      className="w-3.5 h-3.5 ml-2"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 14 10"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M1 5h12m0 0L9 1m4 4L9 9"
                      />
                    </svg>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center p-8  rounded-lg">
          <svg
            className="mx-auto mb-4 w-12 h-12 text-gray-500"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 20"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
          <h3 className="mb-2 text-lg font-medium ">
            No saved advertisements found.
          </h3>
          <p className="text-gray-500">
            Create new ads in Visual Ad Creation section.
          </p>
        </div>
      )}
    </div>
  );

  // Render the create post section
  const renderCreatePostSection = () => (
    <div className="rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold mb-6">
        Create New Social Media Post
      </h3>

      <div className="space-y-6">
        <div>
          <div className="mb-2">
            <Label htmlFor="caption" value="Post Caption:" />
          </div>
          <Textarea
            id="caption"
            placeholder="Enter your post caption..."
            rows={3}
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            required
            helperText="Add hashtags and @mentions as needed"
            className="w-full"
          />
        </div>

        {selectedAd && selectedAd.finalAd && (
          <div className="p-4 border border-gray-200 rounded-lg">
            <Label value="Selected Advertisement:" />
            <div className="text-center">
              <img
                src={selectedAd.finalAd}
                alt="Selected ad"
                className="max-h-48 mx-auto object-contain rounded"
              />
              <p className="mt-3 text-sm ">
                {selectedAd.title || "Untitled Ad"}
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="mb-2">
              <Label htmlFor="pagesDropdown" value="Select Facebook Page:" />
            </div>
            <Select
              id="pagesDropdown"
              value={selectedPage}
              onChange={(e) => setSelectedPage(e.target.value)}
              className="w-full"
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
            <div className="mb-2">
              <Label
                htmlFor="instagramDropdown"
                value="Select Instagram Account:"
              />
            </div>
            <Select
              id="instagramDropdown"
              value={selectedInsta}
              onChange={(e) => setSelectedInsta(e.target.value)}
              className="w-full"
            >
              <option value="">-- Select an account --</option>
              {instagramAccounts.map((account) => (
                <option
                  key={account.instagram_account_id}
                  value={account.instagram_account_id}
                >
                  @{account.username} (
                  {account.followers_count.toLocaleString()} followers)
                </option>
              ))}
            </Select>
          </div>
        </div>

        <div>
          <div className="mb-2">
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
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-transparent"
            min={new Date().toISOString().slice(0, 16)}
          />
          <p className="text-xs text-gray-500 mt-1">
            Schedule must be at least 10 minutes in the future
          </p>
        </div>

        <div className="flex flex-wrap justify-between gap-4">
          <Tooltip content="Publish content to Instagram">
            <Button
              color="purple"
              onClick={postToInstagram}
              disabled={isPosting}
              gradientDuoTone="purpleToPink"
              className="flex-1 px-2 font-medium rounded-lg transition-all duration-200 hover:shadow-md"
            >
              {isPosting ? (
                <Spinner size="sm" className="mr-2" />
              ) : (
                <svg
                  className="w-5 h-5 mr-2 inline"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
              Publish to Instagram
            </Button>
          </Tooltip>

          <Tooltip content="Publish content to Facebook">
            <Button
              color="blue"
              onClick={postToFacebook}
              disabled={isPosting}
              gradientDuoTone="purpleToBlue"
              className="flex-1 px-2 font-medium rounded-lg transition-all duration-200 hover:shadow-md"
            >
              {isPosting ? (
                <Spinner size="sm" className="mr-2" />
              ) : (
                <svg
                  className="w-5 h-5 mr-2 inline"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
              Publish to Facebook
            </Button>
          </Tooltip>

          <Tooltip content="Publish to multiple platforms simultaneously">
            <Button
              color="green"
              onClick={postToBoth}
              disabled={isPosting}
              gradientDuoTone="greenToBlue"
              className="flex-1 px-2 font-medium rounded-lg transition-all duration-200 hover:shadow-md"
            >
              {isPosting ? (
                <Spinner size="sm" className="mr-2" />
              ) : (
                <svg
                  className="w-5 h-5 mr-2 inline"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                  />
                </svg>
              )}
              Multi-platform Publish
            </Button>
          </Tooltip>

          <Tooltip content="Schedule publication for a later time">
            <Button
              color="dark"
              onClick={scheduleFbPost}
              disabled={isPosting}
              gradientDuoTone="purpleToPink"
              className="flex-1 px-2 font-medium rounded-lg transition-all duration-200 hover:shadow-md"
            >
              {isPosting ? (
                <Spinner size="sm" className="mr-2" />
              ) : (
                <svg
                  className="w-5 h-5 mr-2 inline"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              )}
              Schedule Publication
            </Button>
          </Tooltip>
        </div>
      </div>
    </div>
  );

  // Render the welcome/intro section
  const renderWelcomeScreen = () => (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <div className="inline-flex justify-center items-center w-16 h-16 rounded-full mb-4">
          <HiOutlineLightningBolt className="h-8 w-8 text-purple-600" />
        </div>
        <h1 className="text-3xl font-bold mb-3">{moduleInfo.title}</h1>
        <p className="text-md text-gray-500 max-w-2xl mx-auto">
          {moduleInfo.description}
        </p>
      </div>

      {/* Center the button first, before the features grid */}
      <div className="flex justify-center mb-10">
        <Button
          onClick={handleAuthentication}
          gradientDuoTone="purpleToBlue"
          size="lg"
          className="px-6 py-1 font-medium"
        >
          <span className="mr-2">Connect with Facebook</span>
          <svg
            className="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
              clipRule="evenodd"
            />
          </svg>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {moduleInfo.features.map((feature, index) => (
          <div
            key={index}
            className="p-6 border rounded-lg transition-all hover:shadow-md"
          >
            <div className="mb-3">{feature.icon}</div>
            <h3 className="text-md font-semibold mb-2">{feature.title}</h3>
            <p className="text-sm text-gray-500">{feature.description}</p>
          </div>
        ))}
      </div>

      <div className="rounded-lg shadow-md border border-purple-100 p-6 mb-8">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">
            Connect Your Social Media Accounts
          </h2>
          <div className="mb-6 text-gray-500 max-w-2xl mx-auto">
            <p className="mb-4">
              Authenticate with Facebook to manage your business pages and
              Instagram professional accounts. This connection allows Ishtehaar
              to:
            </p>
            <ul className="text-left space-y-2 mb-5 mx-auto max-w-md text-sm">
              <li className="flex items-start">
                <HiCheck className="text-green-500 h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                <span>
                  Access your connected Facebook Pages and Instagram
                  Professional accounts
                </span>
              </li>
              <li className="flex items-start">
                <HiCheck className="text-green-500 h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                <span>Create and schedule posts on your behalf</span>
              </li>
              <li className="flex items-start">
                <HiCheck className="text-green-500 h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                <span>Upload media content to your accounts</span>
              </li>
              <li className="flex items-start">
                <HiCheck className="text-green-500 h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                <span>Integrate with your ad templates from Ishtehaar</span>
              </li>
            </ul>
            <p className="text-md text-gray-500 mt-3">
              Your login is secure and follows Facebook's authentication
              protocols. Ishtehaar only requests the permissions needed for its
              functionality.
            </p>
          </div>

          {/* Removed the button from here since we've moved it above */}
        </div>
      </div>
    </div>
  );
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 mx-auto">
        <Spinner size="xl" />
        <p className="mt-4 text-gray-500">
          Connecting to social media accounts...
        </p>
      </div>
    );
  }

  return (
    <div className="container px-4 py-8 mx-auto max-w-7xl">
      {!isConnected ? (
        renderWelcomeScreen()
      ) : (
        <>
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <div className="text-centre">
              <h1 className="text-2xl font-bold mb-2">{moduleInfo.title}</h1>
              <p className="text-gray-500    max-w-2xl">
                Connected and ready to publish to your social platforms.
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center space-x-2 ">
              <Button
                onClick={handleAuthentication}
                gradientDuoTone="purpleToPink"
                size="sm"
                className="text-sm"
              >
                <HiRefresh className="mr-1 h-4 w-4" />
                Reconnect
              </Button>
            </div>
          </div>

          <div className="mb-6 flex flex-wrap gap-3 border-b ">
            <button
              onClick={() => setActiveSection("accounts")}
              className={`px-4 py-2 font-medium text-sm rounded-t-lg ${
                activeSection === "accounts"
                  ? " text-purple-700 border-b-2 border-purple-500"
                  : "text-gray-500 hover:text-purple-600"
              }`}
            >
              Connected Accounts
            </button>
            <button
              onClick={() => setActiveSection("savedAds")}
              className={`px-4 py-2 font-medium text-sm rounded-t-lg ${
                activeSection === "savedAds"
                  ? " text-purple-700 border-b-2 border-purple-500"
                  : "text-gray-500 hover:text-purple-600"
              }`}
            >
              Saved Advertisments
            </button>
            <button
              onClick={() => setActiveSection("createPost")}
              className={`px-4 py-2 font-medium text-sm rounded-t-lg ${
                activeSection === "createPost"
                  ? " text-purple-700 border-b-2 border-purple-500"
                  : "text-gray-500 hover:text-purple-600"
              }`}
            >
              Create New Post
            </button>
          </div>

          {activeSection === "accounts" && renderAccountsSection()}
          {activeSection === "savedAds" && renderSavedAdsSection()}
          {activeSection === "createPost" && renderCreatePostSection()}
        </>
      )}

      {/* Toast notifications */}
      <div className="fixed bottom-4 right-4 z-50 space-y-2">
        {notifications.map((notification) => (
          <Toast key={notification.id}>
            <div
              className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                notification.type === "success"
                  ? "bg-green-100 text-green-500"
                  : notification.type === "error"
                  ? "bg-red-100 text-red-500"
                  : notification.type === "warning"
                  ? "bg-yellow-100 text-yellow-500"
                  : "bg-blue-100 text-blue-500"
              }`}
            >
              {notification.type === "success" && (
                <HiCheck className="h-5 w-5" />
              )}
              {notification.type === "error" && <HiX className="h-5 w-5" />}
              {notification.type === "warning" && (
                <HiInformationCircle className="h-5 w-5" />
              )}
              {notification.type === "info" && (
                <HiInformationCircle className="h-5 w-5" />
              )}
            </div>
            <div className="ml-3 text-sm font-normal">
              {notification.message}
            </div>
            <Toast.Toggle />
          </Toast>
        ))}
      </div>
      {/* Display response message if any */}
      {response.message && (
        <Alert
          color={response.type}
          className="mb-4"
          onDismiss={() => setResponse({ message: "", type: "" })}
        >
          <div className="flex items-center gap-3">
            {response.type === "success" && <HiCheck className="h-5 w-5" />}
            {response.type === "failure" && <HiX className="h-5 w-5" />}
            {response.type === "warning" && (
              <HiInformationCircle className="h-5 w-5" />
            )}
            <span>{response.message}</span>
          </div>
        </Alert>
      )}
    </div>
  );
}
