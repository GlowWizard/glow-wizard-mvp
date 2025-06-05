// backend/recommendation-engine.js
require('dotenv').config();
const { OpenAI } = require('openai');

// Initialize OpenAI with your API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  timeout: 15000 // 15 second timeout
});

// Main recommendation function
async function generateRecommendations(userProfile, photoAnalysis) {
  try {
    // Build the AI prompt
    const prompt = buildChainOfThoughtPrompt(userProfile, photoAnalysis);
    
    // Get AI response
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{
        role: "system", 
        content: "You are a dermatology expert providing personalized skincare recommendations."
      }, {
        role: "user",
        content: prompt
      }],
      temperature: 0.3,
      max_tokens: 1500
    });

    // Process the AI response
    return parseAIResponse(response.choices[0].message.content);
    
  } catch (error) {
    handleAIError(error);
  }
}

// Helper function to build the prompt
function buildChainOfThoughtPrompt(profile, photos) {
  return `
  **User Profile Analysis**
  Skin Type: ${profile.skinType}
  Primary Concerns: ${profile.concerns.join(", ")}
  Sensitivity Level: ${profile.sensitivityLevel}
  Age Group: ${profile.ageGroup}
  
  **Photo Analysis**
  ${photos.summary || "No significant findings detected"}
  
  **Recommendation Steps**
  1. Analyze skin type and concerns
  2. Identify key ingredients to recommend
  3. Suggest specific products from our approved list
  4. Create morning/night routine
  
  **Required Output Format**
  {
    "recommendations": [
      {
        "category": "Cleanser|Moisturizer|Treatment",
        "product": "Brand Name Product",
        "ingredients": ["Hyaluronic Acid", "Niacinamide"],
        "routine": "Morning|Night|Both",
        "reasoning": "Explanation for this recommendation"
      }
    ]
  }`;
}

// Response parsing function
function parseAIResponse(responseText) {
  try {
    // Extract JSON from response
    const jsonStart = responseText.indexOf('{');
    const jsonEnd = responseText.lastIndexOf('}') + 1;
    const cleanJson = responseText.slice(jsonStart, jsonEnd);
    
    const result = JSON.parse(cleanJson);
    
    // Validate response structure
    if (!result.recommendations || !Array.isArray(result.recommendations)) {
      throw new Error('Invalid response format from AI');
    }
    
    return result;
    
  } catch (error) {
    throw new Error(`RESPONSE_PARSE_ERROR: ${error.message}`);
  }
}

// Error handling function
function handleAIError(error) {
  if (error.status === 429) {
    throw new Error('API_RATE_LIMIT: Please wait before making new requests');
  }
  if (error.code === 'ETIMEDOUT') {
    throw new Error('API_TIMEOUT: Response took too long');
  }
  throw new Error(`API_ERROR: ${error.message}`);
}

// Export the main function
module.exports = { generateRecommendations };
