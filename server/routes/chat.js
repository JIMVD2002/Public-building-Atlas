const express = require('express');
const router = express.Router();
const { callDeepSeek } = require('../services/deepseek');
const projects = require('../data/projects.json');

/**
 * Detect if the message is small talk (greetings, casual conversation)
 */
function isSmallTalk(message) {
  const messageLower = message.toLowerCase().trim();
  const smallTalkPatterns = [
    // Greetings
    /^(hi|hey|hello|hoi|hola|hiya|sup|yo)$/i,
    /^(hi|hey|hello|hoi|hola)\s*(there|guys?|everyone)?[!.]?$/i,
    // How are you
    /^(how are you|how's it going|what's up|wassup|whats up)/i,
    // Thanks
    /^(thanks?|thank you|thx|ty)$/i,
    /^(ok|okay|cool|nice|great|awesome|perfect)$/i,
    // Goodbyes
    /^(bye|goodbye|see you|cya|later)$/i,
  ];

  return smallTalkPatterns.some(pattern => pattern.test(messageLower));
}

/**
 * Detect special commands (compare, filter, similar, quick facts, use case)
 */
function detectSpecialCommand(message) {
  const messageLower = message.toLowerCase().trim();

  // Compare command
  if (/compare\s+.+\s+(and|with|vs)\s+.+/i.test(messageLower)) {
    return 'compare';
  }

  // Filter command
  if (/filter\s+by|show\s+me\s+(mobile|web|ai|only)/i.test(messageLower) ||
      /mobile\s+apps?|web\s+apps?/i.test(messageLower)) {
    return 'filter';
  }

  // Similar projects command
  if (/similar\s+(to|projects?)|like\s+this|alternatives/i.test(messageLower)) {
    return 'similar';
  }

  // Quick facts command
  if (/quick\s+facts?|tell\s+me\s+facts?|facts?\s+about/i.test(messageLower)) {
    return 'quick_facts';
  }

  // Use case / Emotional context
  if (/^(i'm|i am|i feel)\s+(stressed|anxious|lonely|overwhelmed|burnout|burnt out|depressed|tired|exhausted|sad)/i.test(messageLower) ||
      /help\s+me\s+with|struggling\s+with|dealing\s+with|i\s+can'?t\s+(focus|sleep|concentrate)/i.test(messageLower)) {
    return 'use_case';
  }

  return null;
}

/**
 * Enhanced project finding based on command type
 */
function findProjectsForCommand(userMessage, commandType, maxResults = 8) {
  const messageLower = userMessage.toLowerCase();

  switch (commandType) {
    case 'compare':
      // For compare, get ALL projects to let AI choose the right ones
      return projects;

    case 'filter':
      // Filter by specific criteria
      return projects.filter(project => {
        const searchText = `${project.title} ${project.description} ${project.tags.join(' ')}`.toLowerCase();

        if (messageLower.includes('mobile')) {
          return searchText.includes('mobile') || searchText.includes('app');
        }
        if (messageLower.includes('web')) {
          return searchText.includes('web') || searchText.includes('application');
        }
        if (messageLower.includes('ai')) {
          return searchText.includes('ai') || searchText.includes('chatbot');
        }

        return true;
      });

    case 'similar':
      // Return all projects so AI can find similar ones based on context
      return projects;

    case 'quick_facts':
      // Return all projects so AI can find the specific one mentioned
      return projects;

    case 'use_case':
      // For emotional/use case queries, use standard search
      return findRelevantProjects(userMessage, maxResults);

    default:
      return findRelevantProjects(userMessage, maxResults);
  }
}

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
    const { message, conversationHistory } = req.body;

    // Validate input
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({
        error: 'Message is required and must be a non-empty string'
      });
    }

    // Check if it's small talk (greetings, casual conversation)
    if (isSmallTalk(message)) {
      // Let AI handle small talk without projects
      const aiResponse = await callDeepSeek(message, [], conversationHistory || [], true);
      return res.json({
        answer: aiResponse.answer,
        projects: []
      });
    }

    // Detect special commands
    const commandType = detectSpecialCommand(message);

    // Find relevant projects based on command type or keywords
    const relevantProjects = commandType
      ? findProjectsForCommand(message, commandType)
      : findRelevantProjects(message);

    // If no relevant projects found, still ask the AI for a helpful response
    if (relevantProjects.length === 0) {
      // Pass empty projects array but let AI respond helpfully
      const aiResponse = await callDeepSeek(message, [], conversationHistory || [], false);
      return res.json({
        answer: aiResponse.answer,
        projects: []
      });
    }

    // Call DeepSeek API with the user message, relevant projects, and conversation history
    const aiResponse = await callDeepSeek(message, relevantProjects, conversationHistory || [], false);

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
