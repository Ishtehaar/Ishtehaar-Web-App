import * as dotenv from "dotenv";
import cloudinary from "cloudinary";
import https from "https";
import axios from "axios";
import stream from "stream";
import FormData from "form-data";
import { errorHandler } from "../utils/error.js";
import User from "../models/user.model.js";

dotenv.config();
cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const FB_appId = process.env.FACEBOOK_APP_ID;
const FB_appSecret = process.env.FACEBOOK_APP_SECRET;
const FB_redirectUri = "http://localhost:5000/api/facebook/callback";
const scopes =
  "email,public_profile,pages_show_list,pages_manage_posts,pages_read_engagement,pages_manage_engagement,pages_read_user_content,business_management,instagram_manage_insights";

export const faceBookAuth = async (req, res) => {
  const authUrl = `https://www.facebook.com/dialog/oauth?client_id=${FB_appId}&redirect_uri=${FB_redirectUri}&scope=${scopes}`;
  res.redirect(authUrl);
};

export const faceBookCallback = async (req, res) => {
  if (req.query.error_reason) return res.send(req.query.error_reason);
  if (req.query.code) {
    const loginCode = req.query.code;

    const tokenUrl = `https://graph.facebook.com/v22.0/oauth/access_token?client_id=${FB_appId}&redirect_uri=${FB_redirectUri}&client_secret=${FB_appSecret}&code=${loginCode}`;

    https.get(tokenUrl, (response) => {
      let data = "";
      response.on("data", (chunk) => (data += chunk));
      response.on("end", () => {
        const tokenData = JSON.parse(data);
        if (tokenData.error) return res.send(tokenData.error.message);

        req.session.access_token = tokenData.access_token;
        // res.json({
        //     message: "Successfully authenticated with Facebook!",
        //     access_token: tokenData.access_token,
        //   });
        console.log("Successfully authenticated with Facebook!");
        res.redirect("http://localhost:5173/dashboard?tab=social-media");
      });
    });
  }
};

export const getPages = async (req, res) => {
  const userAccessToken = req.session.access_token;
  if (!userAccessToken) return res.status(401).send("User is not logged in.");

  try {
    const response = await axios.get(
      "https://graph.facebook.com/v22.0/me/accounts",
      { params: { access_token: userAccessToken } }
    );

    const pages = response.data.data.map((page) => ({
      id: page.id,
      name: page.name,
    }));
    console.log(pages);

    res.json(pages);
  } catch (error) {
    console.error(
      "Error fetching pages:",
      error.response?.data || error.message
    );
    res.status(500).send("Error fetching pages.");
  }
};

export const getInstagramAccounts = async (req, res) => {
  const userAccessToken = req.session.access_token;

  if (!userAccessToken) {
    return res.status(401).json({ error: "User is not authenticated." });
  }

  try {
    // Step 1: Fetch user's pages
    const pagesResponse = await axios.get(
      "https://graph.facebook.com/v22.0/me/accounts",
      { params: { access_token: userAccessToken } }
    );
    const pages = pagesResponse.data.data.map((page) => ({
      id: page.id,
      name: page.name,
      access_token: page.access_token,
    }));
    console.log("ncildnc", pages);

    const instagramDetails = [];

    // Step 2: Fetch Instagram account details for each connected page
    for (const page of pages) {
      try {
        const igResponse = await axios.get(
          `https://graph.facebook.com/v22.0/${page.id}`, // Fix: Use `page.id` instead of `pages.id`
          {
            params: {
              fields: "instagram_business_account",
              access_token: page.access_token, // Ensure page access token is used
            },
          }
        );
        //console.log(igResponse);

        const igAccountId = igResponse.data.instagram_business_account?.id;
        if (!igAccountId) {
          console.log(`No Instagram account linked to page ${page.name}`);
          continue; // Skip pages without an Instagram business account
        }

        console.log(
          `Fetching details for Instagram Account ID: ${igAccountId}`
        );

        // Step 3: Fetch Instagram account details using the IG account ID
        const igAccountDetailsResponse = await axios.get(
          `https://graph.facebook.com/v22.0/${igAccountId}`,
          {
            params: {
              fields: "username,followers_count,media_count,name,biography",
              access_token: page.access_token, // Ensure the correct token is used
            },
          }
        );

        const accountDetails = igAccountDetailsResponse.data;

        instagramDetails.push({
          instagram_account_id: igAccountId,
          username: accountDetails.username,
          followers_count: accountDetails.followers_count,
          media_count: accountDetails.media_count,
          name: accountDetails.name,
          bio: accountDetails.biography,
        });
      } catch (error) {
        console.error(
          `Error fetching Instagram details for page ${page.name}:`,
          error.response?.data || error.message
        );
      }
    }
    console.log(instagramDetails);
    res.json({ success: true, instagramDetails });
  } catch (error) {
    console.error(
      "Error fetching Instagram account details:",
      error.response?.data || error.message
    );
    res
      .status(500)
      .json({ error: "Failed to fetch Instagram account details." });
  }
};

