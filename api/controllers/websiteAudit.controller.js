import lighthouse from "lighthouse";
// import chromeLauncher from "chrome-launcher";
import * as chromeLauncher from "chrome-launcher";


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
