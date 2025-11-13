@echo off
echo 🚀 Studio Archive AI - Lokale Setup
echo ====================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js is niet geïnstalleerd!
    echo    Download Node.js van: https://nodejs.org
    exit /b 1
)

node --version
echo.

REM Install root dependencies
echo 📦 Installeren root dependencies...
call npm install

REM Install server dependencies
echo.
echo 📦 Installeren server dependencies...
cd server
call npm install

REM Install client dependencies
echo.
echo 📦 Installeren client dependencies...
cd ..\client
call npm install

cd ..

echo.
echo ✅ Alle dependencies zijn geïnstalleerd!
echo.
echo ⚠️  VOLGENDE STAP:
echo    1. Ga naar de 'server' folder
echo    2. Kopieer .env.example naar .env
echo    3. Voeg je DeepSeek API key toe in server/.env
echo    4. API key krijgen op: https://platform.deepseek.com
echo.
echo ▶️  APP STARTEN:
echo    Run in root folder: npm run dev
echo.
pause