export const getPageMetaData = async (req, res) => {
  const { pageId } = req.params;
  const userAccessToken = req.session.access_token;

  if (!userAccessToken) {
    return res.status(401).json({ error: "User is not authenticated." });
  }

  try {
    // Fetch page metadata
    const response = await axios.get(
      `https://graph.facebook.com/v22.0/${pageId}`,
      {
        params: {
          access_token: userAccessToken,
          fields: "id,name,about,fan_count,category,website,link,picture",
        },
      }
    );

    // Return metadata
    res.json({
      success: true,
      data: response.data,
    });
  } catch (error) {
    console.error(
      "Error fetching page metadata:",
      error.response?.data || error.message
    );
    res.status(500).json({ error: "Failed to fetch page metadata." });
  }
};

export const getPagePosts = async (req, res) => {
  const { pageId } = req.query;
  const userAccessToken = req.session?.access_token;

  if (!pageId) {
    return res.status(400).json({ error: "pageId is required" });
  }

  if (!userAccessToken) {
    return res.status(401).json({ error: "User is not authenticated." });
  }

  try {
    // Get Page Access Token
    const pageResponse = await axios.get(
      `https://graph.facebook.com/v17.0/me/accounts`,
      { params: { access_token: userAccessToken } }
    );

    const page = pageResponse.data.data.find((p) => p.id === pageId);
    if (!page) {
      return res.status(404).json({ error: "Page not found." });
    }

    const pageAccessToken = page.access_token;

    // Fetch Posts without pagination
    const postsResponse = await axios.get(
      `https://graph.facebook.com/v17.0/${pageId}/posts`,
      {
        params: {
          access_token: pageAccessToken,
          fields: "id,message,created_time,likes.summary(true),comments.summary(true),shares,attachments{media_type,media,url},full_picture"
        }
      }
    );

    res.json({
      success: true,
      posts: postsResponse.data.data // Changed to 'posts' to match frontend expectations
    });
  } catch (error) {
    console.error(
      "Error fetching posts:",
      error.response?.data || error.message
    );
    res
      .status(500)
      .json({ error: "Error fetching posts", details: error.message });
  }
};

export const getInstaPosts = async (req, res) => {
  const { igAccountId } = req.query;
  const userAccessToken = req.session.access_token;

  if (!userAccessToken || !igAccountId) {
    return res
      .status(400)
      .json({ error: "Missing access token or Instagram account ID." });
  }

  try {
    // Fetch recent Instagram posts
    const response = await axios.get(
      `https://graph.facebook.com/v17.0/${igAccountId}/media`,
      {
        params: {
          access_token: userAccessToken,
          fields: "id,caption,media_type,media_url,timestamp",
        },
      }
    );

    res.json({ success: true, posts: response.data.data });
  } catch (error) {
    console.error(
      "Error fetching Instagram posts:",
      error.response?.data || error.message
    );
    res.status(500).json({ error: "Failed to fetch Instagram posts." });
  }
};

export const checkConnectionStatus = async (req, res) => {
  try {
    // Retrieve the access token from the session (or database)
    const userAccessToken = req.session.access_token;

    if (!userAccessToken) {
      return res.json({ isConnected: false });
    }

    // Verify the token by making a request to Facebook API
    const fbResponse = await axios.get("https://graph.facebook.com/v22.0/me", {
      params: { access_token: userAccessToken },
    });

    // If the request succeeds, the token is valid
    res.json({
      isConnected: true,
      userId: fbResponse.data.id,
      name: fbResponse.data.name,
    });
  } catch (error) {
    console.error(
      "Facebook authentication error:",
      error.response?.data || error.message
    );

    // If token is invalid or expired, clear the session
    req.session.access_token = null;
    res.json({ isConnected: false });
  }
};

