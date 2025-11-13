const express = require('express');
const router = express.Router();
const { callDeepSeek } = require('../services/deepseek');
const projects = require('../data/projects.json');

/**
 * Simple keyword matching to find relevant projects
 * TODO: Replace this with a proper vector database or semantic search later
 */
function findRelevantProjects(userMessage, maxResults = 8) {
  const messageLower = userMessage.toLowerCase();
  const words = messageLower.split(/\s+/);

  // Score each project based on keyword matches
  const scoredProjects = projects.map(project => {
    let score = 0;
    const searchText = `${project.title} ${project.description} ${project.tags.join(' ')}`.toLowerCase();

    // Check for word matches
    words.forEach(word => {
      if (word.length > 2) { // Ignore very short words
        if (searchText.includes(word)) {
          score += 1;
        }
      }
    });

    // Bonus points for tag matches
    project.tags.forEach(tag => {
      if (messageLower.includes(tag.toLowerCase())) {
        score += 3;
      }
    });

    return { ...project, score };
  });

  // Sort by score and return top results
  return scoredProjects
    .filter(p => p.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults)
    .map(p => {
      const { score, ...projectWithoutScore } = p;
      return projectWithoutScore;
    });
}

/**
 * POST /api/chat
 * Main chat endpoint that processes user messages and returns AI responses
 */
router.post('/', async (req, res) => {
  try {
    const { message } = req.body;

    // Validate input
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({
        error: 'Message is required and must be a non-empty string'
      });
    }

    // Find relevant projects based on keywords
    const relevantProjects = findRelevantProjects(message);

    // If no relevant projects found, return a helpful message
    if (relevantProjects.length === 0) {
      return res.json({
        answer: "I couldn't find any projects that match your query. Try asking about mental health, stress, productivity, or wellness-related projects.",
        projects: []
      });
    }

    // Call DeepSeek API with the user message and relevant projects
    const aiResponse = await callDeepSeek(message, relevantProjects);

    // Return the response
    res.json({
      answer: aiResponse.answer,
      projects: aiResponse.projects
    });

  } catch (error) {
    console.error('Chat endpoint error:', error);

    res.status(500).json({
      error: error.message || 'An error occurred while processing your request'
    });
  }
});

module.exports = router;
