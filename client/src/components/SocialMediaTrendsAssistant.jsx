// import React, { useState } from "react";
// import {
//   Card,
//   Button,
//   Label,
//   TextInput,
//   Select,
//   Spinner,
// } from "flowbite-react";
// import { FaHashtag, FaChartLine, FaLightbulb } from "react-icons/fa";
// import { MdTravelExplore } from "react-icons/md";
// import { Link } from "react-router-dom";

// const SocialMediaTrendsAssistant = () => {
//   const [location, setLocation] = useState("");
//   const [businessType, setBusinessType] = useState("");
//   const [platform, setPlatform] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [results, setResults] = useState(null);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       // Real API call to the provided endpoint
//       const response = await fetch("/api/trends/fetch-latest-trends", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           location,
//           businessType,
//           platform,
//         }),
//       });

//       if (!response.ok) {
//         throw new Error("Failed to fetch trends");
//       }

//       const data = await response.json();

//       if (!data.success) {
//         throw new Error(data.message || "Failed to generate trends");
//       }

//       // Parse the AI response
//       const trendsContent = data.trends;

//       // Extract structured data from the text response
//       // This is a basic parsing approach - you might want to improve this
//       // based on the actual format of your AI response
//       const contentIdeas = extractSection(
//         trendsContent,
//         "content ideas",
//         "specific content ideas"
//       );
//       const hashtags = extractHashtags(trendsContent);
//       const audioThemes = extractSection(
//         trendsContent,
//         "trending audio",
//         "popular audio",
//         "themes"
//       );
//       const contentTypes = extractSection(
//         trendsContent,
//         "types of posts",
//         "content types"
//       );

//       setResults({
//         contentIdeas: contentIdeas.length
//           ? contentIdeas
//           : [
//               "Create authentic behind-the-scenes content",
//               "Showcase customer testimonials",
//               "Share industry tips and tricks",
//             ],
//         hashtags: hashtags.length
//           ? hashtags
//           : ["#TrendingNow", "#YourIndustry", "#LocalBusiness"],
//         audioThemes: audioThemes.length
//           ? audioThemes
//           : [
//               "Current trending songs in your region",
//               "Popular sound effects for your industry",
//               "Viral audio clips",
//             ],
//         contentTypes: contentTypes.length
//           ? contentTypes
//           : [
//               "Stories",
//               "Reels/Short videos",
//               "Carousel posts",
//               "Live sessions",
//             ],
//         rawResponse: trendsContent, // Keep the full response for reference
//       });

//       setLoading(false);
//     } catch (error) {
//       console.error("Error fetching trends:", error);
//       setLoading(false);
//       // Optionally show error message to user
//       alert("Failed to fetch trends. Please try again later.");
//     }
//   };

//   // Helper functions to extract information from AI response
//   const extractSection = (text, ...sectionHints) => {
//     const lines = text.split("\n");
//     const results = [];
//     let capturing = false;

//     // Look for sections that might contain our desired content
//     for (let i = 0; i < lines.length; i++) {
//       const line = lines[i].toLowerCase();

//       // Check if this line indicates the start of our section
//       const isStartOfSection = sectionHints.some(
//         (hint) =>
//           line.includes(hint.toLowerCase()) &&
//           (line.includes(":") ||
//             line.includes("-") ||
//             line.match(/^\s*[\d#*-]\.?\s/))
//       );

//       if (isStartOfSection) {
//         capturing = true;
//         // If the line itself contains content after a delimiter, capture it
//         const content = line.split(/:|–|-/).slice(1).join(":").trim();
//         if (content && !content.match(/^\s*$/)) {
//           results.push(content);
//         }
//         continue;
//       }

//       // If we're in a capturing section and hit another section header or empty line, stop capturing
//       if (
//         capturing &&
//         (line.match(/^\s*$/) || line.match(/^#|^\d+\.|^[A-Z]/))
//       ) {
//         capturing = false;
//       }

//       // Capture bullet points and numbered items while in capturing mode
//       if (capturing && line.match(/^\s*[\d#*•-]\.?\s/)) {
//         const content = line.replace(/^\s*[\d#*•-]\.?\s/, "").trim();
//         if (content) results.push(content);
//       }
//     }

