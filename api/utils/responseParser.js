// utils/responseParser.js

/**
 * Parse the AI-generated content from unstructured text format
 * into a structured object similar to our JSON schema
 * 
 * @param {string} text - The raw text response from the AI
 * @returns {Object} - A structured object with parsed data
 */
export const parseUnstructuredResponse = (text) => {
  // Initialize the result object with default empty values
  const result = {
    contentIdeas: [],
    hashtags: [],
    audio: [],
    contentFormat: {
      recommended: "",
      reason: ""
    },
    growthHacks: [],
    influencers: []
  };

  try {
    // Extract content ideas
    const contentIdeasSection = extractSection(text, "content ideas", "unique content ideas");
    result.contentIdeas = contentIdeasSection.map(idea => {
      // Try to extract title and description
      const titleMatch = idea.match(/^(?:\*\*)?([^:]+)(?:\*\*)?:(.+)/);
      if (titleMatch) {
        return {
          title: titleMatch[1].trim().replace(/\*\*/g, ''),
          description: titleMatch[2].trim()
        };
      }
      return { title: "Content Idea", description: idea };
    });

    // Extract hashtags
    result.hashtags = extractHashtags(text);

    // Extract audio info
    const audioSection = extractSection(text, "viral songs", "trending songs", "audio");
    result.audio = audioSection.map(audio => {
      // Try to parse artist and title
      const songMatch = audio.match(/"([^"]+)"\s+by\s+(.+)/i) || 
                        audio.match(/([^"]+)\s+by\s+(.+)/i);
      if (songMatch) {
        return {
          title: songMatch[1].trim(),
          artist: songMatch[2].trim()
        };
      }
      return { title: audio, artist: "Unknown Artist" };
    });

    // Extract content format
    const formatSection = extractSection(text, "content format", "format");
    if (formatSection.length > 0) {
      const formatText = formatSection[0];
      const formatMatch = formatText.match(/^(?:\*\*)?([^:]+)(?:\*\*)?:(.+)/);
      if (formatMatch) {
        result.contentFormat = {
          recommended: formatMatch[1].trim().replace(/\*\*/g, ''),
          reason: formatMatch[2].trim()
        };
      } else {
        result.contentFormat = {
          recommended: "Recommended Format",
          reason: formatText
        };
      }
    }

    // Extract growth hacks
    const growthSection = extractSection(text, "growth hacks", "non-generic growth hacks");
    result.growthHacks = growthSection.map(hack => {
      const hackMatch = hack.match(/^(?:\*\*)?([^:]+)(?:\*\*)?:(.+)/);
      if (hackMatch) {
        return {
          title: hackMatch[1].trim().replace(/\*\*/g, ''),
          description: hackMatch[2].trim()
        };
      }
      return { title: "Growth Strategy", description: hack };
    });

    // Extract influencers
    const influencerSection = extractSection(text, "influencers", "trending influencers");
    result.influencers = influencerSection.map(influencer => {
      // Try to extract username if present
      const usernameMatch = influencer.match(/\(@([^)]+)\)/i) || 
                           influencer.match(/@([a-zA-Z0-9_]+)/i);
      const nameMatch = influencer.match(/^(?:\*\*)?([^:(@]+)(?:\*\*)?[:(]/);
      
      return {
        name: nameMatch ? nameMatch[1].trim().replace(/\*\*/g, '') : "Influencer",
        username: usernameMatch ? "@" + usernameMatch[1].trim() : "@username",
        reason: influencer.replace(/^[^:]+:\s*/, "").trim()
      };
    });

    // Generate a formatted raw response for consistency
    const formattedRawResponse = `
## Content Ideas
${result.contentIdeas.map((idea, i) => `${i+1}. **${idea.title}**: ${idea.description}`).join('\n\n')}

## Trending Hashtags
${result.hashtags.join(' ')}

## Viral Audio
${result.audio.map(item => `- "${item.title}" by ${item.artist}`).join('\n')}

## Best Content Format
**${result.contentFormat.recommended}**: ${result.contentFormat.reason}

## Growth Hacks
${result.growthHacks.map((hack, i) => `${i+1}. **${hack.title}**: ${hack.description}`).join('\n\n')}

## Trending Influencers
${result.influencers.map((inf, i) => `${i+1}. **${inf.name}** (${inf.username}): ${inf.reason}`).join('\n\n')}
`;

    result.rawResponse = formattedRawResponse;
    
    return result;
  } catch (error) {
    console.error("Error parsing unstructured response:", error);
    return {
      contentIdeas: [
        { title: "Create engaging content", description: "Focus on authentic behind-the-scenes content that shows your process and team." },
        { title: "User testimonials", description: "Showcase real customer experiences with your products or services." },
        { title: "Industry insights", description: "Share valuable tips and trends related to your business niche." }
      ],
      hashtags: ["#TrendingNow", "#YourIndustry", "#LocalBusiness", "#ContentCreation", "#SocialMedia"],
      audio: [
        { title: "Popular trending song", artist: "Popular Artist" },
        { title: "Viral sound", artist: "Trending Creator" }
      ],
      contentFormat: {
        recommended: "Reels/Short Videos",
        reason: "Short-form video content currently receives the highest engagement and algorithmic preference."
      },
      growthHacks: [
        { title: "Engage with trending topics", description: "Comment on and participate in conversations around current trends in your niche." },
        { title: "Local partnerships", description: "Collaborate with complementary local businesses for cross-promotion." }
      ],
      influencers: [
        { title: "Micro-influencers", username: "@relevant_influencer", reason: "They have a highly engaged audience in your specific niche." }
      ],
      rawResponse: text
    };
  }
};

/**
 * Extract specific sections from unstructured text
 */
const extractSection = (text, ...sectionHints) => {
  const lines = text.split("\n");
  const results = [];
  let capturing = false;
  let captureBuffer = "";

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
      
      // If we have something in the buffer, add it
      if (captureBuffer.trim()) {
        results.push(captureBuffer.trim());
        captureBuffer = "";
      }
      
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
      (line.match(/^\s*$/) || line.match(/^#|^\d+\.|^[A-Z][A-Za-z\s]+:/))
    ) {
      // If we have something in the buffer, add it
      if (captureBuffer.trim()) {
        results.push(captureBuffer.trim());
        captureBuffer = "";
      }
      capturing = false;
    }

    // Capture content while in capturing mode
    if (capturing) {
      // Handle bullet points and numbered items
      if (line.match(/^\s*[\d#*•-]\.?\s/)) {
        // If we have something in the buffer, add it first
        if (captureBuffer.trim()) {
          results.push(captureBuffer.trim());
          captureBuffer = "";
        }
        
        const content = line.replace(/^\s*[\d#*•-]\.?\s/, "").trim();
        if (content) results.push(content);
      } 
      // Handle paragraphs that may span multiple lines
      else if (line.trim()) {
        captureBuffer += " " + line.trim();
      }
    }
  }

  // Don't forget to add any remaining buffer
  if (capturing && captureBuffer.trim()) {
    results.push(captureBuffer.trim());
  }

  return results.filter((item) => item && item.length > 3).slice(0, 5); // Return up to 5 non-empty items
};

/**
 * Extract hashtags from text content
 */
const extractHashtags = (text) => {
  // Extract actual hashtags with the # symbol
  const hashtagRegex = /#[a-zA-Z0-9_]+/g;
  const hashtags = text.match(hashtagRegex) || [];

  // Look for hashtag sections
  const lines = text.split("\n");
  let inHashtagSection = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].toLowerCase();
    
    // Check if we're entering a hashtag section
    if (line.includes("hashtag") || line.includes(" tag")) {
      inHashtagSection = true;
      continue;
    }
    
    // Check if we're exiting a hashtag section
    if (inHashtagSection && (line.trim() === "" || line.match(/^#|^\d+\.|^[A-Z][A-Za-z\s]+:/))) {
      inHashtagSection = false;
      continue;
    }
    
    // If we're in a hashtag section, extract potential hashtags
    if (inHashtagSection) {
      // Extract words that might be hashtag suggestions
      const words = line.trim().split(/[\s,]+/);
      words.forEach((word) => {
        // Clean the word
        const cleaned = word.replace(/[^a-zA-Z0-9_#]/g, "");
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