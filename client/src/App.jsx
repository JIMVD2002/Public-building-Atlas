import React from 'react';
import ChatInterface from './components/ChatInterface';

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">Studio Archive AI</h1>
        <p className="app-subtitle">Discover student projects with AI</p>
      </header>

      <main className="app-main">
        <ChatInterface />
      </main>
    </div>
  );
}

export default App;