export const fbPostNow = async (req, res) => {
  console.log("Entering FB Post Now");
  const { pageId, message, cloudinaryUrl } = req.body;
  console.log("Image URL of FB POST NOW", cloudinaryUrl);

  if (!pageId || !message || !cloudinaryUrl) {
    return res.status(400).send("Missing required parameters");
  }

  const userAccessToken = req.session.access_token;

  if (!userAccessToken) {
    return res.status(401).send("User is not authenticated.");
  }

  try {
    // Get the Page Access Token
    const pagesResponse = await axios.get(
      `https://graph.facebook.com/v22.0/me/accounts`,
      {
        params: { access_token: userAccessToken },
      }
    );

    const page = pagesResponse.data.data.find((p) => p.id === pageId);

    if (!page) {
      return res.status(404).send("Page not found");
    }

    const pageAccessToken = page.access_token;

    // Download the image from Cloudinary
    const imageResponse = await axios({
      method: "get",
      url: cloudinaryUrl,
      responseType: "stream",
    });

    // Create form data for Facebook API
    const formData = new FormData();
    formData.append("file", imageResponse.data);
    formData.append("message", message);
    formData.append("access_token", pageAccessToken);

    // Upload the image to the page
    const imageUploadUrl = `https://graph.facebook.com/v22.0/${pageId}/photos`;

    // Post the image
    const postResponse = await axios.post(imageUploadUrl, formData, {
      headers: {
        ...formData.getHeaders(),
      },
    });

    res.json({
      success: true,
      postId: postResponse.data.id,
      imageUrl: postResponse.data.post_url || cloudinaryUrl,
    });
  } catch (error) {
    console.error(
      "Error posting to Page:",
      error.response?.data || error.message
    );
    res.status(500).send("Error posting to the Page");
  }
};

export const fbSchedulePost = async (req, res) => {
  const { pageId, message, cloudinaryUrl, scheduledTime } = req.body;

  if (!pageId || !message || !cloudinaryUrl || !scheduledTime) {
    return res.status(400).send("Missing required parameters");
  }

  // Convert scheduledTime to Unix timestamp (seconds, not milliseconds)
  const scheduledTimestamp = Math.floor(
    new Date(scheduledTime).getTime() / 1000
  );
  const now = Math.floor(Date.now() / 1000);

  // Validate scheduled time is in the future (at least 10 minutes from now)
  if (scheduledTimestamp <= now + 600) {
    return res
      .status(400)
      .send("Scheduled time must be at least 10 minutes in the future");
  }

  const userAccessToken = req.session.access_token;

  if (!userAccessToken) {
    return res.status(401).send("User is not authenticated.");
  }

  try {
    // Get the Page Access Token
    const pagesResponse = await axios.get(
      `https://graph.facebook.com/v22.0/me/accounts`,
      {
        params: { access_token: userAccessToken },
      }
    );

    const page = pagesResponse.data.data.find((p) => p.id === pageId);

    if (!page) {
      return res.status(404).send("Page not found");
    }

    const pageAccessToken = page.access_token;

    // Download the image from Cloudinary
    const imageResponse = await axios({
      method: "get",
      url: cloudinaryUrl,
      responseType: "stream",
    });

    // Create form data for Facebook API
    const formData = new FormData();
    formData.append("file", imageResponse.data);
    formData.append("message", message);
    formData.append("scheduled_publish_time", scheduledTimestamp);
    formData.append("published", "false"); // This indicates it's a scheduled post
    formData.append("access_token", pageAccessToken);

    // Upload the image to the page with scheduling parameters
    const imageUploadUrl = `https://graph.facebook.com/v22.0/${pageId}/photos`;

    // Post the image with scheduling information
    const postResponse = await axios.post(imageUploadUrl, formData, {
      headers: {
        ...formData.getHeaders(),
      },
    });

    res.json({
      success: true,
      postId: postResponse.data.id,
      imageUrl: postResponse.data.post_url || cloudinaryUrl,
      scheduledTime: new Date(scheduledTimestamp * 1000).toISOString(),
    });
  } catch (error) {
    console.error(
      "Error scheduling post to Page:",
      error.response?.data || error.message
    );
    res.status(500).send("Error scheduling post to the Page");
  }
};

export const instaPostNow = async (req, res) => {
  const { instagramAccountId, caption, cloudinaryUrl } = req.body;

  // Validate required parameters
  if (!instagramAccountId) {
    return res.status(400).json({ error: "Instagram account ID is missing" });
  }

  if (!cloudinaryUrl) {
    return res.status(400).json({ error: "Cloudinary URL is missing" });
  }

  // Validate access token
  if (!req.session.access_token) {
    return res.status(401).json({ error: "No access token available" });
  }

  try {
    // Create media container using the provided Cloudinary URL
    const instagramResponse = await axios.post(
      `https://graph.facebook.com/v22.0/${instagramAccountId}/media`,
      {
        image_url: cloudinaryUrl,
        caption: caption || "",
        access_token: req.session.access_token,
      }
    );

    if (!instagramResponse.data.id) {
      return res
        .status(400)
        .json({ error: "Failed to create media container" });
    }

    const mediaId = instagramResponse.data.id;

    // Publish the media
    const publishResponse = await axios.post(
      `https://graph.facebook.com/v22.0/${instagramAccountId}/media_publish`,
      {
        creation_id: mediaId,
        access_token: req.session.access_token,
      }
    );

    res.json({
      success: true,
      postId: mediaId,
      imageUrl: cloudinaryUrl,
      publishResponse: publishResponse.data,
    });
  } catch (err) {
    console.error(
      "Instagram posting error:",
      err.response?.data || err.message
    );
    return res.status(500).json({
      error: "Error posting to Instagram",
      details: err.response?.data || err.message,
    });
  }
};

