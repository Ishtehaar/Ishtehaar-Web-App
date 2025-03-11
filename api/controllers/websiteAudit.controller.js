import lighthouse from "lighthouse";
// import chromeLauncher from "chrome-launcher";
import * as chromeLauncher from "chrome-launcher";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";


function formatUrl(url) {
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
        return `https://${url}`; // Default to HTTPS
    }
    return url;
}

async function runLighthouse(url) {
    const formattedUrl = formatUrl(url);
    console.log(`Formatted URL: ${formattedUrl}`); // Debugging
    const chrome = await chromeLauncher.launch({ chromeFlags: ["--headless"] });
    const options = { logLevel: "info", output: "json", port: chrome.port };
    const runnerResult = await lighthouse(formattedUrl, options);

    await chrome.kill();
    return runnerResult.lhr; // Lighthouse Report JSON
}

export const websiteAudit = async (req, res) => {
    const { websiteUrl } = req.body;
    if (!websiteUrl) {
        return res.status(400).json({ error: "Website URL is required" });
    }
    try {
        console.log(`Running Lighthouse audit for: ${websiteUrl}`); // Log the URL
        const result = await runLighthouse(websiteUrl);
        console.log('Lighthouse Audit Result:', result);

        res.json({ result
        });
    } catch (error) {
        console.error("Lighthouse audit failed:", error);  // Log full error
        res.status(500).json({ error: "Failed to analyze website" });
    }
}


export const manipulateAudit = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.userId);
    currentUser.websiteAuditsCreated += 1;
    await currentUser.save();
    console.log("Audit count updated successfully");
    res.status(200).json({
      success: true,
      message: "Audit count updated successfully",
    });
  } catch (error) {
    console.error("Error updating audit count:", error);
    errorHandler(400, "Error updating Audit count");
  }
};