//     return results.filter((item) => item && item.length > 3).slice(0, 5); // Return up to 5 non-empty items
//   };

//   const extractHashtags = (text) => {
//     // Extract actual hashtags
//     const hashtagRegex = /#[a-zA-Z0-9_]+/g;
//     const hashtags = text.match(hashtagRegex) || [];

//     // Also look for hashtag suggestions that might not be formatted with #
//     const lines = text.split("\n");
//     for (let i = 0; i < lines.length; i++) {
//       const line = lines[i].toLowerCase();
//       if (line.includes("hashtag") || line.includes("tag")) {
//         // Extract words that might be hashtag suggestions
//         const parts = line.split(/[:,-]/).slice(1).join(":").trim();
//         const words = parts.split(/\s+/);
//         words.forEach((word) => {
//           const cleaned = word.replace(/[^a-zA-Z0-9_]/g, "");
//           if (cleaned && cleaned.length > 1) {
//             // Add the # if it doesn't already have one
//             if (!cleaned.startsWith("#")) {
//               hashtags.push("#" + cleaned);
//             } else {
//               hashtags.push(cleaned);
//             }
//           }
//         });
//       }
//     }

//     return [...new Set(hashtags)].slice(0, 6); // Remove duplicates and limit to 6
//   };

//   const resetForm = () => {
//     setResults(null);
//     setLocation("");
//     setBusinessType("");
//     setPlatform("");
//   };

//   return (
//     <div className=" min-h-screen p-4 md:p-8">
//       <div className="max-w-6xl mx-auto">
//         <h1 className="text-4xl font-bold text-center mb-2">
//           Social Media Trends Assistant
//         </h1>
//         <p className=" text-center mb-8">
//           Get AI-powered recommendations for trending content ideas tailored to
//           your location and business type.
//         </p>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//           <Card className=" border-0">
//             <div className="flex items-start">
//               <div className="mr-4 text-blue-500">
//                 <FaHashtag size={24} />
//               </div>
//               <div>
//                 <h3 className="text-xl font-semibold ">
//                   Trending Hashtags
//                 </h3>
//                 <p className=" mt-2">
//                   Discover location-specific trending hashtags that can increase
//                   your content visibility and engagement.
//                 </p>
//               </div>
//             </div>
//           </Card>

//           <Card className=" border-0">
//             <div className="flex items-start">
//               <div className="mr-4 text-purple-500">
//                 <FaChartLine size={24} />
//               </div>
//               <div>
//                 <h3 className="text-xl font-semibold ">
//                   Content Strategy
//                 </h3>
//                 <p className=" mt-2">
//                   Get platform-specific content format recommendations that
//                   perform best for your industry.
//                 </p>
//               </div>
//             </div>
//           </Card>

//           <Card className=" border-0">
//             <div className="flex items-start">
//               <div className="mr-4 text-pink-500">
//                 <FaLightbulb size={24} />
//               </div>
//               <div>
//                 <h3 className="text-xl font-semibold ">
//                   Actionable Ideas
//                 </h3>
//                 <p className=" mt-2">
//                   Receive practical content ideas that leverage current trends
//                   while aligning with your business goals.
//                 </p>
//               </div>
//             </div>
//           </Card>
//         </div>

//         {!results ? (
//           <Card className=" border-0">
//             <h2 className="text-2xl font-bold mb-6">
//               What's your business about?
//             </h2>
//             <form onSubmit={handleSubmit} className="space-y-4">
//               <div>
//                 <div className="mb-2 block">
//                   <Label
//                     htmlFor="location"
//                     value="Location"
//                     className=""
//                   />
//                 </div>
//                 <TextInput
//                   id="location"
//                   placeholder="e.g. New York, London, Tokyo"
//                   required
//                   value={location}
//                   onChange={(e) => setLocation(e.target.value)}
//                   className=" text-white"
//                 />
//               </div>

//               <div>
//                 <div className="mb-2 block">
//                   <Label
//                     htmlFor="businessType"
//                     value="Business Type"
//                     className="text-white"
//                   />
//                 </div>
//                 <TextInput
//                   id="businessType"
//                   placeholder="e.g. Coffee shop, Fashion boutique, Digital agency"
//                   required
//                   value={businessType}
//                   onChange={(e) => setBusinessType(e.target.value)}
//                   className=" text-white"
//                 />
//               </div>

