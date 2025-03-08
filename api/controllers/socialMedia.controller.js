import * as dotenv from "dotenv";
import cloudinary from "cloudinary";
import https from "https";
import axios from "axios";
import stream from "stream";
import FormData from "form-data";

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
    console.log(pages)

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
    console.log("ncildnc",pages)

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
    console.log(instagramDetails)
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
  const { pageId = process.env.ISHTEHAAR_PAGE_ID, limit = 10 } = req.query; // Accept pageId and limit as query parameters
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
      `https://graph.facebook.com/v22.0/me/accounts`,
      { params: { access_token: userAccessToken } }
    );

    const page = pageResponse.data.data.find((p) => p.id === pageId);
    if (!page) {
      return res.status(404).json({ error: "Page not found." });
    }

    const pageAccessToken = page.access_token;

    // Fetch Posts with Pagination
    let posts = [];
    let nextPage = `https://graph.facebook.com/v22.0/${pageId}/posts?fields=id,message,created_time,likes.summary(true),comments.summary(true),shares,attachments{media_type,media,url},full_picture&limit=${limit}&access_token=${pageAccessToken}`;

    while (nextPage) {
      const postsResponse = await axios.get(nextPage);
      posts = posts.concat(postsResponse.data.data);

      // Check if there is a next page
      nextPage = postsResponse.data.paging?.next || null;

      // Optional: Stop fetching after a certain number of posts
      if (posts.length >= limit) break;
    }

    res.json({
      success: true,
      data: posts.slice(0, limit), // Return only the required number of posts
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
    console.log("Entering FB Schedule Post");
    const { pageId, message, cloudinaryUrl, scheduledTime } = req.body;
    console.log("Image URL for scheduled post:", cloudinaryUrl); 
    console.log("Scheduled time:", scheduledTime);
    console.log("Page ID:", pageId);

  
    if (!pageId || !message || !cloudinaryUrl || !scheduledTime) {
      return res.status(400).send("Missing required parameters");
    }
  
    // Convert scheduledTime to Unix timestamp (seconds, not milliseconds)
    const scheduledTimestamp = Math.floor(new Date(scheduledTime).getTime() / 1000);
    const now = Math.floor(Date.now() / 1000);
    
    // Validate scheduled time is in the future (at least 10 minutes from now)
    if (scheduledTimestamp <= now + 600) {
      return res.status(400).send("Scheduled time must be at least 10 minutes in the future");
      
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
        scheduledTime: new Date(scheduledTimestamp * 1000).toISOString()
      });
    } catch (error) {
      console.error(
        "Error scheduling post to Page:",
        error.response?.data || error.message
      );
      res.status(500).send("Error scheduling post to the Page");
    }
  };
