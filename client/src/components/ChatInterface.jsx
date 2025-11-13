import React, { useState, useRef, useEffect } from 'react';
import { sendMessage } from '../services/api';

const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!inputValue.trim() || isLoading) return;

    const userMessage = inputValue.trim();
    setInputValue('');

    // Add user message to chat
    setMessages(prev => [...prev, { type: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      // Build conversation history for DeepSeek (only include user/ai exchanges)
      const conversationHistory = messages
        .filter(msg => msg.type === 'user' || msg.type === 'ai')
        .map(msg => {
          if (msg.type === 'user') {
            return {
              role: 'user',
              content: msg.content
            };
          } else if (msg.type === 'ai') {
            return {
              role: 'assistant',
              content: msg.content.answer
            };
          }
          return null;
        })
        .filter(msg => msg !== null);

      // Call the API with conversation history
      const response = await sendMessage(userMessage, conversationHistory);

      // Add AI response to chat
      setMessages(prev => [
        ...prev,
        {
          type: 'ai',
          content: {
            answer: response.answer,
            projects: response.projects || []
          }
        }
      ]);
    } catch (error) {
      // Add error message to chat
      setMessages(prev => [
        ...prev,
        {
          type: 'error',
          content: error.message || 'Sorry, something went wrong. Please try again.'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="chat-container">
      <div className="messages-area">
        {messages.map((msg, index) => (
          <div key={index} className={`message message-${msg.type}`}>
            {msg.type === 'user' ? (
              <div className="message-content">
                <div className="message-text">{msg.content}</div>
              </div>
            ) : msg.type === 'error' ? (
              <div className="message-content error">
                <div className="message-text">{msg.content}</div>
              </div>
            ) : (
              <div className="message-content">
                <div className="message-text">{msg.content.answer}</div>

                {msg.content.projects && msg.content.projects.length > 0 && (
                  <div className="projects-list">
                    <div className="projects-header">Recommended Projects:</div>
                    {msg.content.projects.map((project, idx) => (
                      <div key={idx} className="project-card">
                        <div className="project-title">{project.title}</div>
                        <div className="project-description">{project.description}</div>
                        {project.relevanceReason && (
                          <div className="project-relevance">
                            💡 {project.relevanceReason}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="message message-ai">
            <div className="message-content">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <form className="input-area" onSubmit={handleSubmit}>
        <input
          type="text"
          className="message-input"
          placeholder="Ask about student projects..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isLoading}
        />
        <button
          type="submit"
          className="send-button"
          disabled={isLoading || !inputValue.trim()}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </button>
      </form>
    </div>
  );
};

export default ChatInterface;
