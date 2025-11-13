const axios = require('axios');

/**
 * DeepSeek API Service
 * Handles communication with the DeepSeek API
 */

// DeepSeek API Configuration
// TODO: Get your API key from https://platform.deepseek.com
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || '';
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

/**
 * Call DeepSeek API with a prompt
 * @param {string} userMessage - The user's question
 * @param {Array} relevantProjects - Array of relevant projects to include in the prompt
 * @returns {Promise<Object>} - Returns { answer: string, projects: Array }
 */
async function callDeepSeek(userMessage, relevantProjects) {
  if (!DEEPSEEK_API_KEY) {
    throw new Error('DEEPSEEK_API_KEY is not set. Please add it to your .env file.');
  }

  // Build the system prompt
  const systemPrompt = `You are an intelligent assistant that helps users discover relevant student projects from an archive.

Your task:
1. Analyze the user's question carefully
2. Review the provided list of student projects
3. Select the most relevant projects (2-5 projects max)
4. Provide a brief, helpful explanation of why these projects are relevant
5. Format your response as JSON

Response format (strict JSON):
{
  "answer": "A brief, conversational explanation (2-3 sentences) of why these projects are relevant to the user's question",
  "recommendedProjects": [
    {
      "id": 1,
      "title": "Project Title",
      "description": "Brief description",
      "relevanceReason": "One sentence explaining why this project matches the user's needs"
    }
  ]
}

Guidelines:
- Be conversational and helpful
- Only recommend projects that truly match the user's question
- Explain the connection between the question and the projects
- Keep your answer concise but informative`;

  // Build the user message with projects data
  const projectsContext = relevantProjects.map(p =>
    `ID: ${p.id}\nTitle: ${p.title}\nDescription: ${p.description}\nTags: ${p.tags.join(', ')}`
  ).join('\n\n');

  const userPrompt = `User Question: "${userMessage}"

Available Projects:
${projectsContext}

Please analyze the user's question and recommend the most relevant projects from the list above.`;

  try {
    const response = await axios.post(
      DEEPSEEK_API_URL,
      {
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: userPrompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000,
        response_format: { type: 'json_object' }
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
        }
      }
    );

    const aiResponse = response.data.choices[0].message.content;

    // Parse the JSON response
    const parsedResponse = JSON.parse(aiResponse);

    return {
      answer: parsedResponse.answer,
      projects: parsedResponse.recommendedProjects || []
    };
  } catch (error) {
    console.error('DeepSeek API Error:', error.response?.data || error.message);

    // Provide more specific error messages
    if (error.response?.status === 401) {
      throw new Error('Invalid DeepSeek API key. Please check your DEEPSEEK_API_KEY in .env file.');
    } else if (error.response?.status === 429) {
      throw new Error('Rate limit exceeded. Please try again later.');
    } else if (error.message.includes('JSON')) {
      throw new Error('Failed to parse AI response. Please try again.');
    } else {
      throw new Error('Failed to get response from DeepSeek API: ' + (error.response?.data?.error?.message || error.message));
    }
  }
}

module.exports = { callDeepSeek };
