# Studio Archive AI

A minimal, clean web application with a central AI chat interface connected to the DeepSeek API, using a student projects database as its knowledge base.

![Studio Archive AI](https://img.shields.io/badge/Status-Ready-green)
![React](https://img.shields.io/badge/React-18.2.0-blue)
![Node.js](https://img.shields.io/badge/Node.js-Express-green)
![DeepSeek](https://img.shields.io/badge/AI-DeepSeek-purple)

## 🎯 What Does This App Do?

Ask questions like **"What projects could help with mental health?"** and get:
- A short, AI-generated answer
- A curated list of relevant student projects with explanations
- Clean, focused chat interface inspired by Grokpedia

## ✨ Features

- **Clean, Minimal UI**: Centered chat interface with no clutter
- **AI-Powered Recommendations**: DeepSeek AI analyzes and recommends relevant projects
- **Smart Project Matching**: Keyword-based filtering + AI reasoning
- **Responsive Design**: Works beautifully on desktop and mobile
- **Real-time Chat**: Smooth conversation flow with typing indicators

## 🏗️ Project Structure

```
studio-archive-ai/
├── server/                 # Backend (Node.js + Express)
│   ├── server.js          # Main server file
│   ├── routes/
│   │   └── chat.js        # Chat API endpoint
│   ├── services/
│   │   └── deepseek.js    # DeepSeek API integration
│   └── data/
│       └── projects.json  # Mock student projects database
├── client/                 # Frontend (React)
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── App.jsx        # Main app component
│       ├── App.css        # Styles
│       ├── components/
│       │   └── ChatInterface.jsx
│       └── services/
│           └── api.js     # Backend API calls
├── package.json
├── .env.example
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v16 or higher)
- **npm** (comes with Node.js)
- **DeepSeek API Key** (get one at [platform.deepseek.com](https://platform.deepseek.com))

### Installation

1. **Clone or download this repository**

2. **Install dependencies for both frontend and backend**

```bash
# Install root dependencies
npm install

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

3. **Set up your DeepSeek API key**

Create a `.env` file in the `server/` directory:

```bash
cd server
cp .env.example .env
```

Edit `server/.env` and add your API key:

```
DEEPSEEK_API_KEY=your_actual_api_key_here
PORT=3001
```

**🔑 Where to put your DeepSeek API key:**
- File: `server/.env`
- Variable: `DEEPSEEK_API_KEY`
- Get your key at: https://platform.deepseek.com

### Running the App

**Option 1: Run both frontend and backend together (recommended)**

From the root directory:

```bash
npm run dev
```

**Option 2: Run separately**

In one terminal (backend):
```bash
cd server
npm start
```

In another terminal (frontend):
```bash
cd client
npm start
```

The app will open automatically at **http://localhost:3000**

The backend API runs at **http://localhost:3001**

## 🎨 Design Philosophy

The UI is inspired by **Grokpedia** with:
- White/light background for clarity
- Centered chat card for focus
- Clean chat bubbles for user and AI
- Single input field + send button
- No sidebars, no complex navigation
- Responsive design for all devices

## 💬 How It Works

### User Flow

1. User asks a question in the chat
2. Frontend sends the message to the backend
3. Backend filters relevant projects by keywords/tags
4. Backend sends the question + projects to DeepSeek API
5. DeepSeek AI analyzes and selects the best matches
6. Frontend displays the AI's answer + project recommendations

### Backend Architecture

**POST /api/chat**
- Receives user message
- Filters mock projects by keyword matching
- Calls DeepSeek API with structured prompt
- Returns AI response + recommended projects

**Key Files:**
- `server/routes/chat.js` - Main chat endpoint
- `server/services/deepseek.js` - DeepSeek API integration
- `server/data/projects.json` - Mock student projects

### Frontend Architecture

**Components:**
- `App.jsx` - Main app with header
- `ChatInterface.jsx` - Complete chat UI with messages, input, and loading states

**Features:**
- Message history (user + AI messages)
- Typing indicator during API calls
- Project cards with hover effects
- Auto-scroll to latest message
- Error handling

## 🔧 Customization

### Adding More Projects

Edit `server/data/projects.json`:

```json
{
  "id": 13,
  "title": "Your Project Title",
  "description": "A brief description of what this project does",
  "tags": ["tag1", "tag2", "tag3"]
}
```

### Replacing with a Real Database

**In `server/routes/chat.js`:**

Replace this line:
```javascript
const projects = require('../data/projects.json');
```

With your database query:
```javascript
const projects = await db.query('SELECT * FROM projects');
```

Update the `findRelevantProjects` function to use vector search or semantic search for better results.

### Customizing the AI Prompt

**In `server/services/deepseek.js`:**

Edit the `systemPrompt` variable to change how the AI responds.

### Styling

**In `client/src/App.css`:**

Modify colors, fonts, spacing, etc. The CSS is well-organized with clear sections.

## 📝 Example Questions to Try

- "What projects could help with mental health?"
- "Show me productivity tools for students"
- "Projects related to stress and anxiety"
- "Apps that help with burnout"
- "What can help with sleep problems?"
- "Projects about social connection"

## 🛠️ Tech Stack

**Frontend:**
- React 18.2
- CSS (no frameworks - clean and minimal)
- Fetch API for backend communication

**Backend:**
- Node.js with Express
- Axios for DeepSeek API calls
- dotenv for environment variables
- CORS for cross-origin requests

**AI:**
- DeepSeek Chat API
- JSON-structured responses
- System prompts for guidance

## 🔒 Environment Variables

**Server (server/.env):**
```
DEEPSEEK_API_KEY=your_key_here    # Required: Your DeepSeek API key
PORT=3001                          # Optional: Server port (default: 3001)
```

**Client:**
```
REACT_APP_API_URL=http://localhost:3001   # Optional: Backend URL
```

## 🐛 Troubleshooting

### "DEEPSEEK_API_KEY is not set"
- Make sure you created `server/.env` file
- Check that the file contains `DEEPSEEK_API_KEY=your_actual_key`
- Restart the server after adding the key

### Frontend can't connect to backend
- Make sure the backend is running on port 3001
- Check if `http://localhost:3001/api/health` returns a response
- Look for CORS errors in the browser console

### "No projects found"
- The keyword matching might not be finding relevant projects
- Try different search terms
- Add more tags to projects in `server/data/projects.json`

### DeepSeek API errors
- Check your API key is valid
- Verify you have API credits
- Check the console for specific error messages

## 📦 Scripts

**Root directory:**
- `npm run dev` - Run both frontend and backend concurrently
- `npm run server` - Run only backend
- `npm run client` - Run only frontend
- `npm run install-all` - Install all dependencies

**Server directory:**
- `npm start` - Start the server
- `npm run dev` - Start with nodemon (auto-restart)

**Client directory:**
- `npm start` - Start development server
- `npm run build` - Build for production

## 🚀 Deployment

### Backend
- Deploy to Heroku, Railway, or any Node.js hosting
- Set `DEEPSEEK_API_KEY` in environment variables
- Ensure `PORT` is set by the platform or defaults to 3001

### Frontend
- Build: `cd client && npm run build`
- Deploy the `client/build` folder to Netlify, Vercel, or any static host
- Set `REACT_APP_API_URL` to your backend URL

## 🤝 Contributing

This is a starter template. Feel free to:
- Add user authentication
- Implement a real database (PostgreSQL, MongoDB, etc.)
- Add vector search for better project matching
- Implement project favoriting/bookmarking
- Add more AI providers
- Improve the UI with animations

## 📄 License

MIT License - Feel free to use this for your own projects!

## 🙋 Support

For issues with:
- **DeepSeek API**: Visit [platform.deepseek.com](https://platform.deepseek.com)
- **This codebase**: Check the code comments or modify as needed

---

Built with ❤️ using React, Express, and DeepSeek AI
