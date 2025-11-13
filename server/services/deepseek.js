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
 * @param {Array} conversationHistory - Previous messages in the conversation
 * @param {boolean} isSmallTalk - Whether this is casual conversation (no projects needed)
 * @returns {Promise<Object>} - Returns { answer: string, projects: Array }
 */
async function callDeepSeek(userMessage, relevantProjects, conversationHistory = [], isSmallTalk = false) {
  if (!DEEPSEEK_API_KEY) {
    throw new Error('DEEPSEEK_API_KEY is not set. Please add it to your .env file.');
  }

  // Build the system prompt based on whether it's small talk or project search
  const systemPrompt = isSmallTalk
    ? `You are a friendly, helpful AI assistant for a student projects archive.

Your task:
1. Respond to casual conversation naturally and warmly
2. When greeting users, ask what kind of projects they're interested in
3. Keep responses brief but engaging (1-2 sentences)
4. Suggest topics they can ask about: mental health, productivity, wellness, stress, social connection
5. Format your response as JSON

Response format (strict JSON):
{
  "answer": "A warm, friendly response. For greetings, say hi and ask what projects they'd like to explore. Suggest example topics.",
  "recommendedProjects": []
}

Examples:
- User: "hi" → "Hi there! 👋 I can help you discover student projects from our archive. What are you interested in? Mental health, productivity, wellness, or something else?"
- User: "thanks" → "You're welcome! Let me know if you'd like to explore more projects."

Guidelines:
- Be warm and conversational
- Keep it brief (1-2 sentences)
- Always suggest what they can ask about
- No projects in small talk responses`
    : `You are an intelligent assistant that helps users discover relevant student projects from an archive.

Your task:
1. Analyze the user's question carefully, considering the conversation history
2. Review the provided list of student projects
3. If the user asks for more details about a specific project, provide detailed information about that project
4. If it's a general question, select the most relevant projects (2-5 projects max)
5. Provide a brief, helpful explanation of why these projects are relevant
6. Format your response as JSON

Response format (strict JSON):
{
  "answer": "A conversational explanation. If user asks for more details, provide in-depth information about features, use cases, target audience, and unique aspects. For general questions, give a brief overview (2-3 sentences).",
  "recommendedProjects": [
    {
      "id": 1,
      "title": "Project Title",
      "description": "Brief or detailed description depending on context",
      "relevanceReason": "Explain why this project matches the user's needs or provide additional context if they asked for details"
    }
  ]
}

Guidelines:
- Be conversational and helpful
- REMEMBER the conversation context - if user mentions a project name, they're referring to previously shown projects
- When user asks "tell me more about X", provide detailed, expanded information about that specific project
- For follow-up questions, be more detailed and specific
- Only recommend projects that truly match the user's question
- Keep your answer concise for general queries, detailed for specific questions
- If no projects are provided, politely suggest topics they can ask about: mental health, productivity, wellness, stress relief`;

  // Build the user message with projects data (if any)
  let userPrompt;

  if (isSmallTalk || relevantProjects.length === 0) {
    userPrompt = `User Message: "${userMessage}"

Please respond in a friendly, conversational way.`;
  } else {
    const projectsContext = relevantProjects.map(p =>
      `ID: ${p.id}\nTitle: ${p.title}\nDescription: ${p.description}\nTags: ${p.tags.join(', ')}`
    ).join('\n\n');

    userPrompt = `User Question: "${userMessage}"

Available Projects:
${projectsContext}

Please analyze the user's question and recommend the most relevant projects from the list above.`;
  }

  // Build the messages array with conversation history
  const messages = [
    {
      role: 'system',
      content: systemPrompt
    },
    // Add conversation history
    ...conversationHistory,
    // Add current user message with project context
    {
      role: 'user',
      content: userPrompt
    }
  ];

  try {
    const response = await axios.post(
      DEEPSEEK_API_URL,
      {
        model: 'deepseek-chat',
        messages: messages,
        temperature: 0.7,
        max_tokens: 1500,
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