export const postToBoth = async (req, res) => {
  console.log("Entering Post to Both FB and Instagram");

  const { pageId, instagramAccountId, message, caption, cloudinaryUrl } =
    req.body;

  console.log("Image URL for posting:", cloudinaryUrl);

  // Validate required parameters
  if (!cloudinaryUrl) {
    return res.status(400).json({ error: "Cloudinary URL is missing" });
  }

  // Check at least one platform is specified
  if (!instagramAccountId && !pageId) {
    return res.status(400).json({
      error: "At least one platform (Instagram or Facebook) must be specified",
    });
  }

  // Validate access token
  if (!req.session || !req.session.access_token) {
    return res.status(401).json({ error: "User is not authenticated" });
  }

  const userAccessToken = req.session.access_token;
  const results = { instagram: null, facebook: null };
  let hasError = false;

  // Step 1: Post to Instagram first (if Instagram account ID is provided)
  if (instagramAccountId) {
    try {
      // Create media container using the provided Cloudinary URL
      const instagramResponse = await axios.post(
        `https://graph.facebook.com/v22.0/${instagramAccountId}/media`,
        {
          image_url: cloudinaryUrl,
          caption: caption || message || "", // Use caption, fallback to message if not provided
          access_token: userAccessToken,
        }
      );

      if (!instagramResponse.data.id) {
        throw new Error("Failed to create media container");
      }

      const mediaId = instagramResponse.data.id;

      // Publish the media
      const publishResponse = await axios.post(
        `https://graph.facebook.com/v22.0/${instagramAccountId}/media_publish`,
        {
          creation_id: mediaId,
          access_token: userAccessToken,
        }
      );

      results.instagram = {
        success: true,
        postId: publishResponse.data.id,
        imageUrl: cloudinaryUrl,
      };

      console.log("Successfully posted to Instagram");
    } catch (instaError) {
      console.error(
        "Instagram posting error:",
        instaError.response?.data || instaError.message
      );

      results.instagram = {
        success: false,
        error: instaError.response?.data || instaError.message,
      };

      hasError = true;
    }
  }

  // Step 2: Post to Facebook (if page ID is provided)
  if (pageId) {
    try {
      // Get the Page Access Token
      const pagesResponse = await axios.get(
        `https://graph.facebook.com/v22.0/me/accounts`,
        {
          params: { access_token: userAccessToken },
        }
      );

      const page = pagesResponse.data.data.find((p) => p.id === pageId);

      if (!page) {
        throw new Error("Page not found");
      }

      const pageAccessToken = page.access_token;

      // Download the image from Cloudinary
      const imageResponse = await axios({
        method: "get",
        url: cloudinaryUrl,
        responseType: "stream",
      });

      // Create form data for Facebook API
      const formData = new FormData();
      formData.append("file", imageResponse.data);
      formData.append("message", message || caption || ""); // Use message, fallback to caption
      formData.append("access_token", pageAccessToken);

      // Upload the image to the page
      const imageUploadUrl = `https://graph.facebook.com/v22.0/${pageId}/photos`;

      // Post the image
      const postResponse = await axios.post(imageUploadUrl, formData, {
        headers: {
          ...formData.getHeaders(),
        },
      });

      results.facebook = {
        success: true,
        postId: postResponse.data.id,
        imageUrl: postResponse.data.post_url || cloudinaryUrl,
      };

      console.log("Successfully posted to Facebook");
    } catch (fbError) {
      console.error(
        "Error posting to Facebook Page:",
        fbError.response?.data || fbError.message
      );

      results.facebook = {
        success: false,
        error: fbError.response?.data || fbError.message,
      };

      hasError = true;
    }
  }

  // Determine appropriate response based on results
  if (hasError) {
    // If any platform failed, but at least one succeeded
    if (
      (results.instagram && results.instagram.success) ||
      (results.facebook && results.facebook.success)
    ) {
      return res.status(207).json({
        success: true,
        message: "Partially successful posting",
        results,
      });
    } else {
      // If all attempts failed
      return res.status(500).json({
        success: false,
        message: "Failed to post to any platform",
        results,
      });
    }
  } else {
    // Everything succeeded
    return res.status(200).json({
      success: true,
      message: "Successfully posted to all specified platforms",
      results,
    });
  }
};

export const manipulateSocialMediaCampaign = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.userId);
    currentUser.socialCampaignsCreated += 1;
    await currentUser.save();
    console.log("SociAL campaign count updated successfully");
    res.status(200).json({
      success: true,
      message: "Social campaign count updated successfully",
    });
  } catch (error) {
    errorHandler(400, "Error updating Social campaign count");
    errorHandler(400, "Error updating Social Campaugn count");
  }
};
