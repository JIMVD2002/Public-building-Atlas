# 🎨 Figma Design Integration Guide

Deze folder bevat instructies voor het vervangen van de huidige UI met jouw Figma designs.

## 📁 Folder Structuur

```
client/src/
├── styles/
│   ├── design-tokens.css    ← Vervang colors, fonts, spacing
│   └── components/           ← Component-specific styles
├── design/
│   ├── FIGMA-INTEGRATION.md  ← Deze file
│   └── assets/               ← Plaats hier je Figma exports
└── components/               ← React components
```

## 🚀 Stap 1: Design Tokens Exporteren uit Figma

### Optie A: Handmatig Design Tokens

1. Open je Figma design
2. Noteer alle **colors, fonts, spacing, en radius** waardes
3. Open: `client/src/styles/design-tokens.css`
4. Vervang de CSS variables met jouw waardes

**Voorbeeld:**
```css
/* In design-tokens.css */
:root {
  --color-primary: #FF5733;        /* Jouw primary color */
  --font-primary: 'Inter', sans-serif;  /* Jouw font */
  --spacing-md: 1.2rem;            /* Jouw spacing */
}
```

### Optie B: Figma Plugin (Aanbevolen)

1. **Installeer Figma Plugin:**
   - [Design Tokens](https://www.figma.com/community/plugin/888356646278934516/Design-Tokens)
   - Of: [Tokens Studio](https://www.figma.com/community/plugin/843461159747178978/Tokens-Studio-for-Figma)

2. **Export tokens als CSS/JSON:**
   ```
   Figma → Plugins → Design Tokens → Export → CSS Variables
   ```

3. **Kopieer en plak** de output in `design-tokens.css`

## 🎨 Stap 2: Components Stylen

### A. ChatInterface Component

**File:** `client/src/components/ChatInterface.jsx`

De component gebruikt CSS classes. Je kunt de styling aanpassen in twee manieren:

**Optie 1: CSS aanpassen**
- Bewerk: `client/src/App.css`
- Classes:
  - `.chat-container` - Main chat box
  - `.message-user` - User message bubble
  - `.message-ai` - AI message bubble
  - `.project-card` - Project cards
  - `.message-input` - Input field
  - `.send-button` - Send button

**Optie 2: Nieuwe Component Styles (Aanbevolen)**

1. Maak: `client/src/styles/components/ChatInterface.css`
2. Kopieer relevante styles uit `App.css`
3. Import in ChatInterface.jsx:
   ```jsx
   import '../../styles/components/ChatInterface.css';
   ```

### B. Export Components uit Figma

Als je **Figma → Code** gebruikt:

1. Select component in Figma
2. Inspect panel → Code → React
3. Kopieer de JSX code
4. Vervang in `client/src/components/ChatInterface.jsx`

## 🖼️ Stap 3: Assets (Icons, Afbeeldingen)

### Plaats Assets:

```
client/src/design/assets/
├── icons/
│   ├── send-icon.svg
│   └── logo.svg
├── images/
│   └── background.png
└── fonts/
    └── CustomFont.woff2
```

### Gebruik in Code:

```jsx
import SendIcon from '../../design/assets/icons/send-icon.svg';

<img src={SendIcon} alt="Send" />
```

### Voor Custom Fonts:

```css
/* In design-tokens.css */
@font-face {
  font-family: 'CustomFont';
  src: url('../design/assets/fonts/CustomFont.woff2') format('woff2');
}

:root {
  --font-primary: 'CustomFont', sans-serif;
}
```

## 🔄 Stap 4: Component Layout Aanpassen

Als je de **layout structuur** wilt veranderen:

### ChatInterface Layout:

**Huidige structuur:**
```jsx
<div className="chat-container">
  <div className="messages-area">
    {/* Messages */}
  </div>
  <form className="input-area">
    {/* Input + Button */}
  </form>
</div>
```

**Vervang met jouw Figma structure:**

1. Open `client/src/components/ChatInterface.jsx`
2. Zoek de `return` statement (rond regel 80)
3. Vervang de JSX met jouw Figma export

**Belangrijk:** Behoud deze logic:
- `messages.map()` loop voor message rendering
- `handleSubmit` voor form submission
- `inputValue` en `setInputValue` voor input control
- `isLoading` state voor loading indicator

## 🎯 Stap 5: Responsive Design

### Mobile Breakpoints:

```css
/* In design-tokens.css or App.css */

/* Tablet */
@media (max-width: 768px) {
  /* Styles */
}

/* Mobile */
@media (max-width: 480px) {
  /* Styles */
}
```

Test op verschillende scherm sizes:
- Desktop: 1920px, 1366px
- Tablet: 768px
- Mobile: 375px, 414px

## 📋 Quick Checklist

- [ ] Design tokens geëxporteerd en vervangen
- [ ] Colors aangepast in `design-tokens.css`
- [ ] Fonts aangepast
- [ ] Spacing & radius aangepast
- [ ] Component styles aangepast in `App.css`
- [ ] Custom icons/images geplaatst in `design/assets/`
- [ ] Responsive design getest
- [ ] Backend (server/) hoeft niet aangepast (alleen frontend!)

## 🛠️ Development Workflow

1. **Start de dev server:**
   ```bash
   cd client
   npm start
   ```

2. **Wijzigingen worden live ververst** (Hot reload)

3. **Test in browser:** http://localhost:3000

4. **Inspect Element** om classes te vinden die je wilt aanpassen

## 💡 Tips

### Snel Testen:
```css
/* Verander één ding tegelijk in design-tokens.css */
:root {
  --color-primary: red; /* Test of het werkt */
}
```

### Figma Dev Mode:
Als je **Figma Dev Mode** hebt:
- Inspect component
- Copy CSS
- Plak in relevante style file

### Component Library:
Als je een **component library** (MUI, Chakra, etc.) wilt gebruiken:
1. Installeer: `npm install @mui/material`
2. Vervang `ChatInterface.jsx` met MUI components
3. Behoud de state logic en handlers

## 📞 Hulp Nodig?

**Files om aan te passen:**
- `client/src/styles/design-tokens.css` - Colors, fonts, spacing
- `client/src/App.css` - Component styles
- `client/src/components/ChatInterface.jsx` - Component structure
- `client/src/design/assets/` - Place your assets here

**Niet aanpassen (backend):**
- `server/` folder - Backend blijft hetzelfde

---

**Happy designing! 🎨**