//               <div>
//                 <div className="mb-2 block">
//                   <Label
//                     htmlFor="platform"
//                     value="Social Media Platform"
//                     className="text-white"
//                   />
//                 </div>
//                 <Select
//                   id="platform"
//                   required
//                   value={platform}
//                   onChange={(e) => setPlatform(e.target.value)}
//                   className=" text-white"
//                 >
//                   <option value="" disabled>
//                     Select platform
//                   </option>
//                   <option value="Instagram">Instagram</option>
//                   <option value="TikTok">TikTok</option>
//                   <option value="Facebook">Facebook</option>
//                   <option value="Twitter">Twitter</option>
//                   <option value="LinkedIn">LinkedIn</option>
//                   <option value="Pinterest">Pinterest</option>
//                 </Select>
//               </div>

//               <div className="flex items-center text-sm text-gray-500 mt-4">
//                 <MdTravelExplore className="mr-2" />
//                 <p>
//                   The more specific details you provide about your business and
//                   location, the more accurate your trend recommendations will
//                   be.
//                 </p>
//               </div>

//               <Button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
//               >
//                 {loading ? (
//                   <>
//                     <Spinner size="sm" className="mr-3" />
//                     Generating Recommendations...
//                   </>
//                 ) : (
//                   "Generate Trend Recommendations"
//                 )}
//               </Button>
//             </form>
//           </Card>
//         ) : (
//           <Card className=" border-0">
//             <div className="flex justify-between items-center mb-6">
//               <h2 className="text-2xl font-bold">
//                 Trending Content Recommendations
//               </h2>
//               <Button onClick={resetForm} size="sm" color="gray">
//                 New Search
//               </Button>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div className="space-y-4">
//                 <div>
//                   <h3 className="text-xl font-semibold text-blue-500 mb-3">
//                     Content Ideas
//                   </h3>
//                   <ul className="list-disc pl-5 space-y-2 ">
//                     {results.contentIdeas.map((idea, index) => (
//                       <li key={index}>{idea}</li>
//                     ))}
//                   </ul>
//                 </div>

//                 <div>
//                   <h3 className="text-xl font-semibold text-purple-500 mb-3">
//                     Trending Hashtags
//                   </h3>
//                   <div className="flex flex-wrap gap-2">
//                     {results.hashtags.map((hashtag, index) => (
//                       <span
//                         key={index}
//                         className=" px-3 py-1 rounded-full text-sm"
//                       >
//                         {hashtag}
//                       </span>
//                     ))}
//                   </div>
//                 </div>
//               </div>

//               <div className="space-y-4">
//                 <div>
//                   <h3 className="text-xl font-semibold text-pink-500 mb-3">
//                     Trending Audio & Themes
//                   </h3>
//                   <ul className="list-disc pl-5 space-y-2 ">
//                     {results.audioThemes.map((theme, index) => (
//                       <li key={index}>{theme}</li>
//                     ))}
//                   </ul>
//                 </div>

//                 <div>
//                   <h3 className="text-xl font-semibold text-yellow-500 mb-3">
//                     Recommended Content Types
//                   </h3>
//                   <ul className="list-disc pl-5 space-y-2">
//                     {results.contentTypes.map((type, index) => (
//                       <li key={index}>{type}</li>
//                     ))}
//                   </ul>
//                 </div>
//               </div>
//             </div>

//             <div className="mt-6 p-4 bg-opacity-30 rounded-lg">
//               <h4 className="font-semibold mb-2 text-purple-500">
//                 Pro Tips for Implementation:
//               </h4>
//               <ul className="list-disc pl-5 space-y-1 text-sm">
//                 <li>
//                   Post during peak hours for your region (typically 12-2pm and
//                   6-8pm local time)
//                 </li>
//                 <li>
//                   Engage with other accounts using the same trending hashtags
//                 </li>
//                 <li>
//                   Create a content calendar incorporating these recommendations
//                 </li>
//                 <li>Measure engagement and adjust your strategy accordingly</li>
//               </ul>
//             </div>

