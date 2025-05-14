// import puppeteer from "puppeteer";

// export const getGoogleTrendsForLocation = async (location) => {
//   try {
//     const browser = await puppeteer.launch({
//       headless: "new",
//       args: ["--no-sandbox"],
//     });

//     const page = await browser.newPage();
//     const targetUrl = "https://trends.google.com/trends/trendingsearches/daily?geo=" +
//       (location.toUpperCase() === "PAKISTAN" ? "PK" : "US");
//     await page.goto(targetUrl, { waitUntil: "networkidle2" });

//     const trends = await page.evaluate(() => {
//       const results = [];
//       document
//         .querySelectorAll(".feed-list-wrapper .details-top a")
//         .forEach((el) => {
//           results.push(el.innerText.trim());
//         });
//       return results.slice(0, 10); // Top 10 trends
//     });

//     await browser.close();
//     return trends.length > 0 ? trends : ["#Trending", "#Viral"];
//   } catch (err) {
//     console.error("Scraping error:", err);
//    return ["#Trending", "#Viral"];
//   }
// };


// utils/googleTrends.js

import axios from "axios";

/**
 * Fetch trending keywords for a specific location
 * 
 * @param {string} location - The location to get trends for (e.g., "New York", "London")
 * @returns {Promise<string[]>} - Array of trending keywords
 */
export const getGoogleTrendsForLocation = async (location) => {
  try {
    // This is a simple implementation - in a production app, you'd want to:
    // 1. Use a proper Google Trends API or service
    // 2. Implement caching to reduce API calls
    // 3. Handle rate limiting and other API constraints
    
    // For now, we'll simulate a response based on the location
    // In a real app, replace this with actual API calls
    
    // Normalize location name
    const normalizedLocation = location.toLowerCase().trim();
    
    // Basic fallback trends if we can't get location-specific ones
    const defaultTrends = [
      "digital marketing",
      "social media strategy",
      "content creation",
      "online business",
      "instagram marketing",
      "local business",
      "video content",
      "customer engagement",
      "brand awareness",
      "social media growth"
    ];
    
    // Try to get location-specific trends
    try {
      // This would be replaced with a real API call in production
      // const response = await axios.get(`https://trends-api.example.com/${encodeURIComponent(normalizedLocation)}`);
      // return response.data.trends;
      
      // For now, return simulated trends based on location
      const locationTrends = {
        "new york": [
          "NYC events",
          "Manhattan restaurants",
          "Brooklyn markets",
          "New York fashion",
          "Times Square",
          "Central Park activities",
          "NYC brunch spots",
          "New York nightlife",
          "Broadway shows",
          "NYC cultural events"
        ],
        "london": [
          "London events",
          "British cuisine",
          "West End shows",
          "London markets",
          "Thames river",
          "London fashion",
          "UK trends",
          "London tech scene",
          "British culture",
          "London street food"
        ],
        "tokyo": [
          "Tokyo cuisine",
          "Anime events",
          "Japanese street fashion",
          "Shibuya crossing",
          "Tokyo nightlife",
          "Cherry blossom season",
          "Tokyo tech innovations",
          "Japanese traditions",
          "Tokyo shopping districts",
          "Japan travel"
        ],
        "sydney": [
          "Australian beaches",
          "Sydney harbour",
          "Bondi lifestyle",
          "Australian cafe culture",
          "Sydney events",
          "Opera house",
          "Australian outdoor living",
          "Sydney markets",
          "Australian summer",
          "Sydney fitness trends"
        ],
        "los angeles": [
          "Hollywood events",
          "LA food scene",
          "California lifestyle",
          "Beverly Hills",
          "Santa Monica beach",
          "LA fitness trends",
          "Hollywood celebrities",
          "Los Angeles art",
          "California fashion",
          "LA tech industry"
        ],
        "paris": [
          "French cuisine",
          "Paris fashion week",
          "Eiffel Tower",
          "Parisian cafes",
          "French art",
          "Paris museums",
          "Seine river",
          "Paris nightlife",
          "French culture",
          "Paris landmarks"
        ],
        "berlin": [
          "German street food",
          "Berlin wall",
          "German techno",
          "Berlin nightlife",
          "German beer",
          "Berlin art scene",
          "German culture",
          "Berlin startups",
          "German festivals",
          "Berlin history"
        ],
        "dubai": [
          "Burj Khalifa",
          "Dubai mall",
          "UAE lifestyle",
          "Desert safari",
          "Dubai luxury",
          "Palm Jumeirah",
          "Dubai restaurants",
          "Arabic cuisine",
          "Dubai shopping",
          "UAE attractions"
        ],
        "toronto": [
          "CN Tower",
          "Canadian food",
          "Toronto Raptors",
          "Niagara Falls trips",
          "Toronto islands",
          "Canadian lifestyle",
          "Toronto events",
          "Maple syrup",
          "Canadian culture",
          "Toronto waterfront"
        ],
        "mexico city": [
          "Mexican cuisine",
          "Day of the Dead",
          "Mexican art",
          "Lucha libre",
          "Mexico City markets",
          "Mexican culture",
          "Tacos al pastor",
          "Frida Kahlo",
          "Mexican traditions",
          "Mexico City landmarks"
        ]
      };
      
      // Return location-specific trends if available, otherwise default trends
      return locationTrends[normalizedLocation] || defaultTrends;
    } catch (error) {
      console.log("Error fetching location-specific trends:", error);
      return defaultTrends;
    }
  } catch (error) {
    console.error("Error in getGoogleTrendsForLocation:", error);
    return [
      "trending topics",
      "viral content",
      "social media",
      "digital marketing",
      "online business",
      "content strategy",
      "engagement tactics",
      "brand building",
      "customer loyalty",
      "social growth"
    ];
  }
};