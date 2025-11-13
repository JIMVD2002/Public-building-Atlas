# 🚀 Studio Archive AI - Lokaal Gebruiken

## Snelle Start (3 stappen)

### Stap 1: Installeer Dependencies

**Windows:**
```bash
setup.bat
```

**Mac/Linux:**
```bash
chmod +x setup.sh
./setup.sh
```

**Of handmatig:**
```bash
npm install
cd server && npm install
cd ../client && npm install
```

### Stap 2: DeepSeek API Key Instellen

1. **Ga naar de server folder:**
   ```bash
   cd server
   ```

2. **Maak een .env bestand:**
   ```bash
   # Windows:
   copy .env.example .env

   # Mac/Linux:
   cp .env.example .env
   ```

3. **Open `server/.env` in VS Code en voeg je API key toe:**
   ```
   DEEPSEEK_API_KEY=jouw_api_key_hier
   PORT=3001
   ```

4. **API key verkrijgen:**
   - Ga naar: https://platform.deepseek.com
   - Maak een account
   - Genereer een API key
   - Kopieer en plak in `server/.env`

### Stap 3: Start de App

**Terug naar root folder:**
```bash
cd ..
```

**Start beide servers (frontend + backend):**
```bash
npm run dev
```

**Of apart starten:**

Terminal 1 (Backend):
```bash
cd server
npm start
```

Terminal 2 (Frontend):
```bash
cd client
npm start
```

## ✅ Klaar!

De app opent automatisch op: **http://localhost:3000**

Backend draait op: **http://localhost:3001**

## 🧪 Testen

Probeer deze vragen:
- "Wat kan helpen met mentale gezondheid?"
- "Projecten voor productiviteit"
- "Apps tegen stress"

## 📁 Project Structuur in VS Code

```
studio-archive-ai/
├── 📄 server/.env          ← Hier je API key!
├── 📄 server/data/projects.json  ← Student projecten database
├── 🖥️ server/server.js    ← Backend
├── ⚛️ client/src/          ← React frontend
└── 📖 README.md
```

## 🔧 Handige VS Code Commando's

**In VS Code Terminal:**

```bash
# Dependencies installeren
npm run install-all

# App starten (beide servers)
npm run dev

# Alleen backend
npm run server

# Alleen frontend
npm run client
```

## ⚠️ Problemen?

### "DEEPSEEK_API_KEY is not set"
- ✅ Check of `server/.env` bestaat
- ✅ Check of API key erin staat
- ✅ Herstart de server

### "Cannot find module"
- ✅ Run: `npm install` in root, server EN client folders

### "Port 3000 already in use"
- ✅ Stop andere apps op poort 3000
- ✅ Of wijzig de port in `client/package.json`

### "ECONNREFUSED localhost:3001"
- ✅ Check of backend draait
- ✅ Open: http://localhost:3001/api/health

## 📝 Projecten Aanpassen

**Bewerk:** `server/data/projects.json`

```json
{
  "id": 13,
  "title": "Jouw Project",
  "description": "Beschrijving hier",
  "tags": ["tag1", "tag2"]
}
```

Herstart de server en het werkt!

## 🎯 Volgende Stappen

1. ✅ Start de app lokaal
2. ✅ Test met verschillende vragen
3. ✅ Voeg je eigen student projecten toe
4. ✅ Pas de styling aan in `client/src/App.css`
5. ✅ Later: vervang JSON database met PostgreSQL/MongoDB

## 💡 Tips voor VS Code

**Aanbevolen extensies:**
- ES7+ React/Redux snippets
- ESLint
- Prettier

**Terminal openen:**
- `Ctrl + `` (backtick)
- Of: View → Terminal

**Meerdere terminals:**
- Click op `+` icon in terminal
- 1 voor server, 1 voor client

---

**Succes! 🎉**