//             {/* {results.rawResponse && (
//               <div className="mt-6">
//                 <details className="text-sm">
//                   <summary className="cursor-pointer text-gray-400 hover:text-gray-300">
//                     View full AI analysis
//                   </summary>
//                   <div className="mt-3 p-4 bg-gray-900 rounded-lg text-gray-300 whitespace-pre-wrap">
//                     {results.rawResponse}
//                   </div>
//                 </details>
//               </div>
//             )} */}
//           </Card>
//         )}

//         <div className="mt-8 text-center text-gray-500 text-sm">
//           <p>
//             Need more marketing help? Check out our{" "}
//             <Link to="/dashboard?tab=seo-keywords">SEO Assistant</Link> and{" "}
//             <Link to="/dashboard?tab=website-audit">Website Audit</Link> tools
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SocialMediaTrendsAssistant;


import React, { useState } from "react";
import {
  Card,
  Button,
  Label,
  TextInput,
  Select,
  Spinner,
} from "flowbite-react";
import { FaHashtag, FaChartLine, FaLightbulb } from "react-icons/fa";
import { MdTravelExplore } from "react-icons/md";
import { Link } from "react-router-dom";

const SocialMediaTrendsAssistant = () => {
  const [location, setLocation] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [platform, setPlatform] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Real API call to the provided endpoint
      const response = await fetch("/api/trends/fetch-latest-trends", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          location,
          businessType,
          platform,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch trends");
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Failed to generate trends");
      }

      // Parse the AI response based on whether it's structured or not
      if (data.structured) {
        // We have a structured JSON response
        const trendsData = data.trends;
        
        setResults({
          // Map content ideas to an array of strings for the UI
          contentIdeas: trendsData.contentIdeas.map(idea => `${idea.title}: ${idea.description}`),
          
          // Hashtags are already in the right format
          hashtags: trendsData.hashtags,
          
          // Map audio to formatted strings
          audioThemes: trendsData.audio.map(item => `"${item.title}" by ${item.artist}`),
          
          // Create content types from the recommended format and other data
          contentTypes: [
            `${trendsData.contentFormat.recommended} - ${trendsData.contentFormat.reason}`,
            ...trendsData.growthHacks.map(hack => `${hack.title}: ${hack.description}`)
          ],
          
          // Add influencers section
          influencers: trendsData.influencers.map(inf => 
            `${inf.name} (${inf.username}): ${inf.reason}`
          ),
          
          // Keep the raw response for reference
          rawResponse: trendsData.rawResponse || JSON.stringify(trendsData, null, 2),
        });
      } else {
        // Fallback to the old parsing method if we don't have structured data
        const trendsContent = data.trends;
        // Extract structured data from the text response using existing helper functions
        const contentIdeas = extractSection(
          trendsContent,
          "content ideas",
          "specific content ideas"
        );
        const hashtags = extractHashtags(trendsContent);
        const audioThemes = extractSection(
          trendsContent,
          "trending audio",
          "popular audio",
          "themes"
        );
        const contentTypes = extractSection(
          trendsContent,
          "types of posts",
          "content types"
        );

        setResults({
          contentIdeas: contentIdeas.length
            ? contentIdeas
            : [
                "Create authentic behind-the-scenes content",
                "Showcase customer testimonials",
                "Share industry tips and tricks",
              ],
          hashtags: hashtags.length
            ? hashtags
            : ["#TrendingNow", "#YourIndustry", "#LocalBusiness"],
          audioThemes: audioThemes.length
            ? audioThemes
            : [
                "Current trending songs in your region",
                "Popular sound effects for your industry",
                "Viral audio clips",
              ],
          contentTypes: contentTypes.length
            ? contentTypes
            : [
                "Stories",
                "Reels/Short videos",
                "Carousel posts",
                "Live sessions",
              ],
          influencers: [],
          rawResponse: trendsContent, // Keep the full response for reference
        });
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching trends:", error);
      setLoading(false);
      // Optionally show error message to user
      alert("Failed to fetch trends. Please try again later.");
    }
  };

  // Helper functions to extract information from AI response (kept for fallback)
  const extractSection = (text, ...sectionHints) => {
    const lines = text.split("\n");
    const results = [];
    let capturing = false;

    // Look for sections that might contain our desired content
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].toLowerCase();

      // Check if this line indicates the start of our section
      const isStartOfSection = sectionHints.some(
        (hint) =>
          line.includes(hint.toLowerCase()) &&
          (line.includes(":") ||
            line.includes("-") ||
            line.match(/^\s*[\d#*-]\.?\s/))
      );

      if (isStartOfSection) {
        capturing = true;
        // If the line itself contains content after a delimiter, capture it
        const content = line.split(/:|–|-/).slice(1).join(":").trim();
        if (content && !content.match(/^\s*$/)) {
          results.push(content);
        }
        continue;
      }

      // If we're in a capturing section and hit another section header or empty line, stop capturing
      if (
        capturing &&
        (line.match(/^\s*$/) || line.match(/^#|^\d+\.|^[A-Z]/))
      ) {
        capturing = false;
      }

      // Capture bullet points and numbered items while in capturing mode
      if (capturing && line.match(/^\s*[\d#*•-]\.?\s/)) {
        const content = line.replace(/^\s*[\d#*•-]\.?\s/, "").trim();
        if (content) results.push(content);
      }
    }

    return results.filter((item) => item && item.length > 3).slice(0, 5); // Return up to 5 non-empty items
  };

  const extractHashtags = (text) => {
    // Extract actual hashtags
    const hashtagRegex = /#[a-zA-Z0-9_]+/g;
    const hashtags = text.match(hashtagRegex) || [];

    // Also look for hashtag suggestions that might not be formatted with #
    const lines = text.split("\n");
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].toLowerCase();
      if (line.includes("hashtag") || line.includes("tag")) {
        // Extract words that might be hashtag suggestions
        const parts = line.split(/[:,-]/).slice(1).join(":").trim();
        const words = parts.split(/\s+/);
        words.forEach((word) => {
          const cleaned = word.replace(/[^a-zA-Z0-9_]/g, "");
          if (cleaned && cleaned.length > 1) {
            // Add the # if it doesn't already have one
            if (!cleaned.startsWith("#")) {
              hashtags.push("#" + cleaned);
            } else {
              hashtags.push(cleaned);
            }
          }
        });
      }
    }

    return [...new Set(hashtags)].slice(0, 6); // Remove duplicates and limit to 6
  };

  const resetForm = () => {
    setResults(null);
    setLocation("");
    setBusinessType("");
    setPlatform("");
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-2">
          Social Media Trends Assistant
        </h1>
        <p className="text-center mb-8">
          Get AI-powered recommendations for trending content ideas tailored to
          your location and business type.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-0">
            <div className="flex items-start">
              <div className="mr-4 text-blue-500">
                <FaHashtag size={24} />
              </div>
              <div>
                <h3 className="text-xl font-semibold">
                  Trending Hashtags
                </h3>
                <p className="mt-2">
                  Discover location-specific trending hashtags that can increase
                  your content visibility and engagement.
                </p>
              </div>
            </div>
          </Card>

          <Card className="border-0">
            <div className="flex items-start">
              <div className="mr-4 text-purple-500">
                <FaChartLine size={24} />
              </div>
              <div>
                <h3 className="text-xl font-semibold">
                  Content Strategy
                </h3>
                <p className="mt-2">
                  Get platform-specific content format recommendations that
                  perform best for your industry.
                </p>
              </div>
            </div>
          </Card>

          <Card className="border-0">
            <div className="flex items-start">
              <div className="mr-4 text-pink-500">
                <FaLightbulb size={24} />
              </div>
              <div>
                <h3 className="text-xl font-semibold">
                  Actionable Ideas
                </h3>
                <p className="mt-2">
                  Receive practical content ideas that leverage current trends
                  while aligning with your business goals.
                </p>
              </div>
            </div>
          </Card>
        </div>

        {!results ? (
          <Card className="border-0">
            <h2 className="text-2xl font-bold mb-6">
              What's your business about?
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <div className="mb-2 block">
                  <Label
                    htmlFor="location"
                    value="Location"
                  />
                </div>
                <TextInput
                  id="location"
                  placeholder="e.g. New York, London, Tokyo"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>

              <div>
                <div className="mb-2 block">
                  <Label
                    htmlFor="businessType"
                    value="Business Type"
                  />
                </div>
                <TextInput
                  id="businessType"
                  placeholder="e.g. Coffee shop, Fashion boutique, Digital agency"
                  required
                  value={businessType}
                  onChange={(e) => setBusinessType(e.target.value)}
                />
              </div>

              <div>
                <div className="mb-2 block">
                  <Label
                    htmlFor="platform"
                    value="Social Media Platform"
                  />
                </div>
                <Select
                  id="platform"
                  required
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                >
                  <option value="" disabled>
                    Select platform
                  </option>
                  <option value="Instagram">Instagram</option>
                  <option value="TikTok">TikTok</option>
                  <option value="Facebook">Facebook</option>
                  <option value="Twitter">Twitter</option>
                  <option value="LinkedIn">LinkedIn</option>
                  <option value="Pinterest">Pinterest</option>
                </Select>
              </div>

              <div className="flex items-center text-sm text-gray-500 mt-4">
                <MdTravelExplore className="mr-2" />
                <p>
                  The more specific details you provide about your business and
                  location, the more accurate your trend recommendations will
                  be.
                </p>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                {loading ? (
                  <>
                    <Spinner size="sm" className="mr-3" />
                    Generating Recommendations...
                  </>
                ) : (
                  "Generate Trend Recommendations"
                )}
              </Button>
            </form>
          </Card>
        ) : (
          <Card className="border-0">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">
                Trending Content Recommendations
              </h2>
              <Button onClick={resetForm} size="sm" color="gray">
                New Search
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-blue-500 mb-3">
                    Content Ideas
                  </h3>
                  <ul className="list-disc pl-5 space-y-2">
                    {results.contentIdeas.map((idea, index) => (
                      <li key={index}>{idea}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-purple-500 mb-3">
                    Trending Hashtags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {results.hashtags.map((hashtag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 rounded-full text-sm bg-opacity-20 bg-purple-500"
                      >
                        {hashtag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-pink-500 mb-3">
                    Trending Audio & Themes
                  </h3>
                  <ul className="list-disc pl-5 space-y-2">
                    {results.audioThemes.map((theme, index) => (
                      <li key={index}>{theme}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-yellow-500 mb-3">
                    Recommended Content Types
                  </h3>
                  <ul className="list-disc pl-5 space-y-2">
                    {results.contentTypes.map((type, index) => (
                      <li key={index}>{type}</li>
                    ))}
                  </ul>
                </div>

                {results.influencers && results.influencers.length > 0 && (
                  <div>
                    <h3 className="text-xl font-semibold text-green-500 mb-3">
                      Trending Influencers
                    </h3>
                    <ul className="list-disc pl-5 space-y-2">
                      {results.influencers.map((influencer, index) => (
                        <li key={index}>{influencer}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-800 bg-opacity-30 rounded-lg">
              <h4 className="font-semibold mb-2 text-purple-500">
                Pro Tips for Implementation:
              </h4>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>
                  Post during peak hours for your region (typically 12-2pm and
                  6-8pm local time)
                </li>
                <li>
                  Engage with other accounts using the same trending hashtags
                </li>
                <li>
                  Create a content calendar incorporating these recommendations
                </li>
                <li>Measure engagement and adjust your strategy accordingly</li>
              </ul>
            </div>

            {results.rawResponse && (
              <div className="mt-6">
                <details className="text-sm">
                  <summary className="cursor-pointer text-gray-400 hover:text-gray-300">
                    View full AI analysis
                  </summary>
                  <div className="mt-3 p-4 bg-gray-100 dark:bg-gray-900 rounded-lg text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                    {results.rawResponse}
                  </div>
                </details>
              </div>
            )}
          </Card>
        )}

        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>
            Need more marketing help? Check out our{" "}
            <Link to="/dashboard?tab=seo-keywords">SEO Assistant</Link> and{" "}
            <Link to="/dashboard?tab=website-audit">Website Audit</Link> tools
          </p>
        </div>
      </div>
    </div>
  );
};

export default SocialMediaTrendsAssistant;  
