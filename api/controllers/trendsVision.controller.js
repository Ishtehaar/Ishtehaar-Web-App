import { getGoogleTrendsForLocation }from "../utils/googleTrends.js";
import OpenAI from "openai";
import User from "../models/user.model.js";
import axios from "axios";
// import { getGoogleTrendsForLocation } from "../utils/googleTrends.js";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Updated fetchLatestTrends function

export const fetchLatestTrends = async (req, res, next) => {
  const { location, businessType, platform } = req.body;

  if (!location || !businessType || !platform) {
    return res.status(400).json({
      success: false,
      message: "Location, business type, and platform are required",
    });
  }

  try {
    // 1. Get Google Trends for that location
    const trendKeywords = await getGoogleTrendsForLocation(location);

    // 2. Updated prompt with structured format instructions
    const enrichedPrompt = `
You are a highly professional and research-backed digital marketing strategist. You are helping a ${businessType} business from ${location} plan a viral campaign on ${platform}.

Current search trends in ${location}:
${trendKeywords
  .slice(0, 10)
  .map((t, i) => `${i + 1}. ${t}`)
  .join("\n")}

Now generate the following specifically:

1. 📸 **3 unique, specific content ideas** for this ${businessType} business that use the actual trends mentioned above. Include what the content will look like and why it will work in ${location}.
2. 🔥 **5 trending hashtags** that combine both business niche and current trend keywords.
3. 🎵 **2 currently viral songs/audio** on ${platform} that are trending in ${location}. Mention their exact names and artists or creators.
4. 📲 Suggest **best content format** (e.g., Story, Reel, Carousel, Live) with a strong reason tied to engagement patterns.
5. 📈 Provide **2 non-generic growth hacks** that businesses in ${location} can apply to increase engagement.
6. 👤 **3 trending influencers** on ${platform} in ${location} or globally (but relevant to ${businessType}) that this business could collaborate with for higher reach. Include their @username or profile name if known, and why they're suitable.

⚠️ Important:
- Don't be generic.
- Don't repeat the question.
- Use current trend knowledge.
- Include actual song/influencer names (most popular one in ${location}).
- Sound like an expert, not a chatbot.
- Format your output in the following JSON structure, with NO extra text before or after:

{
  "contentIdeas": [
    {
      "title": "Idea title here",
      "description": "Full description here"
    },
    {
      "title": "Second idea title here",
      "description": "Second full description here"
    },
    {
      "title": "Third idea title here",
      "description": "Third full description here"
    }
  ],
  "hashtags": ["#Hashtag1", "#Hashtag2", "#Hashtag3", "#Hashtag4", "#Hashtag5"],
  "audio": [
    {
      "title": "Song/Audio name",
      "artist": "Artist name"
    },
    {
      "title": "Second song/audio name",
      "artist": "Second artist name"
    }
  ],
  "contentFormat": {
    "recommended": "Recommended format (e.g. Reels, Stories)",
    "reason": "Full explanation why this format works best"
  },
  "growthHacks": [
    {
      "title": "First growth hack title",
      "description": "Detailed growth hack description"
    },
    {
      "title": "Second growth hack title",
      "description": "Detailed second growth hack description"
    }
  ],
  "influencers": [
    {
      "name": "Influencer name",
      "username": "@username if known",
      "reason": "Why they're suitable for this business"
    },
    {
      "name": "Second influencer name",
      "username": "@username if known",
      "reason": "Why they're suitable for this business"
    },
    {
      "name": "Third influencer name",
      "username": "@username if known",
      "reason": "Why they're suitable for this business"
    }
  ]
}
    `;

    // 3. GPT call
    const gptResponse = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "You are a detailed digital marketing strategist. Give hyper-specific, realistic, trend-driven recommendations. Format your response ONLY as a valid JSON object according to the schema provided. Include no other text before or after the JSON.",
        },
        {
          role: "user",
          content: enrichedPrompt,
        },
      ],
      response_format: { type: "json_object" }, // Ensure JSON response format
    });

    let generatedContent = gptResponse.choices[0]?.message?.content;

    try {
      // Try to parse the JSON
      const parsedContent = JSON.parse(generatedContent);
      
      // Add the raw text for reference
      const formattedRawResponse = `
## Content Ideas
${parsedContent.contentIdeas.map((idea, i) => `${i+1}. **${idea.title}**: ${idea.description}`).join('\n\n')}

## Trending Hashtags
${parsedContent.hashtags.join(' ')}

## Viral Audio
${parsedContent.audio.map(item => `- "${item.title}" by ${item.artist}`).join('\n')}

## Best Content Format
**${parsedContent.contentFormat.recommended}**: ${parsedContent.contentFormat.reason}

## Growth Hacks
${parsedContent.growthHacks.map((hack, i) => `${i+1}. **${hack.title}**: ${hack.description}`).join('\n\n')}

## Trending Influencers
${parsedContent.influencers.map((inf, i) => `${i+1}. **${inf.name}** (${inf.username}): ${inf.reason}`).join('\n\n')}
`;

      parsedContent.rawResponse = formattedRawResponse;
      
      // Return structured data and raw text
      res.status(200).json({
        success: true,
        structured: true,
        trends: parsedContent
      });
    } catch (parseError) {
      // If parsing fails, return the raw response
      console.error("Error parsing AI response:", parseError);
      
      // Return as unstructured data
      res.status(200).json({
        success: true,
        structured: false,
        trends: generatedContent
      });
    }
  } catch (error) {
    console.error("Error generating trends:", error);
    next(error);
  }
};