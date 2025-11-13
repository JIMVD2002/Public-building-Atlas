/**
 * API Service
 * Handles communication with the backend server
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

/**
 * Send a chat message to the backend
 * @param {string} message - The user's message
 * @returns {Promise<Object>} - Returns { answer: string, projects: Array }
 */
export async function sendMessage(message) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to get response from server');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

/**
 * Check server health
 * @returns {Promise<Object>}
 */
export async function checkHealth() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/health`);
    return await response.json();
  } catch (error) {
    console.error('Health check failed:', error);
    throw error;
  }
}
