# Komorebi OS — Master Protocol

**A personal operating system for Health, Wealth, and Wisdom.**

Komorebi OS is a gamified daily protocol tracker and knowledge management tool. It combines daily habit tracking with a dynamic database of mental models, productivity insights, and investment wisdom.

🔗 **[CLICK HERE TO OPEN THE APP](https://arete.leekelsall.com/)**
*(Note: Replace `yourusername` above with your actual GitHub username)*

## 🎯 Core Features

*   **Daily Alignment:** Rotates daily through 300+ Mental Models, Productivity Hacks, and Stoic Quotes.
*   **Investor of the Week:** A weekly rotating deep-dive into a specific Superinvestor (e.g., Buffett, Druckenmiller) and their core study resources.
*   **Gamified Tracking:** Earn XP for completing protocols.
    *   **Health:** Supplements, Workouts, Aesthetics.
    *   **Mind:** Meditation, Slow Thinking, Gratitude.
    *   **Mastery:** Deep Work, Second Brain, Ultralearning.
*   **Knowledge Library:** A searchable database of all 300+ mental models and book summaries.
*   **Privacy First:** All data is stored locally in your browser. No servers, no login required.

## ⚙️ How to Update the Content (CMS)

The app is designed with a "Headless" architecture. The logic is in `index.html`, but **all content and settings** live in `komorebi-data.js`.

To add new quotes, change checkboxes, or update scoring, you only need to edit one file.

### 1. To Add a New Mental Model or Quote
1. Open `komorebi-data.js`.
2. Scroll to the `library` section.
3. Add your item to the appropriate list:

```javascript
mentalModels: [
    { name: "New Model Name", desc: "Description of how it works." },
    // ... other models
],
