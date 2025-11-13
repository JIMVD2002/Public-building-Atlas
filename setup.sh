#!/bin/bash

echo "🚀 Studio Archive AI - Lokale Setup"
echo "===================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is niet geïnstalleerd!"
    echo "   Download Node.js van: https://nodejs.org"
    exit 1
fi

echo "✅ Node.js versie: $(node --version)"
echo ""

# Install root dependencies
echo "📦 Installeren root dependencies..."
npm install

# Install server dependencies
echo ""
echo "📦 Installeren server dependencies..."
cd server
npm install

# Install client dependencies
echo ""
echo "📦 Installeren client dependencies..."
cd ../client
npm install

echo ""
echo "✅ Alle dependencies zijn geïnstalleerd!"
echo ""
echo "⚠️  VOLGENDE STAP:"
echo "   1. Ga naar de 'server' folder: cd server"
echo "   2. Kopieer .env.example naar .env: cp .env.example .env"
echo "   3. Voeg je DeepSeek API key toe in server/.env"
echo "   4. API key krijgen op: https://platform.deepseek.com"
echo ""
echo "▶️  APP STARTEN:"
echo "   Ga terug naar root folder en run: npm run dev"
echo ""
